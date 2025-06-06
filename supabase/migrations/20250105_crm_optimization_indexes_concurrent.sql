-- ====================================================================
-- MIGRATION INDEX CONCURRENTS CRM - OPTIMISATION AVANCÉE
-- ====================================================================
-- Date: 2025-01-05
-- Objectif: Création d'index concurrents pour optimiser les performances CRM
-- Note: Ces index doivent être exécutés APRÈS la migration principale
--       et peuvent être exécutés en production sans blocage
-- ====================================================================

-- IMPORTANT: Ces commandes doivent être exécutées UNE PAR UNE
-- via psql ou le dashboard Supabase, PAS dans une transaction

-- ====================================================================
-- INDEX CONCURRENTS POUR HAUTES PERFORMANCES
-- ====================================================================

-- Index composite pour requêtes de segmentation avancées
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_crm_advanced_segmentation 
ON public.profiles(email_verified, created_at, t4g_tokens, pubkey) 
WHERE email_verified = true AND pubkey IS NOT NULL;

-- Index pour recherches textuelles sur noms et prénoms
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_fulltext_search 
ON public.profiles USING gin(to_tsvector('french', coalesce(nom, '') || ' ' || coalesce(prenom, '')));

-- Index composite pour analytics des commandes par période
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_period_analytics 
ON public.orders(date_trunc('month', created_at), product_type, payment_status, amount) 
WHERE payment_status = true;

-- Index pour requêtes de revenus par utilisateur
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_revenue 
ON public.orders(user_id, payment_status, amount, created_at) 
WHERE payment_status = true;

-- Index pour recherches sur les emails de campagnes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_email_sends_email_status 
ON crm_email_sends(email, status, sent_at);

-- Index pour analytics temporelles des envois
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_email_sends_temporal 
ON crm_email_sends(date_trunc('hour', sent_at), status) 
WHERE sent_at IS NOT NULL;

-- Index composite pour performance des segments
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_segments_performance 
ON crm_customer_segment_members(segment_id, customer_id, added_at);

-- Index pour recherches sur contenu des campagnes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_campaigns_content_search 
ON crm_email_campaigns USING gin(to_tsvector('french', name || ' ' || subject || ' ' || content));

-- Index pour optimiser les jointures entre campagnes et envois
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_campaigns_sends_join 
ON crm_email_sends(campaign_id, status, created_at);

-- Index pour analytics des templates
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_templates_usage 
ON crm_email_campaigns(template_id, status, created_at) 
WHERE template_id IS NOT NULL;

-- ====================================================================
-- INDEX SPÉCIALISÉS POUR REACT ADMIN
-- ====================================================================

-- Index pour pagination et tri dans React Admin
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_react_admin_list 
ON public.profiles(created_at DESC, email, id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_react_admin_list 
ON public.orders(created_at DESC, payment_status, user_id, id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_campaigns_react_admin_list 
ON crm_email_campaigns(created_at DESC, status, name, id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_crm_segments_react_admin_list 
ON crm_customer_segments(created_at DESC, auto_update, name, id);

-- ====================================================================
-- INDEX POUR OPTIMISATION DES VUES MATÉRIALISÉES
-- ====================================================================

-- Index pour accélérer le calcul des statistiques des segments
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_segment_members_stats 
ON crm_customer_segment_members(segment_id) 
INCLUDE (customer_id, added_at);

-- Index pour optimiser les calculs de revenus moyens
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_revenue_calculations 
ON public.orders(user_id, payment_status) 
INCLUDE (amount, product_type, created_at) 
WHERE payment_status = true;

-- ====================================================================
-- INDEX PARTIELS POUR OPTIMISATION MÉMOIRE
-- ====================================================================

-- Index uniquement sur les profils actifs récents
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_active_recent 
ON public.profiles(last_node_sync, email_verified, created_at) 
WHERE last_node_sync > NOW() - INTERVAL '30 days' 
AND email_verified = true;

-- Index sur les campagnes en cours ou récentes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_current 
ON crm_email_campaigns(status, scheduled_at, sent_at) 
WHERE status IN ('scheduled', 'sending', 'sent') 
AND (scheduled_at > NOW() - INTERVAL '7 days' OR sent_at > NOW() - INTERVAL '7 days');

-- Index sur les envois récents pour analytics temps réel
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_sends_recent 
ON crm_email_sends(campaign_id, status, sent_at) 
WHERE sent_at > NOW() - INTERVAL '7 days';

-- ====================================================================
-- VALIDATION DES INDEX CRÉÉS
-- ====================================================================

-- Fonction pour vérifier l'état des index concurrents
CREATE OR REPLACE FUNCTION check_concurrent_indexes_status()
RETURNS TABLE(
    index_name TEXT,
    table_name TEXT,
    is_valid BOOLEAN,
    size_mb NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.indexname::TEXT,
        i.tablename::TEXT,
        NOT indisvalid as is_valid,
        ROUND((pg_relation_size(i.indexname::regclass) / 1024.0 / 1024.0)::NUMERIC, 2) as size_mb
    FROM pg_indexes i
    JOIN pg_class c ON c.relname = i.indexname
    JOIN pg_index idx ON idx.indexrelid = c.oid
    WHERE i.schemaname = 'public'
    AND (i.tablename LIKE '%crm_%' OR i.tablename = 'profiles' OR i.tablename = 'orders')
    AND i.indexname LIKE '%concurrent%' OR i.indexname LIKE '%crm_%' OR i.indexname LIKE '%profiles_%' OR i.indexname LIKE '%orders_%'
    ORDER BY size_mb DESC;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- INSTRUCTIONS D'EXÉCUTION
-- ====================================================================

/*
INSTRUCTIONS POUR EXÉCUTER CETTE MIGRATION :

1. Cette migration doit être exécutée APRÈS la migration principale
2. Chaque commande CREATE INDEX CONCURRENTLY doit être exécutée individuellement
3. En production, ces index peuvent être créés sans arrêter le service

EXEMPLE D'EXÉCUTION VIA PSQL :
```
-- Se connecter à Supabase
psql "postgresql://[user]:[password]@[host]:5432/[database]"

-- Exécuter chaque index un par un
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_crm_advanced_segmentation 
ON public.profiles(email_verified, created_at, t4g_tokens, pubkey) 
WHERE email_verified = true AND pubkey IS NOT NULL;

-- Continuer avec les autres index...
```

VÉRIFICATION :
-- Vérifier l'état des index
SELECT * FROM check_concurrent_indexes_status();
*/ 