-- Migration pour l'optimisation des performances - Partie 3'
-- Fonctions de maintenance
-- IMPORTANT: Exécuter chaque instruction séparément

-- Fonction pour analyser les index
CREATE OR REPLACE FUNCTION analyze_index_usage()
RETURNS TABLE (
    schemaname TEXT,
    tablename TEXT,
    indexname TEXT,
    idx_scan BIGINT,
    idx_tup_read BIGINT,
    idx_tup_fetch BIGINT,
    index_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.schemaname,
        s.relname AS tablename,
        s.indexrelname AS indexname,
        s.idx_scan,
        s.idx_tup_read,
        s.idx_tup_fetch,
        pg_size_pretty(pg_relation_size(i.indexrelid)) as index_size
    FROM pg_stat_user_indexes s
    JOIN pg_index i ON s.indexrelid = i.indexrelid
    WHERE s.idx_scan = 0 -- Index non utilisés;
    ORDER BY pg_relation_size(i.indexrelid) DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer les index inutilisés
CREATE OR REPLACE FUNCTION cleanup_unused_indexes(
    min_days_unused int DEFAULT 30,
    dry_run BOOLEAN DEFAULT true
) RETURNS TABLE (
    index_name TEXT,
    table_name TEXT,
    action TEXT
) AS $$
DECLARE;
    r RECORD;
BEGIN
    FOR r IN
        SELECT 
            schemaname,
            tablename,
            indexname,
            idx_scan,
            pg_relation_size(i.indexrelid) as index_size
        FROM pg_stat_user_indexes s
        JOIN pg_index i ON s.indexrelid = i.indexrelid
        WHERE 
            s.idx_scan = 0
            AND NOT i.indisprimary
            AND NOT i.indisunique
            AND age(now(), stats_reset) > min_days_unused * interval '1 day'
    LOOP
        index_name := r.indexname;
        table_name := r.tablename;
        
        IF NOT dry_run THEN
            EXECUTE format('DROP INDEX CONCURRENTLY IF EXISTS %I.%I', r.schemaname, r.indexname);
            action := 'DROPPED';
        ELSE
            action := 'WOULD DROP';
        END IF;
        
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour analyser la santé des index
CREATE OR REPLACE FUNCTION analyze_index_health()
RETURNS TABLE (
    tablename TEXT,
    indexname TEXT,
    index_size TEXT,
    index_bloat_ratio numeric,
    missing_stats BOOLEAN,
    recommendation TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH index_stats AS (
        SELECT
            schemaname,
            tablename,
            indexname,
            idx_scan,
            pg_relation_size(indexrelid) as raw_size,
            pg_stat_get_last_analyze_time(indexrelid) as last_analyze,
            pg_stat_get_last_autoanalyze_time(indexrelid) as last_autoanalyze
        FROM pg_stat_user_indexes
        WHERE schemaname = 'public'
    )
    SELECT
        s.tablename::TEXT,
        s.indexname::TEXT,
        pg_size_pretty(s.raw_size)::TEXT as index_size,
        CASE 
            WHEN s.raw_size > 0 THEN
                round(((pg_relation_size(s.indexname::regclass) - pg_relation_size(s.tablename::regclass)::numeric) / 
                pg_relation_size(s.indexname::regclass) * 100)::numeric, 2)
            ELSE 0
        END as index_bloat_ratio,
        (s.last_analyze IS NULL AND s.last_autoanalyze IS NULL) as missing_stats,
        CASE
            WHEN s.idx_scan = 0 THEN 'Consider dropping unused index'
            WHEN s.raw_size > 100 * 1024 * 1024 AND 
                 ((pg_relation_size(s.indexname::regclass) - pg_relation_size(s.tablename::regclass)::numeric) / 
                 pg_relation_size(s.indexname::regclass) * 100) > 50 
                THEN 'Consider REINDEX due to high bloat'
            WHEN s.last_analyze IS NULL AND s.last_autoanalyze IS NULL 
                THEN 'Run ANALYZE to gather statistics'
            ELSE 'Index appears healthy'
        END as recommendation;
    FROM index_stats s;
END;
$$ LANGUAGE plpgsql; 