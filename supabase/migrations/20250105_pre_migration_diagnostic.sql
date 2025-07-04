-- ====================================================================
-- DIAGNOSTIC PRÉ-MIGRATION CRM - IDENTIFICATION DES PROBLÈMES
-- ====================================================================
-- Date: 2025-01-05
-- Objectif: Diagnostiquer les problèmes potentiels avant la migration CRM
-- ====================================================================

-- Fonction de diagnostic complet
CREATE OR REPLACE FUNCTION run_pre_migration_diagnostic()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    details TEXT,
    recommendation TEXT
) AS $$
DECLARE;
    table_count INTEGER;
    constraint_conflicts INTEGER;
    orphaned_records INTEGER;
BEGIN
    -- 1. Vérifier l'existence des tables CRM'
    RETURN QUERY
    SELECT 
        'CRM Tables Existence'::TEXT as check_name,
        CASE WHEN COUNT(*) >= 4 THEN 'OK' ELSE 'WARNING' END as status,
        'Found ' || COUNT(*) || ' CRM tables' as details,
        CASE WHEN COUNT(*) < 4 THEN 'Some CRM tables are missing' ELSE 'All CRM tables present' END as recommendation
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'crm_%';
    
    -- 2. Vérifier les conflits de contraintes
    SELECT COUNT(*) INTO constraint_conflicts
    FROM pg_constraint 
    WHERE conname IN ('crm_email_sends_pkey', 'profiles_email_format', 'profiles_pubkey_format');
    
    RETURN QUERY
    SELECT 
        'Constraint Conflicts'::TEXT,
        CASE WHEN constraint_conflicts > 0 THEN 'WARNING' ELSE 'OK' END,
        'Found ' || constraint_conflicts || ' existing constraints',
        CASE WHEN constraint_conflicts > 0 THEN 'Some constraints already exist, migration will handle this' ELSE 'No constraint conflicts' END;
    
    -- 3. Vérifier l'état de la table crm_email_sends'
    RETURN QUERY
    SELECT 
        'Email Sends Table Status'::TEXT,
        CASE 
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crm_email_sends') THEN 'OK'
            WHEN EXISTS (SELECT 1 FROM pg_partitioned_table pt JOIN pg_class c ON pt.partrelid = c.oid WHERE c.relname = 'crm_email_sends') THEN 'ALREADY_PARTITIONED'
            ELSE 'NEEDS_PARTITIONING'
        END,
        CASE 
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crm_email_sends') THEN 'Table does not exist'
            WHEN EXISTS (SELECT 1 FROM pg_partitioned_table pt JOIN pg_class c ON pt.partrelid = c.oid WHERE c.relname = 'crm_email_sends') THEN 'Table is already partitioned'
            ELSE 'Table exists but not partitioned'
        END,
        CASE 
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crm_email_sends') THEN 'Will create NEW partitioned table'
            WHEN EXISTS (SELECT 1 FROM pg_partitioned_table pt JOIN pg_class c ON pt.partrelid = c.oid WHERE c.relname = 'crm_email_sends') THEN 'Migration will skip partitioning'
            ELSE 'Will backup and recreate as partitioned table'
        END;
    
    -- 4. Vérifier les enregistrements orphelins dans les relations
    SELECT COUNT(*) INTO orphaned_records
    FROM crm_customer_segment_members csm
    LEFT JOIN profiles p ON csm.customer_id = p.id
    WHERE p.id IS NULL;
    
    RETURN QUERY
    SELECT 
        'Orphaned Segment Members'::TEXT,
        CASE WHEN orphaned_records > 0 THEN 'WARNING' ELSE 'OK' END,
        'Found ' || orphaned_records || ' orphaned segment members',
        CASE WHEN orphaned_records > 0 THEN 'Clean up orphaned records before migration' ELSE 'No orphaned records' END;
    
    -- 5. Vérifier l'espace disque disponible'
    RETURN QUERY
    SELECT 
        'Database Size'::TEXT,
        CASE WHEN pg_database_size(current_database()) > 1000000000 THEN 'INFO' ELSE 'OK' END,
        'Database size: ' || pg_size_pretty(pg_database_size(current_database())),
        CASE WHEN pg_database_size(current_database()) > 1000000000 THEN 'Large database - ensure sufficient space for migration' ELSE 'Database size is manageable' END;
    
    -- 6. Vérifier les permissions admin_roles
    RETURN QUERY
    SELECT 
        'Admin Roles Table'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_roles') THEN 'OK' ELSE 'ERROR' END,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_roles') THEN 'admin_roles table exists' ELSE 'admin_roles table missing' END,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_roles') THEN 'Migration can proceed' ELSE 'Create admin_roles table first' END;
    
    -- 7. Vérifier les extensions PostgreSQL
    RETURN QUERY
    SELECT 
        'PostgreSQL Extensions'::TEXT,
        CASE WHEN COUNT(*) >= 1 THEN 'OK' ELSE 'WARNING' END,
        'Available extensions: ' || string_agg(name, ', '),
        CASE WHEN COUNT(*) >= 1 THEN 'Required extensions available' ELSE 'CHECK extension availability' END
    FROM pg_available_extensions 
    WHERE name IN ('UUID-ossp', 'pg_cron');
    
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer les enregistrements orphelins
CREATE OR REPLACE FUNCTION cleanup_orphaned_records()
RETURNS TEXT AS $$
DECLARE;
    deleted_count INTEGER := 0;
BEGIN
    -- Nettoyer les membres de segments orphelins
    DELETE FROM crm_customer_segment_members csm
    WHERE NOT EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = csm.customer_id
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Nettoyer les campagnes avec created_by orphelin
    UPDATE crm_email_campaigns 
    SET created_by = NULL 
    WHERE created_by IS NOT NULL 
    AND NOT EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = created_by
    );
    
    RETURN 'Cleaned up ' || deleted_count || ' orphaned segment members and updated campaigns with orphaned created_by';
END;
$$ LANGUAGE plpgsql;

-- Fonction pour afficher un résumé des tables CRM
CREATE OR REPLACE FUNCTION show_crm_tables_summary()
RETURNS TABLE(
    table_name TEXT,
    row_count BIGINT,
    size_mb NUMERIC,
    indexes_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::TEXT,
        COALESCE(s.n_tup_ins - s.n_tup_del, 0) as row_count,
        ROUND((pg_total_relation_size(t.table_name::regclass) / 1024.0 / 1024.0)::NUMERIC, 2) as size_mb,
        (SELECT COUNT(*) FROM pg_indexes WHERE tablename = t.table_name)::INTEGER as indexes_count
    FROM information_schema.tables t
    LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
    WHERE t.table_schema = 'public' 
    AND (t.table_name LIKE 'crm_%' OR t.table_name IN ('profiles', 'orders', 'admin_roles'))
    AND t.table_type = 'BASE TABLE';
    ORDER BY size_mb DESC;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- EXÉCUTION DU DIAGNOSTIC
-- ====================================================================

-- Afficher le diagnostic complet
SELECT;
    '=== DIAGNOSTIC PRÉ-MIGRATION CRM ===' as title,
    NOW()::TEXT as timestamp;

SELECT * FROM run_pre_migration_diagnostic();

SELECT;
    '=== RÉSUMÉ DES TABLES CRM ===' as title;

SELECT * FROM show_crm_tables_summary();

-- Recommandations finales
SELECT;
    '=== RECOMMANDATIONS ===' as title,
    'Exécutez "SELECT cleanup_orphaned_records();" si des enregistrements orphelins ont été détectés' as recommendation
UNION ALL
SELECT;
    '',
    'Vérifiez que vous avez suffisamment d''espace disque avant de lancer la migration'
UNION ALL
SELECT;
    '',
    'Sauvegardez votre base de données avant d''exécuter la migration d''optimisation'; 