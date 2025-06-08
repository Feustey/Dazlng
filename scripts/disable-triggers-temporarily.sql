-- Script pour désactiver temporairement les triggers problématiques
-- À utiliser si vous voulez juste faire fonctionner les commandes en attendant

-- =====================================================
-- DÉSACTIVER LES TRIGGERS TEMPORAIREMENT
-- =====================================================

-- Supprimer les triggers qui causent des erreurs
DROP TRIGGER IF EXISTS trigger_notify_new_order ON orders;
DROP TRIGGER IF EXISTS trigger_notify_order_status_change ON orders;

-- Optionnel: Supprimer aussi les fonctions
-- DROP FUNCTION IF EXISTS notify_new_order();
-- DROP FUNCTION IF EXISTS notify_order_status_change();

SELECT 'Triggers désactivés temporairement!' as resultat;

-- =====================================================
-- POUR RÉACTIVER PLUS TARD (après correction)
-- =====================================================

-- Décommentez ces lignes après avoir appliqué le script de correction:

-- CREATE TRIGGER trigger_notify_new_order
--     AFTER INSERT ON orders
--     FOR EACH ROW
--     EXECUTE FUNCTION notify_new_order();

-- CREATE TRIGGER trigger_notify_order_status_change
--     AFTER UPDATE ON orders
--     FOR EACH ROW
--     EXECUTE FUNCTION notify_order_status_change(); 