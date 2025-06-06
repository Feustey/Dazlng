-- Script pour corriger la colonne email_verified manquante
-- Date: 2025-01-03

-- Ajouter la colonne email_verified si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT TRUE;

-- Mettre à jour les profils existants pour marquer les emails comme vérifiés
UPDATE public.profiles 
SET email_verified = TRUE 
WHERE email_verified IS NULL;

-- Ajouter un commentaire pour documenter
COMMENT ON COLUMN public.profiles.email_verified IS 'Indique si l''email de l''utilisateur a été vérifié';

-- Créer un index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);

-- Afficher le statut
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN email_verified THEN 1 END) as verified_emails,
    COUNT(CASE WHEN email_verified IS NULL THEN 1 END) as null_verified
FROM public.profiles; 