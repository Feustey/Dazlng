-- Migration pour l'optimisation des performances avec des index concurrents
-- À exécuter en production sans downtime

-- ====================================================================
-- INDEX POUR LES PROFILS UTILISATEURS
-- ====================================================================

-- Index pour la recherche et le tri des profils
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_search 
ON public.profiles USING gin(to_tsvector('french', email || ' ' || nom || ' ' || prenom));

-- Index pour les statistiques de profil
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_stats 
ON public.profiles(t4g_tokens, created_at)
INCLUDE (email_verified, node_id);

-- Index pour les profils actifs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_active 
ON public.profiles(last_node_sync, email_verified)
WHERE email_verified = true;

-- ====================================================================
-- INDEX POUR LES COMMANDES ET PAIEMENTS
-- ====================================================================

-- Index pour la recherche des commandes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_search 
ON public.orders(user_id, created_at DESC)
INCLUDE (payment_status, amount);

-- Index pour les statistiques de paiement
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_payment_stats 
ON public.orders(payment_status, created_at)
WHERE payment_status = true;

-- Index pour les paiements Lightning
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_lightning 
ON public.orders(payment_hash)
WHERE payment_method = 'lightning' AND payment_hash IS NOT NULL;

-- ====================================================================
-- INDEX POUR LES ABONNEMENTS
-- ====================================================================

-- Index pour les abonnements actifs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_active 
ON public.subscriptions(user_id, status)
WHERE status = 'active';

-- Index pour les statistiques d'abonnement
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_stats 
ON public.subscriptions(plan_id, status, created_at);

-- ====================================================================
-- INDEX POUR LES LOGS DE PAIEMENT
-- ====================================================================

-- Index pour la recherche des logs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_logs_search 
ON public.payment_logs(payment_hash, status, created_at DESC);

-- Index pour les statistiques de logs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_logs_stats 
ON public.payment_logs(status, created_at)
INCLUDE (amount);

-- ====================================================================
-- INDEX POUR LES LIVRAISONS
-- ====================================================================

-- Index pour la recherche des livraisons
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deliveries_search 
ON public.deliveries(order_id, shipping_status, created_at DESC);

-- Index pour les statistiques de livraison
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deliveries_stats 
ON public.deliveries(shipping_status, created_at)
WHERE shipping_status IN ('pending', 'shipped');

-- ====================================================================
-- INDEX POUR LES STATISTIQUES RÉSEAU
-- ====================================================================

-- Index pour les statistiques temporelles
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_network_stats_temporal 
ON public.network_stats(timestamp DESC);

-- ====================================================================
-- FONCTIONS DE MAINTENANCE
-- ====================================================================

-- Fonction pour analyser les index
CREATE OR REPLACE FUNCTION analyze_index_usage()
RETURNS TABLE (
    schemaname text,
    tablename text,
    indexname text,
    idx_scan bigint,
    idx_tup_read bigint,
    idx_tup_fetch bigint,
    index_size text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.schemaname,
        s.relname AS tablename,
        s.indexrelname AS indexname,
        s.idx_scan,
        s.idx_tup_read,
        s.idx_tup_fetch,
        pg_size_pretty(pg_relation_size(i.indexrelid)) as index_size
    FROM pg_stat_user_indexes s
    JOIN pg_index i ON s.indexrelid = i.indexrelid
    WHERE s.idx_scan = 0 -- Index non utilisés
    ORDER BY pg_relation_size(i.indexrelid) DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer les index inutilisés
CREATE OR REPLACE FUNCTION cleanup_unused_indexes(
    min_days_unused int DEFAULT 30,
    dry_run boolean DEFAULT true
) RETURNS TABLE (
    index_name text,
    table_name text,
    action text
) AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT 
            schemaname,
            tablename,
            indexname,
            idx_scan,
            pg_relation_size(i.indexrelid) as index_size
        FROM pg_stat_user_indexes s
        JOIN pg_index i ON s.indexrelid = i.indexrelid
        WHERE 
            s.idx_scan = 0
            AND NOT i.indisprimary
            AND NOT i.indisunique
            AND age(now(), stats_reset) > min_days_unused * interval '1 day'
    LOOP
        index_name := r.indexname;
        table_name := r.tablename;
        
        IF NOT dry_run THEN
            EXECUTE format('DROP INDEX CONCURRENTLY IF EXISTS %I.%I', r.schemaname, r.indexname);
            action := 'DROPPED';
        ELSE
            action := 'WOULD DROP';
        END IF;
        
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql; 