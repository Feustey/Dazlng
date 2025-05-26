-- Correction table otp_codes: s'assurer que l'UUID est généré automatiquement
-- À exécuter dans Supabase SQL Editor

-- Suppression et recréation propre de la table otp_codes
DROP TABLE IF EXISTS public.otp_codes CASCADE;

CREATE TABLE public.otp_codes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_otp_codes_email ON public.otp_codes(email);
CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at);
CREATE INDEX idx_otp_codes_used ON public.otp_codes(used);

-- Politiques RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Politiques pour otp_codes (accès public pour authentification)
CREATE POLICY "Anyone can insert OTP codes" ON public.otp_codes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read OTP codes" ON public.otp_codes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can update OTP codes" ON public.otp_codes
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete expired OTP codes" ON public.otp_codes
    FOR DELETE USING (true);

-- Test insertion
INSERT INTO public.otp_codes (email, code, expires_at) 
VALUES ('test@example.com', '123456', EXTRACT(EPOCH FROM NOW() + INTERVAL '15 minutes') * 1000);

-- Vérification
SELECT * FROM public.otp_codes WHERE email = 'test@example.com';

-- Nettoyage test
DELETE FROM public.otp_codes WHERE email = 'test@example.com'; 