-- ==========================================
-- NETTOYAGE ET CLARIFICATION ARCHITECTURE
-- ==========================================

-- 1. Utiliser UNIQUEMENT la table 'profiles' pour les données utilisateur
-- 2. Supprimer la confusion avec la table 'users'

-- Désactiver temporairement la table users si elle cause des conflits
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- S'assurer que profiles est la table principale
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLITIQUES RLS SÉCURISÉES POUR PROFILES
-- ==========================================

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- Politiques strictes et sécurisées
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Service role a accès complet (pour admin)
CREATE POLICY "Service role full access" ON profiles
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true); 