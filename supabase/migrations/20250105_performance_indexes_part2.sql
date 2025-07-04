-- Migration pour l'optimisation des performances - Partie 2'
-- Abonnements et Logs
-- IMPORTANT: Exécuter ce fichier SÉPARÉMENT, PAS dans une transaction

-- Index pour les abonnements actifs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_active;
ON public.subscriptions(user_id, status)
WHERE status = 'active';

-- Index pour les statistiques d'abonnement'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_stats;
ON public.subscriptions(plan_id, status, created_at);

-- Index pour la recherche des logs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_logs_search;
ON public.payment_logs(payment_hash, status, created_at DESC);

-- Index pour les statistiques de logs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_logs_stats;
ON public.payment_logs(status, created_at)
INCLUDE (amount);

-- Index pour la recherche des livraisons
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deliveries_search;
ON public.deliveries(order_id, shipping_status, created_at DESC);

-- Index pour les statistiques de livraison
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deliveries_stats;
ON public.deliveries(shipping_status, created_at)
WHERE shipping_status IN ('pending', 'shipped');

-- Index pour les statistiques temporelles
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_network_stats_temporal;
ON public.network_stats(timestamp DESC); 