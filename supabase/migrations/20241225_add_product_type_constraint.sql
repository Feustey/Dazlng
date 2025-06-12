-- Migration pour ajouter la contrainte valid_product_type
-- Date: 2024-12-25

-- Supprimer la contrainte existante si elle existe
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS valid_product_type;

-- Ajouter la contrainte valid_product_type
ALTER TABLE public.orders 
ADD CONSTRAINT valid_product_type 
CHECK (product_type IN ('daznode', 'dazbox', 'dazpay'));

-- Index pour optimiser les requêtes sur product_type
CREATE INDEX IF NOT EXISTS idx_orders_product_type ON public.orders(product_type);

-- Commentaire pour la documentation
COMMENT ON CONSTRAINT valid_product_type ON public.orders IS 'Ensure product_type is one of: daznode, dazbox, dazpay'; 