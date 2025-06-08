-- Script FINAL pour corriger définitivement la contrainte product_type
-- Ce script harmonise la base de données avec le code application

-- =====================================================
-- ÉTAPE 1: SUPPRIMER TOUTES LES CONTRAINTES EXISTANTES
-- =====================================================

-- Supprimer toutes les contraintes de product_type qui peuvent exister
ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_product_type;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_product_type;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_type_check;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_type_valid;

-- =====================================================
-- ÉTAPE 2: CRÉER LA CONTRAINTE FINALE ALIGNÉE SUR LE CODE
-- =====================================================

-- Permettre uniquement les valeurs minuscules utilisées dans le code TypeScript
ALTER TABLE orders ADD CONSTRAINT valid_product_type 
CHECK (product_type IN ('daznode', 'dazbox', 'dazpay'));

-- =====================================================
-- ÉTAPE 3: MIGRER LES DONNÉES EXISTANTES
-- =====================================================

-- Convertir les anciennes valeurs vers le nouveau format
UPDATE orders SET product_type = 'dazbox' WHERE product_type ILIKE '%dazbox%';
UPDATE orders SET product_type = 'daznode' WHERE product_type ILIKE '%daznode%';
UPDATE orders SET product_type = 'dazpay' WHERE product_type ILIKE '%dazpay%';

-- =====================================================
-- ÉTAPE 4: VÉRIFICATION
-- =====================================================

-- Test d'insertion pour vérifier que ça fonctionne
-- INSERT INTO orders (product_type, amount, payment_method) 
-- VALUES ('dazbox', 100000, 'lightning');

-- Afficher le nombre de commandes par type de produit
SELECT product_type, COUNT(*) as count 
FROM orders 
GROUP BY product_type;

-- =====================================================
-- ÉTAPE 5: COMMIT ET VALIDATION
-- =====================================================

-- Si tout fonctionne bien, les nouvelles commandes DazBox devraient s'insérer sans erreur
COMMIT; 