-- ====================================================================
-- MIGRATION CRM OPTIMISATION SÛRE - VERSION SIMPLIFIÉE
-- ====================================================================
-- Date: 2025-01-05
-- Objectif: Migration CRM sans index concurrents pour éviter les erreurs
-- Note: Cette version peut être exécutée dans une transaction complète
-- ====================================================================

-- ====================================================================
-- SECTION 1: NETTOYAGE ARCHITECTURE UTILISATEURS
-- ====================================================================

-- 1.1. Supprimer la table users redondante
DROP TABLE IF EXISTS public.users CASCADE;

-- 1.2. Optimiser la structure profiles
ALTER TABLE public.profiles 
  ALTER COLUMN email SET NOT NULL;

-- 1.3. Ajouter contraintes si elles n'existent pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_format') THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_pubkey_format') THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_pubkey_format 
    CHECK (
      pubkey IS NULL OR 
      (length(pubkey) = 66 AND pubkey ~ '^[0-9a-fA-F]{66}$')
    );
  END IF;
END $$;

-- ====================================================================
-- SECTION 2: INDEX ESSENTIELS (NON CONCURRENTS)
-- ====================================================================

-- Index de base pour les performances CRM
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON public.profiles(lower(email));
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- ====================================================================
-- SECTION 3: FONCTIONS OPTIMISÉES
-- ====================================================================

-- 3.1. Fonction pour vérifier les permissions admin
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN := false;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM admin_roles 
        WHERE admin_roles.user_id = $1 
        AND role IN ('super_admin', 'admin', 'moderator')
    ) INTO is_admin;
    
    RETURN COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.2. Fonction pour construire les segments
CREATE OR REPLACE FUNCTION build_segment_members_simple(
    segment_id UUID,
    criteria JSONB
)
RETURNS TABLE(customer_id UUID, email TEXT, nom TEXT, prenom TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as customer_id,
        p.email,
        p.nom,
        p.prenom
    FROM profiles p
    WHERE p.email IS NOT NULL
    AND (
        -- Filtre email vérifié
        CASE WHEN criteria->>'profile'->>'email_verified' = 'true' 
             THEN p.email_verified = true 
             ELSE true END
    )
    AND (
        -- Filtre pubkey existante
        CASE WHEN criteria->>'profile'->>'has_pubkey' = 'true' 
             THEN p.pubkey IS NOT NULL 
             ELSE true END
    );
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- SECTION 4: VUES MATÉRIALISÉES SIMPLIFIÉES
-- ====================================================================

-- 4.1. Vue matérialisée pour les segments (version simple)
DROP MATERIALIZED VIEW IF EXISTS crm_segments_stats_simple;
CREATE MATERIALIZED VIEW crm_segments_stats_simple AS
SELECT 
    s.id,
    s.name,
    s.description,
    s.auto_update,
    s.created_at,
    COUNT(sm.customer_id) as member_count
FROM crm_customer_segments s
LEFT JOIN crm_customer_segment_members sm ON s.id = sm.segment_id
GROUP BY s.id, s.name, s.description, s.auto_update, s.created_at;

CREATE UNIQUE INDEX idx_crm_segments_stats_simple_id ON crm_segments_stats_simple(id);

-- 4.2. Vue matérialisée pour les campagnes (version simple)
DROP MATERIALIZED VIEW IF EXISTS crm_campaigns_stats_simple;
CREATE MATERIALIZED VIEW crm_campaigns_stats_simple AS
SELECT 
    c.id,
    c.name,
    c.subject,
    c.status,
    c.created_at,
    c.sent_at,
    COUNT(es.id) as total_recipients
FROM crm_email_campaigns c
LEFT JOIN crm_email_sends es ON c.id = es.campaign_id
GROUP BY c.id, c.name, c.subject, c.status, c.created_at, c.sent_at;

CREATE UNIQUE INDEX idx_crm_campaigns_stats_simple_id ON crm_campaigns_stats_simple(id);

-- ====================================================================
-- SECTION 5: POLITIQUES RLS OPTIMISÉES
-- ====================================================================

-- Politiques RLS pour les tables CRM
DROP POLICY IF EXISTS "Admin access to segments simple" ON crm_customer_segments;
CREATE POLICY "Admin access to segments simple" ON crm_customer_segments
    FOR ALL USING (is_admin_user());

DROP POLICY IF EXISTS "Admin access to campaigns simple" ON crm_email_campaigns;
CREATE POLICY "Admin access to campaigns simple" ON crm_email_campaigns
    FOR ALL USING (is_admin_user());

-- ====================================================================
-- SECTION 6: TRIGGERS ET AUTOMATISATIONS
-- ====================================================================

-- 6.1. Fonction pour rafraîchir les vues matérialisées
CREATE OR REPLACE FUNCTION refresh_crm_simple_views()
RETURNS TEXT AS $$
BEGIN
    REFRESH MATERIALIZED VIEW crm_segments_stats_simple;
    REFRESH MATERIALIZED VIEW crm_campaigns_stats_simple;
    
    RETURN 'Simple CRM views refreshed at ' || NOW()::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 6.2. Trigger pour mise à jour automatique des segments
CREATE OR REPLACE FUNCTION auto_update_segments_simple()
RETURNS TRIGGER AS $$
DECLARE
    segment_record RECORD;
BEGIN
    -- Mettre à jour les segments auto-update
    FOR segment_record IN 
        SELECT id, criteria FROM crm_customer_segments 
        WHERE auto_update = true
        LIMIT 5 -- Limiter pour éviter les timeouts
    LOOP
        -- Supprimer les anciens membres
        DELETE FROM crm_customer_segment_members 
        WHERE segment_id = segment_record.id;
        
        -- Ajouter les nouveaux membres
        INSERT INTO crm_customer_segment_members (segment_id, customer_id)
        SELECT segment_record.id, customer_id
        FROM build_segment_members_simple(segment_record.id, segment_record.criteria);
    END LOOP;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- SECTION 7: CONTRAINTES ESSENTIELLES
-- ====================================================================

-- Contraintes sur les campagnes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'campaigns_status_valid') THEN
    ALTER TABLE crm_email_campaigns 
    ADD CONSTRAINT campaigns_status_valid
      CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled'));
  END IF;
END $$;

-- Contraintes sur les segments
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'segments_name_not_empty') THEN
    ALTER TABLE crm_customer_segments
    ADD CONSTRAINT segments_name_not_empty
      CHECK (length(trim(name)) > 0);
  END IF;
END $$;

-- ====================================================================
-- SECTION 8: FONCTIONS DE DIAGNOSTIC
-- ====================================================================

-- Vue pour monitorer les performances (version simplifiée)
CREATE OR REPLACE VIEW crm_performance_monitor_simple AS
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename LIKE '%crm_%';

-- Fonction de diagnostic simple
CREATE OR REPLACE FUNCTION diagnose_crm_simple()
RETURNS TABLE(
    metric_name TEXT,
    metric_value TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Total Profiles'::TEXT,
        COUNT(*)::TEXT
    FROM profiles
    
    UNION ALL
    
    SELECT 
        'CRM Segments'::TEXT,
        COUNT(*)::TEXT
    FROM crm_customer_segments
    
    UNION ALL
    
    SELECT 
        'Email Campaigns'::TEXT,
        COUNT(*)::TEXT
    FROM crm_email_campaigns
    
    UNION ALL
    
    SELECT 
        'Database Size'::TEXT,
        pg_size_pretty(pg_database_size(current_database()))
    
    UNION ALL
    
    SELECT 
        'Largest Table'::TEXT,
        (SELECT schemaname||'.'||tablename 
         FROM pg_tables t 
         ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC 
         LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- Fonction de diagnostic des performances des tables
CREATE OR REPLACE FUNCTION diagnose_table_performance()
RETURNS TABLE(
    table_name TEXT,
    size_mb NUMERIC,
    row_count BIGINT,
    index_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::TEXT,
        ROUND((pg_total_relation_size(t.table_name::regclass) / 1024.0 / 1024.0)::NUMERIC, 2) as size_mb,
        COALESCE(s.n_tup_ins - s.n_tup_del, 0) as row_count,
        (SELECT COUNT(*) FROM pg_indexes WHERE tablename = t.table_name)::INTEGER as index_count
    FROM information_schema.tables t
    LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
    WHERE t.table_schema = 'public' 
    AND (t.table_name LIKE 'crm_%' OR t.table_name IN ('profiles', 'orders'))
    AND t.table_type = 'BASE TABLE'
    ORDER BY size_mb DESC;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- FINALISATION
-- ====================================================================

-- Analyser les statistiques
ANALYZE;

-- Rafraîchir les vues
SELECT refresh_crm_simple_views();

-- Afficher le résumé
DO $$
BEGIN
    RAISE NOTICE '====================================================================';
    RAISE NOTICE 'MIGRATION CRM SIMPLIFIÉE TERMINÉE AVEC SUCCÈS';
    RAISE NOTICE '====================================================================';
    RAISE NOTICE 'Tables CRM: %', (
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name LIKE 'crm_%'
    );
    RAISE NOTICE 'Vues matérialisées: %', (
        SELECT COUNT(*) FROM pg_matviews 
        WHERE schemaname = 'public' AND matviewname LIKE '%crm_%'
    );
    RAISE NOTICE '====================================================================';
    RAISE NOTICE 'Exécuter "SELECT * FROM diagnose_crm_simple();" pour un diagnostic';
    RAISE NOTICE '====================================================================';
END $$; 