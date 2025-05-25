-- Ajouter la colonne payment_hash à la table orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_hash TEXT;

-- Créer un index sur payment_hash pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_orders_payment_hash ON orders(payment_hash);

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN orders.payment_hash IS 'Hash de paiement Lightning utilisé pour identifier et vérifier les paiements'; 