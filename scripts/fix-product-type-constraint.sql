-- Script pour corriger la contrainte product_type
-- À exécuter dans le SQL Editor de Supabase

-- ===== ÉTAPE 1: IDENTIFIER ET SUPPRIMER LA CONTRAINTE EXISTANTE =====
-- Supprimer la contrainte existante qui bloque l'insertion
ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_product_type;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_product_type;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_type_check;

-- ===== ÉTAPE 2: CRÉER UNE NOUVELLE CONTRAINTE PERMISSIVE =====
-- Permettre toutes les valeurs de produits utilisées dans l'application
ALTER TABLE orders ADD CONSTRAINT valid_product_type 
CHECK (product_type IN (
  'DazBox',
  'DazNode',
  'DazNode Basic', 
  'DazNode Premium',
  'DazNode Free',
  'Dazbox',
  'Daznode',
  'Dazbox Lightning Node',
  'Daznode AI Add-on'
));

-- ===== ALTERNATIVE: SUPPRIMER COMPLÈTEMENT LA CONTRAINTE =====
-- Si la contrainte ci-dessus ne fonctionne pas, décommentez cette ligne:
-- ALTER TABLE orders DROP CONSTRAINT valid_product_type;

-- ===== ÉTAPE 3: VÉRIFICATION =====
-- Tester l'insertion d'une commande de test
-- INSERT INTO orders (product_type, customer, product, total) 
-- VALUES ('DazBox', '{}', '{}', 0);
-- DELETE FROM orders WHERE total = 0; -- Nettoyer le test 