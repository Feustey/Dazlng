-- ================================================================
-- SCRIPT COMPLET : Application des migrations pour DazNode
-- ================================================================

-- 1. Suppression des contraintes FK problématiques
BEGIN;

-- Supprimer la contrainte FK vers public.users si elle existe
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

COMMIT;

-- 2. Ajout des nouveaux champs manquants
BEGIN;

-- Ajouter les champs manquants s'ils n'existent pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_score INTEGER DEFAULT 20;

COMMIT;

-- 3. Ajout des contraintes UNIQUE
BEGIN;

-- Contrainte unique sur l'email (éviter les doublons)
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS profiles_email_unique UNIQUE (email);

-- Contrainte unique sur la pubkey (éviter les doublons)
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS profiles_pubkey_unique UNIQUE (pubkey);

COMMIT;

-- 4. Validation des formats
BEGIN;

-- Contrainte de format pour pubkey (66 caractères hexadécimaux)
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS profiles_pubkey_format 
CHECK (pubkey IS NULL OR pubkey ~ '^[0-9a-fA-F]{66}$');

-- Contrainte de format pour email
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS profiles_email_format 
CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Contrainte de format pour téléphone (format E.164)
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS profiles_phone_format 
CHECK (phone IS NULL OR phone ~ '^\+[1-9]\d{1,14}$');

COMMIT;

-- 5. Fonction de calcul du score
CREATE OR REPLACE FUNCTION calculate_profile_score(user_profile profiles)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    CASE WHEN user_profile.email_verified THEN 20 ELSE 0 END +
    CASE WHEN user_profile.pubkey IS NOT NULL THEN 20 ELSE 0 END +
    CASE WHEN user_profile.compte_x IS NOT NULL THEN 20 ELSE 0 END +
    CASE WHEN user_profile.compte_nostr IS NOT NULL THEN 20 ELSE 0 END +
    CASE WHEN user_profile.phone_verified THEN 20 ELSE 0 END
  );
END;
$$ LANGUAGE plpgsql;

-- 6. Fonction de création de profil sécurisée
CREATE OR REPLACE FUNCTION ensure_profile_exists(user_id UUID, user_email TEXT)
RETURNS UUID AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Vérifier si le profil existe déjà
  SELECT id INTO profile_id 
  FROM public.profiles 
  WHERE id = user_id;
  
  -- Si le profil n'existe pas, le créer
  IF profile_id IS NULL THEN
    INSERT INTO public.profiles (
      id, 
      email, 
      nom, 
      prenom, 
      t4g_tokens, 
      email_verified, 
      created_at, 
      updated_at,
      profile_score
    ) VALUES (
      user_id,
      user_email,
      '',
      '',
      1,
      TRUE,
      NOW(),
      NOW(),
      20  -- 20 points pour email_verified = TRUE
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id INTO profile_id;
    
    -- Si l'INSERT a réussi, récupérer l'ID
    IF profile_id IS NULL THEN
      SELECT id INTO profile_id FROM public.profiles WHERE id = user_id;
    END IF;
  END IF;
  
  RETURN profile_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger pour mise à jour automatique du score
CREATE OR REPLACE FUNCTION update_profile_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_score := calculate_profile_score(NEW);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer le trigger s'il existe et le recréer
DROP TRIGGER IF EXISTS trigger_update_profile_score ON public.profiles;
CREATE TRIGGER trigger_update_profile_score
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_score();

-- 8. Création des profils manquants
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Pour chaque utilisateur dans auth.users sans profil correspondant
  FOR user_record IN 
    SELECT au.id, au.email
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Créer le profil
    PERFORM ensure_profile_exists(user_record.id, user_record.email);
    RAISE NOTICE 'Profil créé pour: % (%)', user_record.email, user_record.id;
  END LOOP;
END $$;

-- 9. Mise à jour des scores existants
UPDATE public.profiles 
SET profile_score = calculate_profile_score(profiles.*),
    updated_at = NOW()
WHERE profile_score IS NULL OR profile_score = 0;

-- 10. Vérification finale
DO $$
DECLARE
  total_users INTEGER;
  total_profiles INTEGER;
  missing_profiles INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_users FROM auth.users;
  SELECT COUNT(*) INTO total_profiles FROM public.profiles;
  missing_profiles := total_users - total_profiles;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RÉSULTAT DE LA MIGRATION';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Utilisateurs auth.users: %', total_users;
  RAISE NOTICE 'Profils créés: %', total_profiles;
  RAISE NOTICE 'Profils manquants: %', missing_profiles;
  
  IF missing_profiles = 0 THEN
    RAISE NOTICE '✅ SUCCÈS: Tous les profils ont été créés!';
  ELSE
    RAISE NOTICE '⚠️  ATTENTION: % profils manquent encore', missing_profiles;
  END IF;
  RAISE NOTICE '========================================';
END $$; 