-- ==========================================
-- CORRECTION SIMPLE DES PERMISSIONS RLS PROFILES
-- ==========================================

-- Supprimer toutes les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Service role full access" ON public.profiles;
DROP POLICY IF EXISTS "Service role full access profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow basic connection test" ON public.profiles;

-- S'assurer que RLS est activé
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLITIQUES RLS CORRIGÉES
-- ==========================================

-- 1. Service role a accès complet (pour les opérations admin et API)
CREATE POLICY "Service role full access profiles" ON public.profiles
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. Utilisateurs authentifiés peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

-- 3. Utilisateurs authentifiés peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Utilisateurs authentifiés peuvent créer leur propre profil
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- ==========================================
-- VÉRIFICATION SIMPLE
-- ==========================================

-- Afficher les politiques créées
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    roles, 
    cmd 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Vérifier que RLS est activé
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- Message de confirmation
SELECT 'Politiques RLS mises à jour avec succès pour la table profiles' as status; 