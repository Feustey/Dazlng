-- Application de la migration CRM
-- Exécutez ce script dans votre interface Supabase SQL Editor

-- Inclusion du fichier de migration principal
\i supabase/migrations/20241213_crm_tables.sql

-- Vérification que les tables ont été créées
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'crm_%';

-- Vérification que les vues ont été créées
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('crm_segment_stats', 'crm_campaign_stats');

-- Compte le nombre d'enregistrements par défaut
SELECT 
    'crm_customer_segments' as table_name, 
    COUNT(*) as count 
FROM crm_customer_segments
UNION ALL
SELECT 
    'crm_email_templates' as table_name, 
    COUNT(*) as count 
FROM crm_email_templates; 