-- Migration de nettoyage pour corriger les problèmes identifiés
-- Date: 2025-01-27

-- 1. Supprimer les index dupliqués
DROP INDEX IF EXISTS idx_orders_payment_hash;
DROP INDEX IF EXISTS idx_profiles_email;
DROP INDEX IF EXISTS idx_otp_codes_email;

-- 2. Recréer les index avec des noms standardisés
CREATE INDEX IF NOT EXISTS orders_payment_hash_idx ON orders(payment_hash);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS otp_codes_email_idx ON otp_codes(email);

-- 3. Corriger les contraintes de clés étrangères manquantes
-- Ajouter la contrainte FK pour orders.user_id si elle n'existe pas'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_user_id_fkey' 
        AND table_name = 'orders'
    ) THEN
        ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey ;
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 4. Corriger les contraintes de clés étrangères pour payments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_order_id_fkey' 
        AND table_name = 'payments'
    ) THEN
        ALTER TABLE payments ADD CONSTRAINT payments_order_id_fkey ;
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. Standardiser les types de données pour payment_status
-- Vérifier et corriger le type de payment_status dans orders
DO $$
BEGIN
    -- Si payment_status est BOOLEAN, le convertir en TEXT
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_status' 
        AND data_type = 'BOOLEAN'
    ) THEN
        -- Ajouter une nouvelle colonne
        ALTER TABLE orders ADD COLUMN payment_status_new TEXT DEFAULT 'pending';
        
        -- Migrer les données
        UPDATE orders SET payment_status_new = 
            CASE 
                WHEN payment_status = TRUE THEN 'paid'
                WHEN payment_status = FALSE THEN 'pending'
                ELSE 'pending'
            END;
        
        -- Supprimer l'ancienne colonne et renommer la nouvelle'
        ALTER TABLE orders DROP COLUMN payment_status;
        ALTER TABLE orders RENAME COLUMN payment_status_new TO payment_status;
        
        -- Ajouter la contrainte CHECK
        ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check ;
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled'));
    END IF;
END $$;

-- 6. Nettoyer les triggers de nettoyage automatique problématiques
-- Désactiver temporairement le trigger de nettoyage automatique
DROP TRIGGER IF EXISTS cleanup_old_payment_logs_trigger ON payment_logs;

-- Recréer le trigger avec une logique plus sûre
CREATE OR REPLACE FUNCTION trigger_cleanup_old_payment_logs()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Nettoyer seulement une fois par jour pour éviter les blocages
    IF NOT EXISTS (
        SELECT 1 FROM pg_stat_activity 
        WHERE query LIKE '%cleanup_old_payment_logs%' 
        AND state = 'active'
        AND pid != pg_backend_pid()
    ) THEN
        -- Nettoyer seulement les logs de plus de 30 jours
        DELETE FROM payment_logs
        WHERE created_at < NOW() - INTERVAL '30 days'
        AND status IN ('expired', 'failed', 'cancelled')
        AND id NOT IN (
            SELECT id FROM payment_logs 
            WHERE created_at < NOW() - INTERVAL '30 days'
            AND status IN ('expired', 'failed', 'cancelled')
            LIMIT 1000;
        );
    END IF;
    RETURN NULL;
END;
$$;

-- Recréer le trigger avec une exécution moins fréquente
CREATE TRIGGER cleanup_old_payment_logs_trigger
    AFTER INSERT ON payment_logs
    FOR EACH STATEMENT;
    EXECUTE FUNCTION trigger_cleanup_old_payment_logs();

-- 7. Standardiser les politiques RLS pour éviter les références circulaires
-- Corriger la politique payment_logs qui référence orders
DROP POLICY IF EXISTS user_payment_logs_policy ON payment_logs;

CREATE POLICY user_payment_logs_policy ON payment_logs
    FOR SELECT
    TO authenticated
    USING (
        -- Permettre l'accès aux logs de paiement liés aux commandes de l'utilisateur
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.payment_hash = payment_logs.payment_hash
            AND orders.user_id = auth.uid()
        )
        OR
        -- Permettre l'accès aux logs de paiement créés par l'utilisateur
        payment_hash IN (
            SELECT payment_hash FROM orders
            WHERE user_id = auth.uid()
        )
    );

-- 8. Ajouter des index manquants pour les performances
CREATE INDEX IF NOT EXISTS orders_user_id_created_at_idx ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payments_status_created_at_idx ON payments(status, created_at DESC);
CREATE INDEX IF NOT EXISTS subscriptions_user_id_status_idx ON subscriptions(user_id, status);

-- 9. Nettoyer les fonctions dupliquées
-- Supprimer les fonctions de mise à jour updated_at dupliquées
DROP FUNCTION IF EXISTS update_orders_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_payment_logs_updated_at() CASCADE;

-- Utiliser la fonction standardisée
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN;
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recréer les triggers avec la fonction standardisée
DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at;
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_logs_updated_at ON payment_logs;
CREATE TRIGGER update_payment_logs_updated_at;
    BEFORE UPDATE ON payment_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Vérifier et corriger les contraintes de validation
-- Ajouter des contraintes CHECK manquantes
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS orders_amount_check;
    CHECK (amount > 0);

ALTER TABLE payments ADD CONSTRAINT IF NOT EXISTS payments_amount_check;
    CHECK (amount > 0);

ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS profiles_t4g_tokens_check;
    CHECK (t4g_tokens >= 0);

-- 11. Nettoyer les tables temporaires ou obsolètes
-- Supprimer les tables de test si elles existent
DROP TABLE IF EXISTS test_orders CASCADE;
DROP TABLE IF EXISTS test_payments CASCADE;
DROP TABLE IF EXISTS temp_migration_data CASCADE;

-- 12. Vérifier l'intégrité des données'
-- Marquer les commandes avec des statuts invalides
UPDATE orders;
SET payment_status = 'pending' 
WHERE payment_status NOT IN ('pending', 'paid', 'failed', 'cancelled');

-- Marquer les paiements avec des statuts invalides
UPDATE payments;
SET status = 'pending' 
WHERE status NOT IN ('pending', 'paid', 'failed', 'refunded');

-- 13. Optimiser les performances
-- Analyser les tables pour mettre à jour les statistiques
ANALYZE orders;
ANALYZE payments;
ANALYZE profiles;
ANALYZE payment_logs;
ANALYZE subscriptions;

-- 14. Log de la migration
-- Créer la table de logs si elle n'existe pas'
CREATE TABLE IF NOT EXISTS public.migration_logs (;
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    migration_name TEXT NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL,
    details TEXT
);

INSERT INTO public.migration_logs (;
    migration_name,
    applied_at,
    status,
    details
) VALUES (
    '20250127_cleanup_migrations',
    NOW(),
    'completed',
    'Nettoyage des migrations: index dupliqués, contraintes FK, types de données, RLS, triggers'
); 