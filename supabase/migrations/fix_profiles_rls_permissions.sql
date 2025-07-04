-- ==========================================
-- CORRECTION DES PERMISSIONS RLS PROFILES
-- ==========================================

-- Supprimer toutes les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Service role full access" ON public.profiles;
DROP POLICY IF EXISTS "Service role full access profiles" ON public.profiles;

-- S'assurer que RLS est activé'
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLITIQUES RLS CORRIGÉES
-- ==========================================

-- 1. Service role a accès complet (pour les opérations admin et API)
CREATE POLICY "Service role full access profiles" ON public.profiles;
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. Utilisateurs authentifiés peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles;
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

-- 3. Utilisateurs authentifiés peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON public.profiles;
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Utilisateurs authentifiés peuvent créer leur propre profil
CREATE POLICY "Users can insert own profile" ON public.profiles;
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- ==========================================
-- POLITIQUE SPÉCIALE POUR LE DEBUG
-- ==========================================

-- Permettre la lecture basique pour les tests de connexion
-- Cette politique sera utilisée uniquement pour vérifier la connectivité
CREATE POLICY "Allow basic connection test" ON public.profiles;
    FOR SELECT 
    TO anon, authenticated
    USING (false);  -- Cette politique ne retournera jamais de données

-- ==========================================
-- VÉRIFICATIONS ET TESTS
-- ==========================================

-- Vérifier que les politiques sont bien créées
SELECT schemaname, tablename, policyname, roles, cmd, qual;
FROM pg_policies 
WHERE tablename = 'profiles';

-- Fonction utilitaire pour tester les permissions (optionnel)
CREATE OR REPLACE FUNCTION test_profiles_permissions()
RETURNS TABLE (
    test_name TEXT,
    success BOOLEAN,
    message TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Test 1: Vérifier que la table existe
    RETURN QUERY
    SELECT 
        'table_exists'::TEXT,
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles')::BOOLEAN,;
        'Table profiles exists'::TEXT;
    
    -- Test 2: Vérifier que RLS est activé
    RETURN QUERY
    SELECT 
        'rls_enabled'::TEXT,
        (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles')::BOOLEAN,
        'RLS is enabled on profiles'::TEXT;
    
    -- Test 3: Compter les politiques
    RETURN QUERY
    SELECT 
        'policies_count'::TEXT,
        (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') > 0,
        ('Found ' || (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') || ' policies')::TEXT;
        
    RETURN;
END;
$$;

-- Exécuter les tests
SELECT * FROM test_profiles_permissions(); 