-- Script de diagnostic SIMPLE pour voir les valeurs product_type
-- Compatible avec toutes les versions de PostgreSQL

-- 1. Voir toutes les valeurs distinctes
SELECT 
  'Valeurs product_type actuelles dans la table orders:' as info;

SELECT 
  product_type,
  COUNT(*) as nombre_commandes
FROM orders 
WHERE product_type IS NOT NULL
GROUP BY product_type 
ORDER BY product_type;

-- 2. Résumé du statut
SELECT 
  'Résumé du statut:' as info;

SELECT 
  COUNT(*) as total_commandes,
  COUNT(CASE WHEN product_type = 'dazbox' THEN 1 END) as dazbox_minuscule,
  COUNT(CASE WHEN product_type = 'DazBox' THEN 1 END) as dazbox_casse_mixte,
  COUNT(CASE WHEN product_type = 'daznode' THEN 1 END) as daznode_minuscule,
  COUNT(CASE WHEN product_type = 'DazNode' THEN 1 END) as daznode_casse_mixte,
  COUNT(CASE WHEN product_type = 'dazpay' THEN 1 END) as dazpay_minuscule,
  COUNT(CASE WHEN product_type = 'DazPay' THEN 1 END) as dazpay_casse_mixte,
  COUNT(CASE WHEN product_type NOT IN ('dazbox', 'DazBox', 'daznode', 'DazNode', 'dazpay', 'DazPay') THEN 1 END) as autres_valeurs
FROM orders;

-- 3. Voir les 5 premières commandes pour exemple
SELECT 
  'Exemples de commandes:' as info;

SELECT 
  id,
  product_type,
  created_at,
  payment_status
FROM orders 
ORDER BY created_at DESC 
LIMIT 5; 