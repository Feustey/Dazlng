-- Migration pour corriger les champs du profil et ajouter les contraintes d'unicité
-- Date: 2025-06-05
-- Description: Ajout de contraintes d'unicité et champs manquants pour le système de score

-- 1. Ajouter le champ phone_verified manquant
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;

-- 2. Ajouter le champ phone pour stocker le numéro
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. Ajouter contrainte d'unicité sur la pubkey (CRITIQUE pour éviter les conflits)
-- D'abord, nettoyer les doublons potentiels
WITH duplicates AS (
  SELECT pubkey, MIN(created_at) as first_created
  FROM public.profiles 
  WHERE pubkey IS NOT NULL AND pubkey != ''
  GROUP BY pubkey 
  HAVING COUNT(*) > 1
)
UPDATE public.profiles 
SET pubkey = NULL 
WHERE pubkey IN (SELECT pubkey FROM duplicates) 
  AND created_at NOT IN (SELECT first_created FROM duplicates);

-- Maintenant ajouter la contrainte d'unicité
ALTER TABLE public.profiles 
ADD CONSTRAINT unique_pubkey UNIQUE(pubkey) DEFERRABLE INITIALLY DEFERRED;

-- 4. Ajouter contrainte d'unicité sur l'email (sécurité)
ALTER TABLE public.profiles 
ADD CONSTRAINT unique_email UNIQUE(email) DEFERRABLE INITIALLY DEFERRED;

-- 5. Ajouter un index sur phone pour les recherches
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_phone_verified ON public.profiles(phone_verified);

-- 6. Ajouter des contraintes de validation
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_pubkey_format 
CHECK (pubkey IS NULL OR pubkey ~ '^[0-9a-fA-F]{66}$');

ALTER TABLE public.profiles 
ADD CONSTRAINT valid_email_format 
CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

ALTER TABLE public.profiles 
ADD CONSTRAINT valid_phone_format 
CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$');

-- 7. Créer une fonction pour calculer le score de profil
CREATE OR REPLACE FUNCTION calculate_profile_score(profile_record public.profiles)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Email vérifié (20 points)
  IF profile_record.email_verified THEN
    score := score + 20;
  END IF;
  
  -- Pubkey renseignée (20 points)
  IF profile_record.pubkey IS NOT NULL AND profile_record.pubkey != '' THEN
    score := score + 20;
  END IF;
  
  -- Compte Twitter/X (20 points)
  IF profile_record.compte_x IS NOT NULL AND profile_record.compte_x != '' THEN
    score := score + 20;
  END IF;
  
  -- Compte Nostr (20 points)
  IF profile_record.compte_nostr IS NOT NULL AND profile_record.compte_nostr != '' THEN
    score := score + 20;
  END IF;
  
  -- Téléphone vérifié (20 points)
  IF profile_record.phone_verified THEN
    score := score + 20;
  END IF;
  
  RETURN LEAST(score, 100); -- Maximum 100 points
END;
$$ LANGUAGE plpgsql;

-- 8. Ajouter une colonne pour stocker le score calculé (cache)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_score INTEGER DEFAULT 0;

-- 9. Créer un trigger pour mettre à jour automatiquement le score
CREATE OR REPLACE FUNCTION update_profile_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_score := calculate_profile_score(NEW);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_update_profile_score ON public.profiles;
CREATE TRIGGER trigger_update_profile_score
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_score();

-- 10. Mettre à jour les scores existants
UPDATE public.profiles 
SET profile_score = calculate_profile_score(profiles.*);

-- 11. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_score ON public.profiles(profile_score);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);

-- 12. Ajouter des commentaires pour la documentation
COMMENT ON COLUMN public.profiles.phone_verified IS 'Indique si le numéro de téléphone a été vérifié';
COMMENT ON COLUMN public.profiles.profile_score IS 'Score de complétude du profil (0-100), calculé automatiquement';
COMMENT ON CONSTRAINT unique_pubkey ON public.profiles IS 'Contrainte d''unicité sur la pubkey Lightning pour éviter les conflits';
COMMENT ON CONSTRAINT unique_email ON public.profiles IS 'Contrainte d''unicité sur l''email pour éviter les doublons';

-- 13. Ajouter une vue pour les statistiques de profil
CREATE OR REPLACE VIEW profile_completion_stats AS
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN email_verified THEN 1 END) as verified_emails,
  COUNT(CASE WHEN pubkey IS NOT NULL AND pubkey != '' THEN 1 END) as with_pubkey,
  COUNT(CASE WHEN compte_x IS NOT NULL AND compte_x != '' THEN 1 END) as with_twitter,
  COUNT(CASE WHEN compte_nostr IS NOT NULL AND compte_nostr != '' THEN 1 END) as with_nostr,
  COUNT(CASE WHEN phone_verified THEN 1 END) as verified_phones,
  AVG(profile_score) as avg_profile_score,
  COUNT(CASE WHEN profile_score = 100 THEN 1 END) as complete_profiles
FROM public.profiles;

-- 14. Fonction utilitaire pour obtenir les champs manquants d'un profil
CREATE OR REPLACE FUNCTION get_missing_profile_fields(user_id UUID)
RETURNS JSON AS $$
DECLARE
  profile_record public.profiles;
  missing_fields JSON;
BEGIN
  SELECT * INTO profile_record FROM public.profiles WHERE id = user_id;
  
  IF NOT FOUND THEN
    RETURN '{"error": "Profile not found"}';
  END IF;
  
  SELECT json_build_object(
    'email_verified', CASE WHEN profile_record.email_verified THEN null ELSE 'Email non vérifié' END,
    'pubkey', CASE WHEN profile_record.pubkey IS NOT NULL AND profile_record.pubkey != '' THEN null ELSE 'Nœud Lightning non connecté' END,
    'twitter', CASE WHEN profile_record.compte_x IS NOT NULL AND profile_record.compte_x != '' THEN null ELSE 'Compte Twitter non renseigné' END,
    'nostr', CASE WHEN profile_record.compte_nostr IS NOT NULL AND profile_record.compte_nostr != '' THEN null ELSE 'Compte Nostr non renseigné' END,
    'phone', CASE WHEN profile_record.phone_verified THEN null ELSE 'Téléphone non vérifié' END
  ) INTO missing_fields;
  
  RETURN missing_fields;
END;
$$ LANGUAGE plpgsql; 