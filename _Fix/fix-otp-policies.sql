-- Script de correction des politiques RLS pour otp_codes
-- À exécuter dans le SQL Editor de Supabase

-- Politiques pour otp_codes (accès public pour authentification)
DROP POLICY IF EXISTS "Anyone can insert OTP codes" ON public.otp_codes;
CREATE POLICY "Anyone can insert OTP codes" ON public.otp_codes
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read OTP codes" ON public.otp_codes;
CREATE POLICY "Anyone can read OTP codes" ON public.otp_codes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update OTP codes" ON public.otp_codes;
CREATE POLICY "Anyone can update OTP codes" ON public.otp_codes
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete expired OTP codes" ON public.otp_codes;
CREATE POLICY "Anyone can delete expired OTP codes" ON public.otp_codes
    FOR DELETE USING (true);

-- Vérification que les politiques sont créées
SELECT schemaname, tablename, policyname, permissive, cmd 
FROM pg_policies 
WHERE tablename = 'otp_codes'; 