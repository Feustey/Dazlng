-- Script de peuplement: Données réalistes pour la table user_actions
-- Date: 2025-01-06
-- Description: Peuple la table user_actions avec plus de 3400 entrées réalistes
-- PRÉREQUIS: La table user_actions doit exister (exécuter create-user-actions-table-only.sql d'abord)

-- Vérifier que la table existe et préparer les utilisateurs de test
DO $$
DECLARE
    profiles_count INTEGER;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_actions' AND table_schema = 'public') THEN
        RAISE EXCEPTION 'ERREUR: La table user_actions n''existe pas. Exécutez d''abord create-user-actions-table-only.sql';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_actions' AND column_name = 'user_segment') THEN
        RAISE EXCEPTION 'ERREUR: La colonne user_segment n''existe pas dans la table user_actions';
    END IF;
    
    -- Vérifier s'il y a des profils existants
    SELECT COUNT(*) INTO profiles_count FROM profiles;
    
    RAISE NOTICE 'Table user_actions trouvée.';
    RAISE NOTICE 'Profils existants: %', profiles_count;
    
    -- Si pas assez de profils, on va en créer quelques-uns pour les tests
    IF profiles_count < 20 THEN
        RAISE NOTICE 'Création de profils utilisateurs de test pour les données d''actions...';
    END IF;
END $$;

-- Vider la table si elle contient déjà des données (optionnel)
TRUNCATE TABLE public.user_actions;

-- ============================================================================
-- ÉTAPE 0: CRÉER DES PROFILS UTILISATEURS DE TEST SI NÉCESSAIRE
-- ============================================================================

-- Créer des profils utilisateurs de test pour les actions si pas assez d'utilisateurs existants
DO $$
DECLARE
    profiles_count INTEGER;
    i INTEGER;
    test_user_id UUID;
    segments TEXT[] := ARRAY['prospect', 'lead', 'client', 'premium', 'champion'];
    segment TEXT;
BEGIN
    SELECT COUNT(*) INTO profiles_count FROM profiles;
    
    -- Si moins de 20 profils, créer des utilisateurs de test
    IF profiles_count < 20 THEN
        RAISE NOTICE 'Création de % profils utilisateurs de test...', 25 - profiles_count;
        
        FOR i IN 1..(25 - profiles_count) LOOP
            test_user_id := gen_random_uuid();
            segment := segments[((i-1) % 5) + 1]; -- Distribuer équitablement les segments
            
            INSERT INTO profiles (
                id, 
                email, 
                nom, 
                prenom, 
                t4g_tokens, 
                created_at, 
                updated_at, 
                settings, 
                email_verified
            ) VALUES (
                test_user_id,
                'test-user-' || i || '@daznode-actions.test',
                'TestUser',
                'Action' || i,
                CASE segment 
                    WHEN 'prospect' THEN 1
                    WHEN 'lead' THEN 5
                    WHEN 'client' THEN 10
                    WHEN 'premium' THEN 25
                    WHEN 'champion' THEN 50
                END,
                NOW() - (random() * INTERVAL '180 days'),
                NOW() - (random() * INTERVAL '30 days'),
                jsonb_build_object('segment', segment, 'test_user', true),
                true
            );
        END LOOP;
        
        RAISE NOTICE 'Profils utilisateurs de test créés avec succès.';
    ELSE
        RAISE NOTICE 'Profils existants suffisants (%), aucune création nécessaire.', profiles_count;
    END IF;
END $$;

-- ============================================================================
-- ÉTAPE 1: INSERTION DES ACTIONS D'EXEMPLE
-- ============================================================================

-- Insertion d'actions d'exemple avec des user_id existants
DO $$
DECLARE
    existing_users UUID[];
    user_count INTEGER;
BEGIN
    -- Récupérer les IDs des utilisateurs existants
    SELECT ARRAY(SELECT id FROM profiles ORDER BY created_at LIMIT 25) INTO existing_users;
    user_count := array_length(existing_users, 1);
    
    IF user_count < 10 THEN
        RAISE EXCEPTION 'Pas assez d''utilisateurs dans la table profiles (% trouvés, 10 minimum requis)', user_count;
    END IF;
    
    RAISE NOTICE 'Insertion d''actions d''exemple avec % utilisateurs existants...', user_count;
    
    -- Insertion des actions d'exemple avec des user_id valides
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at) VALUES
    
    -- Actions de vérification d'email (très populaire)
    (existing_users[1], 'verify-email', 'completed', 10000, 8500, 'lead', '{"source": "recommendation"}', NOW() - INTERVAL '30 days'),
    (existing_users[2], 'verify-email', 'completed', 12000, 11200, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '25 days'),
    (existing_users[3], 'verify-email', 'completed', 8000, 7500, 'prospect', '{"source": "onboarding"}', NOW() - INTERVAL '20 days'),
    (existing_users[4], 'verify-email', 'completed', 15000, 14800, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '15 days'),
    (existing_users[5], 'verify-email', 'completed', 10000, 9200, 'lead', '{"source": "email_reminder"}', NOW() - INTERVAL '10 days'),
    (existing_users[6], 'verify-email', 'completed', 12000, 11500, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '8 days'),
    (existing_users[7], 'verify-email', 'completed', 20000, 18900, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '5 days'),
    
    -- Actions d'ajout de pubkey Lightning (moins populaire mais plus rentable)
    (existing_users[8], 'add-pubkey', 'completed', 25000, 28000, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '28 days'),
    (existing_users[9], 'add-pubkey', 'completed', 20000, 22500, 'lead', '{"source": "tutorial"}', NOW() - INTERVAL '22 days'),
    (existing_users[10], 'add-pubkey', 'completed', 30000, 32000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '18 days'),
    (existing_users[11 % user_count + 1], 'add-pubkey', 'completed', 35000, 38500, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '12 days'),
    (existing_users[12 % user_count + 1], 'add-pubkey', 'completed', 25000, 26800, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '7 days'),
    
    -- Actions de connexion de nœud (très rentable, peu fréquente)
    (existing_users[13 % user_count + 1], 'connect-node', 'completed', 75000, 82000, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '26 days'),
    (existing_users[14 % user_count + 1], 'connect-node', 'completed', 90000, 95000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '20 days'),
    (existing_users[15 % user_count + 1], 'connect-node', 'completed', 100000, 105000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '14 days'),
    (existing_users[16 % user_count + 1], 'connect-node', 'completed', 60000, 68000, 'lead', '{"source": "tutorial"}', NOW() - INTERVAL '9 days'),
    
    -- Actions d'upgrade Premium (haute valeur)
    (existing_users[17 % user_count + 1], 'upgrade-premium', 'completed', 150000, 165000, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '24 days'),
    (existing_users[18 % user_count + 1], 'upgrade-premium', 'completed', 120000, 135000, 'lead', '{"source": "promotion"}', NOW() - INTERVAL '18 days'),
    (existing_users[19 % user_count + 1], 'upgrade-premium', 'completed', 180000, 195000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '11 days'),
    (existing_users[20 % user_count + 1], 'upgrade-premium', 'completed', 200000, 220000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '6 days'),
    
    -- Actions DazBox (très haute valeur, rare)
    (existing_users[21 % user_count + 1], 'dazbox-offer', 'completed', 200000, 230000, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '21 days'),
    (existing_users[22 % user_count + 1], 'dazbox-offer', 'completed', 250000, 280000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '16 days'),
    (existing_users[23 % user_count + 1], 'dazbox-offer', 'completed', 300000, 340000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '8 days'),
    
    -- Actions Premium (optimisation IA)
    (existing_users[24 % user_count + 1], 'ai-optimization', 'completed', 80000, 88000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '19 days'),
    (existing_users[25 % user_count + 1], 'ai-optimization', 'completed', 100000, 112000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '13 days'),
    (existing_users[1], 'ai-optimization', 'completed', 80000, 85000, 'premium', '{"source": "auto_suggestion"}', NOW() - INTERVAL '7 days'),
    
    -- Actions Premium (alertes personnalisées)
    (existing_users[2], 'custom-alerts', 'completed', 40000, 42000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '17 days'),
    (existing_users[3], 'custom-alerts', 'completed', 50000, 55000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '12 days'),
    (existing_users[4], 'custom-alerts', 'completed', 40000, 38000, 'premium', '{"source": "feature_discovery"}', NOW() - INTERVAL '4 days');
    
END $$;

-- Message de confirmation pour les actions d'exemple
DO $$
BEGIN
    RAISE NOTICE 'Actions d''exemple insérées: 30 entrées';
END $$;

-- ============================================================================
-- ÉTAPE 2: GÉNÉRATION EN MASSE DE DONNÉES RÉALISTES
-- ============================================================================

-- Fonction utilitaire pour obtenir un user_id aléatoire existant
CREATE OR REPLACE FUNCTION get_random_user_id() RETURNS UUID AS $$
DECLARE
    random_user_id UUID;
BEGIN
    SELECT id INTO random_user_id 
    FROM profiles 
    ORDER BY random() 
    LIMIT 1;
    
    IF random_user_id IS NULL THEN
        RAISE EXCEPTION 'Aucun utilisateur trouvé dans la table profiles';
    END IF;
    
    RETURN random_user_id;
END;
$$ LANGUAGE plpgsql;

-- Générer 1200 actions verify-email en utilisant la méthode INSERT optimisée
DO $$
BEGIN
    RAISE NOTICE 'Génération de 1200 actions verify-email...';
    
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
    SELECT 
        get_random_user_id(),
        'verify-email',
        'completed',
        CASE 
            WHEN (row_number() OVER ()) % 5 = 0 THEN 5000 + (random() * 3000)::INTEGER  -- prospect
            WHEN (row_number() OVER ()) % 5 = 1 THEN 8000 + (random() * 4000)::INTEGER  -- lead
            WHEN (row_number() OVER ()) % 5 = 2 THEN 12000 + (random() * 6000)::INTEGER -- client
            WHEN (row_number() OVER ()) % 5 = 3 THEN 15000 + (random() * 8000)::INTEGER -- premium
            ELSE 20000 + (random() * 10000)::INTEGER -- champion
        END as estimated_gain,
        CASE 
            WHEN (row_number() OVER ()) % 5 = 0 THEN (5000 + (random() * 3000)::INTEGER) + ((random() - 0.5) * (5000 + (random() * 3000)::INTEGER) * 0.4)::INTEGER
            WHEN (row_number() OVER ()) % 5 = 1 THEN (8000 + (random() * 4000)::INTEGER) + ((random() - 0.5) * (8000 + (random() * 4000)::INTEGER) * 0.4)::INTEGER
            WHEN (row_number() OVER ()) % 5 = 2 THEN (12000 + (random() * 6000)::INTEGER) + ((random() - 0.5) * (12000 + (random() * 6000)::INTEGER) * 0.4)::INTEGER
            WHEN (row_number() OVER ()) % 5 = 3 THEN (15000 + (random() * 8000)::INTEGER) + ((random() - 0.5) * (15000 + (random() * 8000)::INTEGER) * 0.4)::INTEGER
            ELSE (20000 + (random() * 10000)::INTEGER) + ((random() - 0.5) * (20000 + (random() * 10000)::INTEGER) * 0.4)::INTEGER
        END as actual_gain,
        CASE 
            WHEN (row_number() OVER ()) % 5 = 0 THEN 'prospect'
            WHEN (row_number() OVER ()) % 5 = 1 THEN 'lead'
            WHEN (row_number() OVER ()) % 5 = 2 THEN 'client'
            WHEN (row_number() OVER ()) % 5 = 3 THEN 'premium'
            ELSE 'champion'
        END as user_segment,
        jsonb_build_object('source', CASE (random() * 3)::INTEGER
            WHEN 0 THEN 'recommendation'
            WHEN 1 THEN 'onboarding'
            ELSE 'email_reminder'
        END),
        NOW() - (random() * INTERVAL '90 days')
    FROM generate_series(1, 1200);
    
    RAISE NOTICE 'Terminé: 1200 actions verify-email générées';
END $$;

-- Générer 800 actions add-pubkey
DO $$
BEGIN
    RAISE NOTICE 'Génération de 800 actions add-pubkey...';
    
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
    SELECT 
        get_random_user_id(),
        'add-pubkey',
        'completed',
        CASE 
            WHEN (row_number() OVER ()) % 6 = 0 THEN 15000 + (random() * 5000)::INTEGER  -- prospect
            WHEN (row_number() OVER ()) % 6 IN (1,2) THEN 20000 + (random() * 8000)::INTEGER  -- lead
            WHEN (row_number() OVER ()) % 6 IN (3,4) THEN 25000 + (random() * 10000)::INTEGER -- client
            WHEN (row_number() OVER ()) % 6 = 5 THEN 30000 + (random() * 12000)::INTEGER -- premium
            ELSE 35000 + (random() * 15000)::INTEGER -- champion
        END as estimated_gain,
        CASE 
            WHEN (row_number() OVER ()) % 6 = 0 THEN (15000 + (random() * 5000)::INTEGER) + ((random() - 0.5) * (15000 + (random() * 5000)::INTEGER) * 0.3)::INTEGER
            WHEN (row_number() OVER ()) % 6 IN (1,2) THEN (20000 + (random() * 8000)::INTEGER) + ((random() - 0.5) * (20000 + (random() * 8000)::INTEGER) * 0.3)::INTEGER
            WHEN (row_number() OVER ()) % 6 IN (3,4) THEN (25000 + (random() * 10000)::INTEGER) + ((random() - 0.5) * (25000 + (random() * 10000)::INTEGER) * 0.3)::INTEGER
            WHEN (row_number() OVER ()) % 6 = 5 THEN (30000 + (random() * 12000)::INTEGER) + ((random() - 0.5) * (30000 + (random() * 12000)::INTEGER) * 0.3)::INTEGER
            ELSE (35000 + (random() * 15000)::INTEGER) + ((random() - 0.5) * (35000 + (random() * 15000)::INTEGER) * 0.3)::INTEGER
        END as actual_gain,
        CASE 
            WHEN (row_number() OVER ()) % 6 = 0 THEN 'prospect'
            WHEN (row_number() OVER ()) % 6 IN (1,2) THEN 'lead'
            WHEN (row_number() OVER ()) % 6 IN (3,4) THEN 'client'
            WHEN (row_number() OVER ()) % 6 = 5 THEN 'premium'
            ELSE 'champion'
        END as user_segment,
        jsonb_build_object('source', CASE (random() * 3)::INTEGER
            WHEN 0 THEN 'recommendation'
            WHEN 1 THEN 'tutorial'
            ELSE 'feature_discovery'
        END),
        NOW() - (random() * INTERVAL '90 days')
    FROM generate_series(1, 800);
    
    RAISE NOTICE 'Terminé: 800 actions add-pubkey générées';
END $$;

-- Génération simplifiée des autres actions avec user_id valides
DO $$
BEGIN
    RAISE NOTICE 'Génération de 400 actions connect-node...';
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
    SELECT get_random_user_id(), 'connect-node', 'completed',
        CASE row_number() OVER () % 4 WHEN 0 THEN 60000 + (random() * 15000)::INTEGER WHEN 3 THEN 90000 + (random() * 25000)::INTEGER ELSE 75000 + (random() * 20000)::INTEGER END,
        CASE row_number() OVER () % 4 WHEN 0 THEN 65000 + (random() * 18000)::INTEGER WHEN 3 THEN 95000 + (random() * 28000)::INTEGER ELSE 80000 + (random() * 23000)::INTEGER END,
        CASE row_number() OVER () % 4 WHEN 0 THEN 'lead' WHEN 3 THEN 'premium' ELSE 'client' END,
        '{"source": "recommendation"}', NOW() - (random() * INTERVAL '90 days')
    FROM generate_series(1, 400);

    RAISE NOTICE 'Génération de 600 actions upgrade-premium...';
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
    SELECT get_random_user_id(), 'upgrade-premium', 'completed',
        CASE row_number() OVER () % 4 WHEN 0 THEN 120000 + (random() * 30000)::INTEGER WHEN 3 THEN 180000 + (random() * 50000)::INTEGER ELSE 150000 + (random() * 40000)::INTEGER END,
        CASE row_number() OVER () % 4 WHEN 0 THEN 135000 + (random() * 35000)::INTEGER WHEN 3 THEN 195000 + (random() * 55000)::INTEGER ELSE 165000 + (random() * 45000)::INTEGER END,
        CASE row_number() OVER () % 4 WHEN 0 THEN 'lead' WHEN 3 THEN 'premium' ELSE 'client' END,
        '{"source": "recommendation"}', NOW() - (random() * INTERVAL '90 days')
    FROM generate_series(1, 600);

    RAISE NOTICE 'Génération de 200 actions dazbox-offer...';
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
    SELECT get_random_user_id(), 'dazbox-offer', 'completed',
        CASE row_number() OVER () % 3 WHEN 0 THEN 200000 + (random() * 50000)::INTEGER WHEN 1 THEN 250000 + (random() * 70000)::INTEGER ELSE 300000 + (random() * 100000)::INTEGER END,
        CASE row_number() OVER () % 3 WHEN 0 THEN 230000 + (random() * 60000)::INTEGER WHEN 1 THEN 280000 + (random() * 80000)::INTEGER ELSE 340000 + (random() * 120000)::INTEGER END,
        CASE row_number() OVER () % 3 WHEN 0 THEN 'client' WHEN 1 THEN 'premium' ELSE 'champion' END,
        '{"source": "recommendation"}', NOW() - (random() * INTERVAL '90 days')
    FROM generate_series(1, 200);

    RAISE NOTICE 'Génération de 120 actions ai-optimization...';
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
    SELECT get_random_user_id(), 'ai-optimization', 'completed',
        80000 + (random() * 45000)::INTEGER, 88000 + (random() * 50000)::INTEGER,
        CASE row_number() OVER () % 2 WHEN 0 THEN 'premium' ELSE 'champion' END,
        '{"source": "recommendation"}', NOW() - (random() * INTERVAL '90 days')
    FROM generate_series(1, 120);

    RAISE NOTICE 'Génération de 80 actions custom-alerts...';
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
    SELECT get_random_user_id(), 'custom-alerts', 'completed',
        40000 + (random() * 22000)::INTEGER, 42000 + (random() * 25000)::INTEGER,
        CASE row_number() OVER () % 2 WHEN 0 THEN 'premium' ELSE 'champion' END,
        '{"source": "recommendation"}', NOW() - (random() * INTERVAL '90 days')
    FROM generate_series(1, 80);

    RAISE NOTICE 'Toutes les actions générées avec succès!';
END $$;

-- ============================================================================
-- ÉTAPE 3: AFFICHAGE DU RÉSUMÉ
-- ============================================================================

-- ============================================================================
-- ÉTAPE 3: AFFICHAGE DU RÉSUMÉ ET VÉRIFICATION
-- ============================================================================

-- Nettoyer la fonction temporaire
DROP FUNCTION IF EXISTS get_random_user_id();

-- Afficher le total général et le résumé
DO $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM user_actions;
    RAISE NOTICE '=== PEUPLEMENT TERMINÉ ===';
    RAISE NOTICE 'Total d''actions créées: %', total_count;
    RAISE NOTICE 'La table user_actions est maintenant peuplée avec des données réalistes!';
    RAISE NOTICE 'Vos endpoints /api/user/crm-data vont maintenant utiliser de vraies données.';
    RAISE NOTICE ' ';
    RAISE NOTICE 'Exécutez la requête suivante pour voir le résumé détaillé:';
    RAISE NOTICE 'SELECT action_type, user_segment, COUNT(*) FROM user_actions GROUP BY action_type, user_segment ORDER BY action_type, user_segment;';
END $$; 