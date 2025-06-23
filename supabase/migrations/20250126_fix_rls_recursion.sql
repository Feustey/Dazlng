-- Migration de correction des politiques RLS avec récursion infinie
-- Date: 2025-01-26
-- Problème: infinite recursion detected in policy for relation "admin_roles"

-- ==========================================
-- 1. SUPPRESSION DES POLITIQUES PROBLÉMATIQUES
-- ==========================================

-- Supprimer les politiques problématiques sur contacts
DROP POLICY IF EXISTS "Admin full access to contacts" ON contacts;
DROP POLICY IF EXISTS "Anonymous can insert contacts" ON contacts;

-- Supprimer les politiques problématiques sur user_email_tracking
DROP POLICY IF EXISTS "user_email_tracking_policy" ON user_email_tracking;

-- ==========================================
-- 2. CRÉATION DE POLITIQUES SIMPLIFIÉES
-- ==========================================

-- Politiques pour contacts (sans référence à admin_roles)
CREATE POLICY "Public insert contacts" ON contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read contacts" ON contacts
    FOR SELECT USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' IN ('admin@dazno.de', 'contact@dazno.de')
    );

CREATE POLICY "Admin update contacts" ON contacts
    FOR UPDATE USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' IN ('admin@dazno.de', 'contact@dazno.de')
    );

-- Politiques pour user_email_tracking (sans référence à admin_roles)
CREATE POLICY "Public insert user_email_tracking" ON user_email_tracking
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read user_email_tracking" ON user_email_tracking
    FOR SELECT USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' IN ('admin@dazno.de', 'contact@dazno.de')
    );

CREATE POLICY "Admin update user_email_tracking" ON user_email_tracking
    FOR UPDATE USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' IN ('admin@dazno.de', 'contact@dazno.de')
    );

-- ==========================================
-- 3. VÉRIFICATION DES AUTRES TABLES
-- ==========================================

-- Vérifier et corriger les politiques sur otp_codes
DROP POLICY IF EXISTS "Anyone can insert OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Anyone can read OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Anyone can update OTP codes" ON otp_codes;
DROP POLICY IF EXISTS "Anyone can delete expired OTP codes" ON otp_codes;

CREATE POLICY "Public insert OTP codes" ON otp_codes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read OTP codes" ON otp_codes
    FOR SELECT USING (true);

CREATE POLICY "Public update OTP codes" ON otp_codes
    FOR UPDATE USING (true);

CREATE POLICY "Public delete OTP codes" ON otp_codes
    FOR DELETE USING (true);

-- ==========================================
-- 4. VÉRIFICATION DES POLITIQUES ORDERS
-- ==========================================

-- Politiques pour orders (sans référence à admin_roles)
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert orders" ON orders;
DROP POLICY IF EXISTS "Admin full access to orders" ON orders;

CREATE POLICY "Public insert orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users read own orders" ON orders
    FOR SELECT USING (
        auth.uid() = user_id OR user_id IS NULL
    );

CREATE POLICY "Admin read all orders" ON orders
    FOR SELECT USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' IN ('admin@dazno.de', 'contact@dazno.de')
    );

-- ==========================================
-- 5. VÉRIFICATION DES POLITIQUES PROFILES
-- ==========================================

-- Politiques pour profiles (sans référence à admin_roles)
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON profiles;

CREATE POLICY "Public insert profiles" ON profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users read own profile" ON profiles
    FOR SELECT USING (
        auth.uid() = id
    );

CREATE POLICY "Users update own profile" ON profiles
    FOR UPDATE USING (
        auth.uid() = id
    );

CREATE POLICY "Admin read all profiles" ON profiles
    FOR SELECT USING (
        auth.role() = 'authenticated' 
        AND auth.jwt() ->> 'email' IN ('admin@dazno.de', 'contact@dazno.de')
    );

-- ==========================================
-- 6. VÉRIFICATION FINALE
-- ==========================================

-- Vérifier que toutes les politiques sont créées
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    cmd 
FROM pg_policies 
WHERE tablename IN ('contacts', 'user_email_tracking', 'otp_codes', 'orders', 'profiles')
ORDER BY tablename, policyname;

-- Vérifier qu'il n'y a plus de récursion
SELECT 
    schemaname, 
    tablename, 
    policyname,
    pg_get_expr(qual, polrelid) as policy_condition
FROM pg_policies 
WHERE pg_get_expr(qual, polrelid) LIKE '%admin_roles%'
   OR pg_get_expr(qual, polrelid) LIKE '%recursion%';
