-- Script de diagnostic FINAL - sans requêtes système
-- Compatible avec toutes les versions de PostgreSQL

-- =========================================
-- 1. VOIR LES VALEURS PRODUCT_TYPE ACTUELLES
-- =========================================

SELECT 'STEP 1: Valeurs product_type dans la base' as etape;

SELECT 
  product_type,
  COUNT(*) as nb_commandes
FROM orders 
WHERE product_type IS NOT NULL
GROUP BY product_type 
ORDER BY product_type;

-- =========================================
-- 2. STATUT DE CONFORMITÉ
-- =========================================

SELECT 'STEP 2: Analyse de conformité' as etape;

SELECT 
  COUNT(*) as total_commandes,
  SUM(CASE WHEN product_type = 'dazbox' THEN 1 ELSE 0 END) as dazbox_ok,
  SUM(CASE WHEN product_type = 'DazBox' THEN 1 ELSE 0 END) as dazbox_a_migrer,
  SUM(CASE WHEN product_type = 'daznode' THEN 1 ELSE 0 END) as daznode_ok,
  SUM(CASE WHEN product_type = 'DazNode' THEN 1 ELSE 0 END) as daznode_a_migrer,
  SUM(CASE WHEN product_type = 'dazpay' THEN 1 ELSE 0 END) as dazpay_ok,
  SUM(CASE WHEN product_type = 'DazPay' THEN 1 ELSE 0 END) as dazpay_a_migrer,
  SUM(CASE WHEN product_type NOT IN ('dazbox', 'DazBox', 'daznode', 'DazNode', 'dazpay', 'DazPay') 
           AND product_type IS NOT NULL THEN 1 ELSE 0 END) as autres_valeurs
FROM orders;

-- =========================================
-- 3. EXEMPLE DE COMMANDES RÉCENTES
-- =========================================

SELECT 'STEP 3: Exemples de commandes récentes' as etape;

SELECT 
  id,
  product_type,
  amount,
  payment_status,
  created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- =========================================
-- 4. RÉSUMÉ POUR DÉCISION
-- =========================================

SELECT 'STEP 4: Résumé pour la migration' as etape;

SELECT 
  CASE 
    WHEN COUNT(CASE WHEN product_type NOT IN ('dazbox', 'daznode', 'dazpay') 
                    AND product_type IS NOT NULL THEN 1 END) = 0 
    THEN 'OK - Aucune migration nécessaire'
    ELSE 'MIGRATION NÉCESSAIRE - Données à convertir détectées'
  END as statut_migration,
  COUNT(CASE WHEN product_type NOT IN ('dazbox', 'daznode', 'dazpay') 
             AND product_type IS NOT NULL THEN 1 END) as lignes_a_migrer
FROM orders; 