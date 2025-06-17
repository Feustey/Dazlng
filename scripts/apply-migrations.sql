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

-- 3. Ajout des contraintes UNIQUE de manière sécurisée
DO $$ 
BEGIN
    -- Contrainte unique sur l'email
    BEGIN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
    EXCEPTION 
        WHEN duplicate_object THEN 
            RAISE NOTICE 'Contrainte email unique déjà existante';
    END;

    -- Contrainte unique sur la pubkey
    BEGIN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_pubkey_unique UNIQUE (pubkey);
    EXCEPTION 
        WHEN duplicate_object THEN 
            RAISE NOTICE 'Contrainte pubkey unique déjà existante';
    END;
END $$;

-- 4. Validation des formats de manière sécurisée
DO $$ 
BEGIN
    -- Contrainte de format pour pubkey
    BEGIN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_pubkey_format 
        CHECK (pubkey IS NULL OR pubkey ~ '^[0-9a-fA-F]{66}$');
    EXCEPTION 
        WHEN duplicate_object THEN 
            RAISE NOTICE 'Contrainte format pubkey déjà existante';
    END;

    -- Contrainte de format pour email
    BEGIN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_format 
        CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    EXCEPTION 
        WHEN duplicate_object THEN 
            RAISE NOTICE 'Contrainte format email déjà existante';
    END;

    -- Contrainte de format pour téléphone
    BEGIN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_phone_format 
        CHECK (phone IS NULL OR phone ~ '^\+[1-9]\d{1,14}$');
    EXCEPTION 
        WHEN duplicate_object THEN 
            RAISE NOTICE 'Contrainte format téléphone déjà existante';
    END;
END $$;

-- 5. Fonction de calcul du score
DROP FUNCTION IF EXISTS calculate_profile_score(profiles);
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
DROP FUNCTION IF EXISTS ensure_profile_exists(uuid, text);
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

-- ================================================================
-- CRÉATION DES TABLES DE RATE LIMITING
-- ================================================================

-- Création de la table pour le rate limiting
CREATE TABLE IF NOT EXISTS rate_limit_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    identifier TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    created_at_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes par identifier et created_at
CREATE INDEX IF NOT EXISTS rate_limit_attempts_identifier_idx ON rate_limit_attempts(identifier);
CREATE INDEX IF NOT EXISTS rate_limit_attempts_created_at_idx ON rate_limit_attempts(created_at);

-- Index composé pour les requêtes de rate limiting
CREATE INDEX IF NOT EXISTS rate_limit_attempts_identifier_created_at_idx ON rate_limit_attempts(identifier, created_at);

-- Tables pour le rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_limit_blocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS rate_limits_key_timestamp_idx ON rate_limits(key, timestamp);
CREATE INDEX IF NOT EXISTS rate_limit_blocks_key_idx ON rate_limit_blocks(key);
CREATE INDEX IF NOT EXISTS rate_limit_blocks_expires_at_idx ON rate_limit_blocks(expires_at);

-- Fonction pour compter les requêtes dans une fenêtre
CREATE OR REPLACE FUNCTION count_requests(p_key TEXT, p_start TIMESTAMP WITH TIME ZONE)
RETURNS TABLE (count BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT count(*)::bigint
    FROM rate_limits
    WHERE key = p_key
    AND timestamp >= p_start;
END;
$$;

-- ================================================================
-- CRÉATION DE LA TABLE DES COMMANDES
-- ================================================================

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id uuid default uuid_generate_v4() primary key,
  product text not null,
  amount bigint not null,
  customer_name text not null,
  customer_email text not null,
  customer_address text,
  plan text,
  status text not null check (status in ('pending', 'paid', 'failed')),
  payment_hash text unique,
  payment_request text,
  order_ref text unique,
  paid_at timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Ajout idempotent des colonnes attendues si la table existait déjà
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount bigint;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS plan text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_hash text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_request text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_ref text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at timestamp with time zone;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS metadata jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now()) not null;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_payment_hash_idx ON orders(payment_hash);
CREATE INDEX IF NOT EXISTS orders_order_ref_idx ON orders(order_ref);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);

-- Trigger pour la mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- ================================================================
-- CRÉATION DE LA TABLE DES LOGS DE PAIEMENT
-- ================================================================

-- Table de logs des paiements
CREATE TABLE IF NOT EXISTS payment_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id),
    order_ref TEXT NOT NULL,
    payment_hash TEXT NOT NULL UNIQUE,
    payment_request TEXT NOT NULL,
    amount BIGINT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'settled', 'expired', 'failed')),
    error TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS payment_logs_order_id_idx ON payment_logs(order_id);
CREATE INDEX IF NOT EXISTS payment_logs_payment_hash_idx ON payment_logs(payment_hash);
CREATE INDEX IF NOT EXISTS payment_logs_status_idx ON payment_logs(status);
CREATE INDEX IF NOT EXISTS payment_logs_created_at_idx ON payment_logs(created_at DESC);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_payment_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    new.updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_logs_updated_at
    BEFORE UPDATE ON payment_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_logs_updated_at();

-- Fonction pour nettoyer les vieux logs (> 30 jours)
CREATE OR REPLACE FUNCTION cleanup_old_payment_logs()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM payment_logs
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND status IN ('expired', 'failed');
END;
$$;

-- Trigger pour nettoyer automatiquement les vieux logs
CREATE OR REPLACE FUNCTION trigger_cleanup_old_payment_logs()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM cleanup_old_payment_logs();
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER cleanup_old_payment_logs_trigger
    AFTER INSERT ON payment_logs
    EXECUTE FUNCTION trigger_cleanup_old_payment_logs();

-- ================================================================
-- VÉRIFICATION FINALE
-- ================================================================

-- Vérification des tables créées
SELECT 'Tables créées avec succès !' AS message;
SELECT COUNT(*) AS rate_limits_count FROM rate_limits;
SELECT COUNT(*) AS rate_limit_blocks_count FROM rate_limit_blocks;
SELECT COUNT(*) AS payment_logs_count FROM payment_logs;
SELECT COUNT(*) AS orders_count FROM orders;

-- Ajouter la colonne customer_email si elle n'existe pas
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email text; 