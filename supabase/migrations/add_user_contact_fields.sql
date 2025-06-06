-- Migration pour ajouter les champs de contact utilisateur
-- Date: 2025-01-26
-- Description: Ajout des champs adresse et Telegram pour enrichir les profils utilisateur

-- 1. Ajouter le champ adresse complète
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. Ajouter les champs d'adresse détaillés
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS ville TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS code_postal TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pays TEXT DEFAULT 'France';

-- 3. Ajouter le champ compte Telegram
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS compte_telegram TEXT;

-- 4. Ajouter des contraintes de validation
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_telegram_format 
CHECK (compte_telegram IS NULL OR compte_telegram ~ '^@[a-zA-Z0-9_]{5,32}$');

ALTER TABLE public.profiles 
ADD CONSTRAINT valid_postal_code_format 
CHECK (code_postal IS NULL OR code_postal ~ '^[0-9]{5}$');

-- 5. Créer des index pour les recherches
CREATE INDEX IF NOT EXISTS idx_profiles_ville ON public.profiles(ville);
CREATE INDEX IF NOT EXISTS idx_profiles_pays ON public.profiles(pays);
CREATE INDEX IF NOT EXISTS idx_profiles_telegram ON public.profiles(compte_telegram);

-- 6. Mettre à jour la fonction de calcul du score de profil
CREATE OR REPLACE FUNCTION calculate_profile_score(profile_record public.profiles)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Email vérifié (15 points)
  IF profile_record.email_verified THEN
    score := score + 15;
  END IF;
  
  -- Pubkey renseignée (20 points)
  IF profile_record.pubkey IS NOT NULL AND profile_record.pubkey != '' THEN
    score := score + 20;
  END IF;
  
  -- Compte Twitter/X (15 points)
  IF profile_record.compte_x IS NOT NULL AND profile_record.compte_x != '' THEN
    score := score + 15;
  END IF;
  
  -- Compte Nostr (15 points)
  IF profile_record.compte_nostr IS NOT NULL AND profile_record.compte_nostr != '' THEN
    score := score + 15;
  END IF;
  
  -- Compte Telegram (10 points)
  IF profile_record.compte_telegram IS NOT NULL AND profile_record.compte_telegram != '' THEN
    score := score + 10;
  END IF;
  
  -- Téléphone vérifié (15 points)
  IF profile_record.phone_verified THEN
    score := score + 15;
  END IF;
  
  -- Adresse complète (10 points)
  IF (profile_record.address IS NOT NULL AND profile_record.address != '') OR
     (profile_record.ville IS NOT NULL AND profile_record.ville != '' AND 
      profile_record.code_postal IS NOT NULL AND profile_record.code_postal != '') THEN
    score := score + 10;
  END IF;
  
  RETURN LEAST(score, 100); -- Maximum 100 points
END;
$$ LANGUAGE plpgsql;

-- 7. Mettre à jour les scores existants
UPDATE public.profiles 
SET profile_score = calculate_profile_score(profiles.*);

-- 8. Mettre à jour la vue des statistiques
CREATE OR REPLACE VIEW profile_completion_stats AS
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN email_verified THEN 1 END) as verified_emails,
  COUNT(CASE WHEN pubkey IS NOT NULL AND pubkey != '' THEN 1 END) as with_pubkey,
  COUNT(CASE WHEN compte_x IS NOT NULL AND compte_x != '' THEN 1 END) as with_twitter,
  COUNT(CASE WHEN compte_nostr IS NOT NULL AND compte_nostr != '' THEN 1 END) as with_nostr,
  COUNT(CASE WHEN compte_telegram IS NOT NULL AND compte_telegram != '' THEN 1 END) as with_telegram,
  COUNT(CASE WHEN phone_verified THEN 1 END) as verified_phones,
  COUNT(CASE WHEN address IS NOT NULL AND address != '' THEN 1 END) as with_address_simple,
  COUNT(CASE WHEN ville IS NOT NULL AND ville != '' AND code_postal IS NOT NULL AND code_postal != '' THEN 1 END) as with_address_detailed,
  AVG(profile_score) as avg_profile_score,
  COUNT(CASE WHEN profile_score = 100 THEN 1 END) as complete_profiles
FROM public.profiles;

-- 9. Mettre à jour la fonction des champs manquants
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
    'telegram', CASE WHEN profile_record.compte_telegram IS NOT NULL AND profile_record.compte_telegram != '' THEN null ELSE 'Compte Telegram non renseigné' END,
    'phone', CASE WHEN profile_record.phone_verified THEN null ELSE 'Téléphone non vérifié' END,
    'address', CASE WHEN (profile_record.address IS NOT NULL AND profile_record.address != '') OR 
                         (profile_record.ville IS NOT NULL AND profile_record.ville != '' AND 
                          profile_record.code_postal IS NOT NULL AND profile_record.code_postal != '') 
                   THEN null ELSE 'Adresse non renseignée' END
  ) INTO missing_fields;
  
  RETURN missing_fields;
END;
$$ LANGUAGE plpgsql;

-- 10. Ajouter des commentaires pour la documentation
COMMENT ON COLUMN public.profiles.address IS 'Adresse complète sur une ligne';
COMMENT ON COLUMN public.profiles.ville IS 'Ville de résidence';
COMMENT ON COLUMN public.profiles.code_postal IS 'Code postal (format français 5 chiffres)';
COMMENT ON COLUMN public.profiles.pays IS 'Pays de résidence';
COMMENT ON COLUMN public.profiles.compte_telegram IS 'Nom d\'utilisateur Telegram (format @username)';
COMMENT ON CONSTRAINT valid_telegram_format ON public.profiles IS 'Validation du format Telegram @username (5-32 caractères)';
COMMENT ON CONSTRAINT valid_postal_code_format ON public.profiles IS 'Validation du code postal français (5 chiffres)'; 