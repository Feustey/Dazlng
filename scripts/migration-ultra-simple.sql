-- Script de migration ULTRA-SIMPLE pour product_type
-- Sans requêtes système complexes - Compatible toutes versions PostgreSQL

-- =====================================================
-- ÉTAPE 1: VOIR L'ÉTAT ACTUEL
-- =====================================================

SELECT 'AVANT MIGRATION: État actuel' as titre;

SELECT 
  product_type,
  COUNT(*) as nb_commandes
FROM orders 
WHERE product_type IS NOT NULL
GROUP BY product_type 
ORDER BY product_type;

-- =====================================================
-- ÉTAPE 2: MIGRER LES DONNÉES (sans contrainte d'abord)
-- =====================================================

-- Supprimer toutes les contraintes existantes
ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_product_type;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_product_type;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_type_check;

-- Migrer les données vers les valeurs minuscules
UPDATE orders SET product_type = 'dazbox' WHERE product_type ILIKE 'dazbox%' OR product_type = 'DazBox';
UPDATE orders SET product_type = 'daznode' WHERE product_type ILIKE 'daznode%' OR product_type = 'DazNode';
UPDATE orders SET product_type = 'dazpay' WHERE product_type ILIKE 'dazpay%' OR product_type = 'DazPay';

-- =====================================================
-- ÉTAPE 3: VÉRIFIER APRÈS MIGRATION
-- =====================================================

SELECT 'APRÈS MIGRATION: Nouvel état' as titre;

SELECT 
  product_type,
  COUNT(*) as nb_commandes
FROM orders 
WHERE product_type IS NOT NULL
GROUP BY product_type 
ORDER BY product_type;

-- =====================================================
-- ÉTAPE 4: CRÉER LA CONTRAINTE SI TOUT EST OK
-- =====================================================

-- Vérifier qu'il n'y a que les valeurs autorisées
SELECT 
  COUNT(*) as lignes_non_conformes
FROM orders 
WHERE product_type IS NOT NULL 
AND product_type NOT IN ('daznode', 'dazbox', 'dazpay');

-- Si le résultat ci-dessus est 0, alors on peut créer la contrainte
ALTER TABLE orders ADD CONSTRAINT valid_product_type 
CHECK (product_type IN ('daznode', 'dazbox', 'dazpay'));

-- =====================================================
-- ÉTAPE 5: TEST FINAL
-- =====================================================

SELECT 'TEST: Insertion d''une commande test' as titre;

-- Test d'insertion (sera supprimé après)
INSERT INTO orders (product_type, amount, payment_method, metadata) 
VALUES ('dazbox', 100000, 'lightning', '{}');

-- Vérifier que ça marche
SELECT 'Test réussi: commande dazbox insérée' as resultat
WHERE EXISTS (
  SELECT 1 FROM orders 
  WHERE product_type = 'dazbox' 
  AND amount = 100000 
  AND payment_method = 'lightning'
);

-- Nettoyer le test
DELETE FROM orders 
WHERE product_type = 'dazbox' 
AND amount = 100000 
AND payment_method = 'lightning';

SELECT 'Migration terminée avec succès!' as final; 