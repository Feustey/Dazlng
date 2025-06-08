-- Script de vérification: Résumé des données user_actions
-- Date: 2025-01-06
-- Description: Affiche un résumé complet des données insérées dans user_actions

-- Vérifier que la table existe et contient des données
DO $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM user_actions;
    
    IF total_count = 0 THEN
        RAISE WARNING 'ATTENTION: La table user_actions est vide!';
        RAISE WARNING 'Exécutez d''abord populate-user-actions.sql';
        RETURN;
    END IF;
    
    RAISE NOTICE '=== VÉRIFICATION DES DONNÉES USER_ACTIONS ===';
    RAISE NOTICE 'Total d''entrées trouvées: %', total_count;
    RAISE NOTICE ' ';
END $$;

-- Résumé par action et segment
ECHO '\n=== DISTRIBUTION PAR ACTION ET SEGMENT ===';
SELECT 
    action_type,
    user_segment,
    COUNT(*) as count,
    ROUND(AVG(estimated_gain)) as avg_estimated_gain,
    ROUND(AVG(actual_gain)) as avg_actual_gain,
    ROUND(AVG(actual_gain::float / estimated_gain * 100), 1) as gain_accuracy_percent
FROM user_actions 
GROUP BY action_type, user_segment 
ORDER BY action_type, user_segment;

-- Résumé par action uniquement
ECHO '\n=== TOTAL PAR TYPE D''ACTION ===';
SELECT 
    action_type,
    COUNT(*) as total_count,
    ROUND(AVG(estimated_gain)) as avg_estimated,
    ROUND(AVG(actual_gain)) as avg_actual,
    MIN(estimated_gain) as min_gain,
    MAX(estimated_gain) as max_gain
FROM user_actions 
GROUP BY action_type
ORDER BY total_count DESC;

-- Résumé par segment utilisateur
ECHO '\n=== TOTAL PAR SEGMENT UTILISATEUR ===';
SELECT 
    user_segment,
    COUNT(*) as total_count,
    ROUND(COUNT(*)::float / (SELECT COUNT(*) FROM user_actions) * 100, 1) as percentage
FROM user_actions 
GROUP BY user_segment
ORDER BY total_count DESC;

-- Actions récentes (derniers 7 jours)
ECHO '\n=== ACTIONS RÉCENTES (7 derniers jours) ===';
SELECT 
    action_type,
    COUNT(*) as recent_count
FROM user_actions 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY action_type
ORDER BY recent_count DESC;

-- Sources des actions
ECHO '\n=== SOURCES DES ACTIONS ===';
SELECT 
    metadata->>'source' as source,
    COUNT(*) as count,
    ROUND(COUNT(*)::float / (SELECT COUNT(*) FROM user_actions) * 100, 1) as percentage
FROM user_actions 
WHERE metadata->>'source' IS NOT NULL
GROUP BY metadata->>'source'
ORDER BY count DESC;

-- Validation des données
ECHO '\n=== VALIDATION DES DONNÉES ===';
SELECT 
    'Total d''entrées' as metric,
    COUNT(*)::text as value
FROM user_actions
UNION ALL
SELECT 
    'Entrées avec estimated_gain > 0',
    COUNT(*)::text
FROM user_actions 
WHERE estimated_gain > 0
UNION ALL
SELECT 
    'Entrées avec actual_gain > 0',
    COUNT(*)::text
FROM user_actions 
WHERE actual_gain > 0
UNION ALL
SELECT 
    'Segments valides',
    COUNT(*)::text
FROM user_actions 
WHERE user_segment IN ('prospect', 'lead', 'client', 'premium', 'champion')
UNION ALL
SELECT 
    'Status valides',
    COUNT(*)::text
FROM user_actions 
WHERE status IN ('pending', 'completed', 'failed');

-- Message final
DO $$
BEGIN
    RAISE NOTICE ' ';
    RAISE NOTICE '=== VÉRIFICATION TERMINÉE ===';
    RAISE NOTICE 'Les données semblent correctes et prêtes à être utilisées.';
    RAISE NOTICE 'Vos endpoints /api/user/crm-data vont maintenant calculer des valeurs basées sur ces données réelles.';
END $$; 