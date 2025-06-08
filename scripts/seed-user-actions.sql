-- Script complet: Création et peuplement de la table user_actions
-- Date: 2025-01-06
-- Description: Créé la table user_actions puis la peuple avec des données réalistes

-- ============================================================================
-- ÉTAPE 1: CRÉATION DE LA TABLE user_actions
-- ============================================================================

-- Créer la table user_actions si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.user_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
    estimated_gain INTEGER,
    actual_gain INTEGER,
    user_segment VARCHAR(20) CHECK (user_segment IN ('prospect', 'lead', 'client', 'premium', 'champion')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON public.user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_action_type ON public.user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_user_actions_status ON public.user_actions(status);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_segment ON public.user_actions(user_segment);
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON public.user_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_actions_action_type_status ON public.user_actions(action_type, status);
CREATE INDEX IF NOT EXISTS idx_user_actions_action_type_segment ON public.user_actions(action_type, user_segment);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_user_actions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS update_user_actions_updated_at_trigger ON public.user_actions;

-- Créer le trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_user_actions_updated_at_trigger
    BEFORE UPDATE ON public.user_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_actions_updated_at();

-- Activer RLS (Row Level Security)
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "user_actions_user_policy" ON public.user_actions;
DROP POLICY IF EXISTS "user_actions_admin_policy" ON public.user_actions;

-- Politique RLS : Les utilisateurs peuvent voir et modifier leurs propres actions
CREATE POLICY "user_actions_user_policy" ON public.user_actions
    FOR ALL USING (auth.uid() = user_id);

-- Politique RLS : Les admins peuvent voir toutes les actions (si la table admin_roles existe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_roles' AND table_schema = 'public') THEN
        EXECUTE 'CREATE POLICY "user_actions_admin_policy" ON public.user_actions
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.admin_roles ar 
                    WHERE ar.user_id = auth.uid() 
                    AND ar.role IN (''super_admin'', ''admin'')
                )
            )';
    END IF;
END $$;

-- Vérifier que la table a été créée avec succès
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_actions' AND table_schema = 'public') THEN
        RAISE NOTICE 'Table user_actions créée avec succès';
    ELSE
        RAISE EXCEPTION 'Erreur: Table user_actions non créée';
    END IF;
    
    -- Vérifier que les colonnes existent
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_actions' AND column_name = 'user_segment') THEN
        RAISE EXCEPTION 'Erreur: Colonne user_segment manquante';
    END IF;
    
    RAISE NOTICE 'Toutes les colonnes requises sont présentes. Début du peuplement...';
END $$;

-- ============================================================================
-- ÉTAPE 2: PEUPLEMENT DE LA TABLE AVEC DES DONNÉES RÉALISTES
-- ============================================================================

-- Vider la table si elle contient déjà des données (optionnel)
-- TRUNCATE TABLE public.user_actions;

-- Insertion d'actions d'exemple pour simuler l'historique des utilisateurs
INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at) VALUES

-- Actions de vérification d'email (très populaire)
(gen_random_uuid(), 'verify-email', 'completed', 10000, 8500, 'lead', '{"source": "recommendation"}', NOW() - INTERVAL '30 days'),
(gen_random_uuid(), 'verify-email', 'completed', 12000, 11200, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '25 days'),
(gen_random_uuid(), 'verify-email', 'completed', 8000, 7500, 'prospect', '{"source": "onboarding"}', NOW() - INTERVAL '20 days'),
(gen_random_uuid(), 'verify-email', 'completed', 15000, 14800, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), 'verify-email', 'completed', 10000, 9200, 'lead', '{"source": "email_reminder"}', NOW() - INTERVAL '10 days'),
(gen_random_uuid(), 'verify-email', 'completed', 12000, 11500, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '8 days'),
(gen_random_uuid(), 'verify-email', 'completed', 20000, 18900, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '5 days'),

-- Actions d'ajout de pubkey Lightning (moins populaire mais plus rentable)
(gen_random_uuid(), 'add-pubkey', 'completed', 25000, 28000, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '28 days'),
(gen_random_uuid(), 'add-pubkey', 'completed', 20000, 22500, 'lead', '{"source": "tutorial"}', NOW() - INTERVAL '22 days'),
(gen_random_uuid(), 'add-pubkey', 'completed', 30000, 32000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '18 days'),
(gen_random_uuid(), 'add-pubkey', 'completed', 35000, 38500, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '12 days'),
(gen_random_uuid(), 'add-pubkey', 'completed', 25000, 26800, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '7 days'),

-- Actions de connexion de nœud (très rentable, peu fréquente)
(gen_random_uuid(), 'connect-node', 'completed', 75000, 82000, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '26 days'),
(gen_random_uuid(), 'connect-node', 'completed', 90000, 95000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '20 days'),
(gen_random_uuid(), 'connect-node', 'completed', 100000, 105000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '14 days'),
(gen_random_uuid(), 'connect-node', 'completed', 60000, 68000, 'lead', '{"source": "tutorial"}', NOW() - INTERVAL '9 days'),

-- Actions d'upgrade Premium (haute valeur)
(gen_random_uuid(), 'upgrade-premium', 'completed', 150000, 165000, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '24 days'),
(gen_random_uuid(), 'upgrade-premium', 'completed', 120000, 135000, 'lead', '{"source": "promotion"}', NOW() - INTERVAL '18 days'),
(gen_random_uuid(), 'upgrade-premium', 'completed', 180000, 195000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '11 days'),
(gen_random_uuid(), 'upgrade-premium', 'completed', 200000, 220000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '6 days'),

-- Actions DazBox (très haute valeur, rare)
(gen_random_uuid(), 'dazbox-offer', 'completed', 200000, 230000, 'client', '{"source": "recommendation"}', NOW() - INTERVAL '21 days'),
(gen_random_uuid(), 'dazbox-offer', 'completed', 250000, 280000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '16 days'),
(gen_random_uuid(), 'dazbox-offer', 'completed', 300000, 340000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '8 days'),

-- Actions Premium (optimisation IA)
(gen_random_uuid(), 'ai-optimization', 'completed', 80000, 88000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '19 days'),
(gen_random_uuid(), 'ai-optimization', 'completed', 100000, 112000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '13 days'),
(gen_random_uuid(), 'ai-optimization', 'completed', 80000, 85000, 'premium', '{"source": "auto_suggestion"}', NOW() - INTERVAL '7 days'),

-- Actions Premium (alertes personnalisées)
(gen_random_uuid(), 'custom-alerts', 'completed', 40000, 42000, 'premium', '{"source": "recommendation"}', NOW() - INTERVAL '17 days'),
(gen_random_uuid(), 'custom-alerts', 'completed', 50000, 55000, 'champion', '{"source": "recommendation"}', NOW() - INTERVAL '12 days'),
(gen_random_uuid(), 'custom-alerts', 'completed', 40000, 38000, 'premium', '{"source": "feature_discovery"}', NOW() - INTERVAL '4 days');

-- ============================================================================
-- ÉTAPE 3: GÉNÉRATION EN MASSE DE DONNÉES RÉALISTES
-- ============================================================================

-- Générer 1200 actions verify-email supplémentaires avec des données variées
DO $$
DECLARE
    i INTEGER;
    segments TEXT[] := ARRAY['prospect', 'lead', 'client', 'premium', 'champion'];
    segment TEXT;
    base_gain INTEGER;
    actual_gain INTEGER;
BEGIN
    RAISE NOTICE 'Génération de 1200 actions verify-email...';
    FOR i IN 1..1200 LOOP
        -- Sélectionner un segment aléatoire (plus de prospects et leads)
        IF i % 5 = 0 THEN segment := 'prospect';
        ELSIF i % 5 = 1 THEN segment := 'lead';
        ELSIF i % 5 = 2 THEN segment := 'client';
        ELSIF i % 5 = 3 THEN segment := 'premium';
        ELSE segment := 'champion';
        END IF;

        -- Gains de base selon le segment
        base_gain := CASE segment
            WHEN 'prospect' THEN 5000 + (random() * 3000)::INTEGER
            WHEN 'lead' THEN 8000 + (random() * 4000)::INTEGER
            WHEN 'client' THEN 12000 + (random() * 6000)::INTEGER
            WHEN 'premium' THEN 15000 + (random() * 8000)::INTEGER
            WHEN 'champion' THEN 20000 + (random() * 10000)::INTEGER
        END;

        -- Gain réel avec variation de ±20%
        actual_gain := base_gain + ((random() - 0.5) * base_gain * 0.4)::INTEGER;

        INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
        VALUES (
            gen_random_uuid(),
            'verify-email',
            'completed',
            base_gain,
            actual_gain,
            segment,
            jsonb_build_object('source', CASE (random() * 3)::INTEGER
                WHEN 0 THEN 'recommendation'
                WHEN 1 THEN 'onboarding'
                ELSE 'email_reminder'
            END),
            NOW() - (random() * INTERVAL '90 days')
        );
    END LOOP;
    RAISE NOTICE 'Terminé: 1200 actions verify-email générées';
END $$;

-- Générer 800 actions add-pubkey
DO $$
DECLARE
    i INTEGER;
    segment TEXT;
    base_gain INTEGER;
    actual_gain INTEGER;
BEGIN
    RAISE NOTICE 'Génération de 800 actions add-pubkey...';
    FOR i IN 1..800 LOOP
        -- Distribution plus réaliste pour pubkey (moins de prospects)
        IF i % 6 = 0 THEN segment := 'prospect';
        ELSIF i % 6 IN (1,2) THEN segment := 'lead';
        ELSIF i % 6 IN (3,4) THEN segment := 'client';
        ELSIF i % 6 = 5 THEN segment := 'premium';
        ELSE segment := 'champion';
        END IF;

        base_gain := CASE segment
            WHEN 'prospect' THEN 15000 + (random() * 5000)::INTEGER
            WHEN 'lead' THEN 20000 + (random() * 8000)::INTEGER
            WHEN 'client' THEN 25000 + (random() * 10000)::INTEGER
            WHEN 'premium' THEN 30000 + (random() * 12000)::INTEGER
            WHEN 'champion' THEN 35000 + (random() * 15000)::INTEGER
        END;

        actual_gain := base_gain + ((random() - 0.5) * base_gain * 0.3)::INTEGER;

        INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
        VALUES (
            gen_random_uuid(),
            'add-pubkey',
            'completed',
            base_gain,
            actual_gain,
            segment,
            jsonb_build_object('source', CASE (random() * 3)::INTEGER
                WHEN 0 THEN 'recommendation'
                WHEN 1 THEN 'tutorial'
                ELSE 'feature_discovery'
            END),
            NOW() - (random() * INTERVAL '90 days')
        );
    END LOOP;
    RAISE NOTICE 'Terminé: 800 actions add-pubkey générées';
END $$;

-- Générer 400 actions connect-node (plus rares)
DO $$
DECLARE
    i INTEGER;
    segment TEXT;
    base_gain INTEGER;
    actual_gain INTEGER;
BEGIN
    RAISE NOTICE 'Génération de 400 actions connect-node...';
    FOR i IN 1..400 LOOP
        -- Seulement les segments avancés pour connect-node
        IF i % 4 = 0 THEN segment := 'lead';
        ELSIF i % 4 IN (1,2) THEN segment := 'client';
        ELSIF i % 4 = 3 THEN segment := 'premium';
        ELSE segment := 'champion';
        END IF;

        base_gain := CASE segment
            WHEN 'lead' THEN 60000 + (random() * 15000)::INTEGER
            WHEN 'client' THEN 75000 + (random() * 20000)::INTEGER
            WHEN 'premium' THEN 90000 + (random() * 25000)::INTEGER
            WHEN 'champion' THEN 100000 + (random() * 30000)::INTEGER
        END;

        actual_gain := base_gain + ((random() - 0.5) * base_gain * 0.25)::INTEGER;

        INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
        VALUES (
            gen_random_uuid(),
            'connect-node',
            'completed',
            base_gain,
            actual_gain,
            segment,
            jsonb_build_object('source', CASE (random() * 2)::INTEGER
                WHEN 0 THEN 'recommendation'
                ELSE 'tutorial'
            END),
            NOW() - (random() * INTERVAL '90 days')
        );
    END LOOP;
    RAISE NOTICE 'Terminé: 400 actions connect-node générées';
END $$;

-- Générer 600 actions upgrade-premium
DO $$
DECLARE
    i INTEGER;
    segment TEXT;
    base_gain INTEGER;
    actual_gain INTEGER;
BEGIN
    RAISE NOTICE 'Génération de 600 actions upgrade-premium...';
    FOR i IN 1..600 LOOP
        IF i % 4 = 0 THEN segment := 'lead';
        ELSIF i % 4 IN (1,2) THEN segment := 'client';
        ELSIF i % 4 = 3 THEN segment := 'premium';
        ELSE segment := 'champion';
        END IF;

        base_gain := CASE segment
            WHEN 'lead' THEN 120000 + (random() * 30000)::INTEGER
            WHEN 'client' THEN 150000 + (random() * 40000)::INTEGER
            WHEN 'premium' THEN 180000 + (random() * 50000)::INTEGER
            WHEN 'champion' THEN 200000 + (random() * 60000)::INTEGER
        END;

        actual_gain := base_gain + ((random() - 0.5) * base_gain * 0.2)::INTEGER;

        INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
        VALUES (
            gen_random_uuid(),
            'upgrade-premium',
            'completed',
            base_gain,
            actual_gain,
            segment,
            jsonb_build_object('source', CASE (random() * 3)::INTEGER
                WHEN 0 THEN 'recommendation'
                WHEN 1 THEN 'promotion'
                ELSE 'feature_discovery'
            END),
            NOW() - (random() * INTERVAL '90 days')
        );
    END LOOP;
    RAISE NOTICE 'Terminé: 600 actions upgrade-premium générées';
END $$;

-- Générer 200 actions dazbox-offer (très rares, haute valeur)
DO $$
DECLARE
    i INTEGER;
    segment TEXT;
    base_gain INTEGER;
    actual_gain INTEGER;
BEGIN
    RAISE NOTICE 'Génération de 200 actions dazbox-offer...';
    FOR i IN 1..200 LOOP
        -- Seulement les segments premium pour DazBox
        IF i % 3 = 0 THEN segment := 'client';
        ELSIF i % 3 = 1 THEN segment := 'premium';
        ELSE segment := 'champion';
        END IF;

        base_gain := CASE segment
            WHEN 'client' THEN 200000 + (random() * 50000)::INTEGER
            WHEN 'premium' THEN 250000 + (random() * 70000)::INTEGER
            WHEN 'champion' THEN 300000 + (random() * 100000)::INTEGER
        END;

        actual_gain := base_gain + ((random() - 0.5) * base_gain * 0.15)::INTEGER;

        INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
        VALUES (
            gen_random_uuid(),
            'dazbox-offer',
            'completed',
            base_gain,
            actual_gain,
            segment,
            jsonb_build_object('source', 'recommendation'),
            NOW() - (random() * INTERVAL '90 days')
        );
    END LOOP;
    RAISE NOTICE 'Terminé: 200 actions dazbox-offer générées';
END $$;

-- Générer actions Premium
-- Actions ai-optimization (120 entrées)
DO $$
BEGIN
    RAISE NOTICE 'Génération de 120 actions ai-optimization...';
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
    SELECT 
        gen_random_uuid(),
        'ai-optimization',
        'completed',
        CASE 
            WHEN (random() * 2)::INTEGER = 0 THEN 80000 + (random() * 20000)::INTEGER
            ELSE 100000 + (random() * 25000)::INTEGER
        END as estimated_gain,
        CASE 
            WHEN (random() * 2)::INTEGER = 0 THEN 85000 + (random() * 22000)::INTEGER
            ELSE 105000 + (random() * 27000)::INTEGER
        END as actual_gain,
        CASE 
            WHEN (random() * 2)::INTEGER = 0 THEN 'premium'
            ELSE 'champion'
        END as user_segment,
        jsonb_build_object('source', CASE (random() * 2)::INTEGER
            WHEN 0 THEN 'recommendation'
            ELSE 'auto_suggestion'
        END),
        NOW() - (random() * INTERVAL '90 days')
    FROM generate_series(1, 120);
    RAISE NOTICE 'Terminé: 120 actions ai-optimization générées';
END $$;

-- Actions custom-alerts (80 entrées)
DO $$
BEGIN
    RAISE NOTICE 'Génération de 80 actions custom-alerts...';
    INSERT INTO user_actions (user_id, action_type, status, estimated_gain, actual_gain, user_segment, metadata, created_at)
    SELECT 
        gen_random_uuid(),
        'custom-alerts',
        'completed',
        CASE 
            WHEN (random() * 2)::INTEGER = 0 THEN 40000 + (random() * 10000)::INTEGER
            ELSE 50000 + (random() * 12000)::INTEGER
        END as estimated_gain,
        CASE 
            WHEN (random() * 2)::INTEGER = 0 THEN 42000 + (random() * 11000)::INTEGER
            ELSE 52000 + (random() * 13000)::INTEGER
        END as actual_gain,
        CASE 
            WHEN (random() * 2)::INTEGER = 0 THEN 'premium'
            ELSE 'champion'
        END as user_segment,
        jsonb_build_object('source', CASE (random() * 3)::INTEGER
            WHEN 0 THEN 'recommendation'
            WHEN 1 THEN 'feature_discovery'
            ELSE 'tutorial'
        END),
        NOW() - (random() * INTERVAL '90 days')
    FROM generate_series(1, 80);
    RAISE NOTICE 'Terminé: 80 actions custom-alerts générées';
END $$;

-- ============================================================================
-- ÉTAPE 4: AFFICHAGE DU RÉSUMÉ
-- ============================================================================

-- Afficher un résumé des données insérées
SELECT 
    action_type,
    user_segment,
    COUNT(*) as count,
    ROUND(AVG(estimated_gain)) as avg_estimated_gain,
    ROUND(AVG(actual_gain)) as avg_actual_gain
FROM user_actions 
GROUP BY action_type, user_segment 
ORDER BY action_type, user_segment;

-- Afficher le total général
DO $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM user_actions;
    RAISE NOTICE '=== PEUPLEMENT TERMINÉ ===';
    RAISE NOTICE 'Total d''actions créées: %', total_count;
    RAISE NOTICE 'La table user_actions est prête à être utilisée!';
END $$; 