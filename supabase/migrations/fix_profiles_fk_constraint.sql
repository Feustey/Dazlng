-- Migration pour corriger les contraintes de clé étrangère de la table profiles
-- Date: 2025-06-05
-- Description: Suppression des FK vers public.users, utilisation d'auth.users directement'

-- 1. Supprimer toute contrainte FK existante vers public.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS fk_profiles_user_id;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- 2. S'assurer que l'ID dans profiles correspond à auth.uid()
-- La table profiles doit avoir son ID qui correspond directement à auth.users.id
-- Pas besoin de FK explicite car Supabase gère ça via RLS et auth.uid()

-- 3. Créer une fonction pour synchroniser les profils avec auth.users
CREATE OR REPLACE FUNCTION sync_auth_user_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Créer automatiquement un profil quand un utilisateur est créé dans auth.users
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,;
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Créer le trigger sur auth.users (si possible, sinon on utilise une autre approche)
-- Note: Cette approche peut ne pas fonctionner selon les permissions Supabase
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users;
--   FOR EACH ROW EXECUTE FUNCTION sync_auth_user_to_profile();

-- 5. Alternative: Fonction pour créer le profil manuellement
CREATE OR REPLACE FUNCTION ensure_profile_exists(user_id UUID, user_email TEXT)
RETURNS JSON AS $$
DECLARE;
  profile_record public.profiles;
BEGIN
  -- Vérifier si le profil existe
  SELECT * INTO profile_record FROM public.profiles WHERE id = user_id;
  
  IF NOT FOUND THEN
    -- Créer le profil
    INSERT INTO public.profiles (
      id, 
      email, 
      email_verified,
      t4g_tokens,
      created_at, 
      updated_at
    ) VALUES (
      user_id, 
      user_email, 
      true, -- Assumé vérifié si vient d'auth'
      1,    -- Token par défaut
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

-- 6. Créer les profils manquants pour les utilisateurs existants dans auth.users
-- Cette partie sera exécutée via API car on ne peut pas facilement accéder à auth.users depuis ici

-- 7. Supprimer la table public.users si elle existe et n'est pas utilisée'
-- DROP TABLE IF EXISTS public.users CASCADE;

-- 8. S'assurer que les politiques RLS sont correctes'
-- Les politiques existantes utilisent auth.uid() donc elles devraient fonctionner

-- 9. Créer un index sur l'email pour les performances'
CREATE INDEX IF NOT EXISTS idx_profiles_email_unique ON public.profiles(email);

-- 10. Ajouter des commentaires pour clarifier l'architecture'
COMMENT ON TABLE public.profiles IS 'Table de profils utilisateur, liée à auth.users via l''ID (auth.uid())';
COMMENT ON COLUMN public.profiles.id IS 'ID utilisateur correspondant à auth.users.id (auth.uid())';
COMMENT ON COLUMN public.profiles.email IS 'Email synchronisé depuis auth.users';

-- 11. Fonction utilitaire pour diagnostiquer les problèmes de profil
CREATE OR REPLACE FUNCTION diagnose_profile_issues()
RETURNS TABLE (
  issue_type TEXT,
  user_id UUID,
  email TEXT,
  description TEXT
) AS $$
BEGIN
  -- Retourner les utilisateurs qui ont des problèmes de profil
  RETURN QUERY
  SELECT 
    'missing_profile'::TEXT,
    au.id,
    au.email::TEXT,
    'User exists in auth.users but not in profiles'::TEXT
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id;
  WHERE p.id IS NULL;
  
  -- Autres diagnostics possibles...
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 