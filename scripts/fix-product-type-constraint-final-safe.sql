-- Script SÉCURISÉ pour corriger la contrainte product_type
-- Ce script migre d'abord les données existantes avant de créer la contrainte

-- =====================================================
-- ÉTAPE 1: DIAGNOSTIC - Voir les valeurs actuelles
-- =====================================================

SELECT 'Valeurs product_type actuelles:' as info;
SELECT product_type, COUNT(*) as count 
FROM orders 
WHERE product_type IS NOT NULL
GROUP BY product_type 
ORDER BY product_type;

-- =====================================================
-- ÉTAPE 2: MIGRATION DES DONNÉES EXISTANTES
-- =====================================================

-- Migrer toutes les variantes vers les valeurs minuscules standards
UPDATE orders SET product_type = 'dazbox' WHERE product_type ILIKE '%dazbox%' OR product_type = 'DazBox';
UPDATE orders SET product_type = 'daznode' WHERE product_type ILIKE '%daznode%' OR product_type = 'DazNode';
UPDATE orders SET product_type = 'dazpay' WHERE product_type ILIKE '%dazpay%' OR product_type = 'DazPay';

-- Gérer les valeurs spécifiques mentionnées dans l'ancien script
UPDATE orders SET product_type = 'daznode' WHERE product_type IN (
  'DazNode Basic', 
  'DazNode Premium',
  'DazNode Free',
  'Daznode AI Add-on'
);

UPDATE orders SET product_type = 'dazbox' WHERE product_type IN (
  'Dazbox Lightning Node'
);

-- =====================================================
-- ÉTAPE 3: VÉRIFICATION POST-MIGRATION
-- =====================================================

SELECT 'Valeurs après migration:' as info;
SELECT product_type, COUNT(*) as count 
FROM orders 
WHERE product_type IS NOT NULL
GROUP BY product_type 
ORDER BY product_type;

-- Identifier les valeurs problématiques restantes
SELECT 'Valeurs non conformes restantes:' as info;
SELECT DISTINCT product_type, COUNT(*) as count
FROM orders 
WHERE product_type IS NOT NULL 
AND product_type NOT IN ('daznode', 'dazbox', 'dazpay')
GROUP BY product_type;

-- =====================================================
-- ÉTAPE 4: SUPPRIMER LES CONTRAINTES EXISTANTES
-- =====================================================

ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_product_type;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_product_type;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_type_check;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_type_valid;

-- =====================================================
-- ÉTAPE 5: CRÉER LA NOUVELLE CONTRAINTE
-- =====================================================

-- Seulement si toutes les données sont conformes
DO $$
DECLARE
    non_compliant_count INTEGER;
BEGIN
    -- Compter les lignes non conformes
    SELECT COUNT(*) INTO non_compliant_count
    FROM orders 
    WHERE product_type IS NOT NULL 
    AND product_type NOT IN ('daznode', 'dazbox', 'dazpay');
    
    IF non_compliant_count = 0 THEN
        -- Toutes les données sont conformes, on peut créer la contrainte
        ALTER TABLE orders ADD CONSTRAINT valid_product_type 
        CHECK (product_type IN ('daznode', 'dazbox', 'dazpay'));
        
        RAISE NOTICE 'Contrainte valid_product_type créée avec succès!';
    ELSE
        RAISE NOTICE 'ATTENTION: % lignes non conformes détectées. Contrainte NON créée.', non_compliant_count;
        RAISE NOTICE 'Vérifiez les valeurs non conformes ci-dessus et corrigez-les manuellement.';
    END IF;
END $$;

-- =====================================================
-- ÉTAPE 6: VÉRIFICATION FINALE
-- =====================================================

SELECT 'État final:' as info;
SELECT product_type, COUNT(*) as count 
FROM orders 
GROUP BY product_type 
ORDER BY product_type;

-- Test d'insertion pour vérifier que ça fonctionne
-- INSERT INTO orders (product_type, amount, payment_method, metadata) 
-- VALUES ('dazbox', 100000, 'lightning', '{}');
-- DELETE FROM orders WHERE amount = 100000 AND payment_method = 'lightning'; -- Nettoyer le test

SELECT 'Script terminé!' as info; 