-- Script de correction simple pour la table profiles
-- Date: 2025-01-03
-- Version simplifiée sans contraintes complexes

-- 1. Ajouter tous les champs manquants
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_score INTEGER DEFAULT 20;

-- 2. Mettre à jour les profils existants
UPDATE public.profiles 
SET 
    email_verified = COALESCE(email_verified, TRUE),
    phone_verified = COALESCE(phone_verified, FALSE),
    profile_score = COALESCE(profile_score, 20);

-- 3. Corriger la fonction ensure_profile_exists
CREATE OR REPLACE FUNCTION ensure_profile_exists(user_id UUID, user_email TEXT)
RETURNS JSON AS $$
DECLARE
  profile_record public.profiles;
BEGIN
  -- Vérifier si le profil existe
  SELECT * INTO profile_record FROM public.profiles WHERE id = user_id;
  
  IF NOT FOUND THEN
    -- Créer le profil avec tous les champs requis
    INSERT INTO public.profiles (
      id, 
      email, 
      nom,
      prenom,
      email_verified,
      phone,
      phone_verified,
      t4g_tokens,
      profile_score,
      created_at, 
      updated_at
    ) VALUES (
      user_id, 
      user_email, 
      '',
      '',
      TRUE,
      NULL,
      FALSE,
      1,
      20,
      NOW(), 
      NOW()
    ) RETURNING * INTO profile_record;
  END IF;
  
  RETURN json_build_object(
    'id', profile_record.id,
    'email', profile_record.email,
    'nom', profile_record.nom,
    'prenom', profile_record.prenom,
    'pubkey', profile_record.pubkey,
    'compte_x', profile_record.compte_x,
    'compte_nostr', profile_record.compte_nostr,
    'phone', profile_record.phone,
    'phone_verified', profile_record.phone_verified,
    'profile_score', profile_record.profile_score,
    'email_verified', profile_record.email_verified,
    't4g_tokens', profile_record.t4g_tokens,
    'created_at', profile_record.created_at,
    'updated_at', profile_record.updated_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fonction de calcul du score de profil
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

-- 5. Trigger pour mise à jour automatique du score
CREATE OR REPLACE FUNCTION update_profile_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_score := calculate_profile_score(NEW);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer et recréer le trigger
DROP TRIGGER IF EXISTS trigger_update_profile_score ON public.profiles;
CREATE TRIGGER trigger_update_profile_score
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_score();

-- 6. Mettre à jour les scores existants
UPDATE public.profiles 
SET profile_score = calculate_profile_score(profiles.*);

-- 7. Créer des index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_phone_verified ON public.profiles(phone_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_score ON public.profiles(profile_score);

-- 8. Affichage des statistiques finales
SELECT 
    'Migration terminée' as status,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN email_verified THEN 1 END) as verified_emails,
    COUNT(CASE WHEN pubkey IS NOT NULL AND pubkey != '' THEN 1 END) as with_pubkey,
    ROUND(AVG(profile_score), 2) as avg_profile_score
FROM public.profiles; 