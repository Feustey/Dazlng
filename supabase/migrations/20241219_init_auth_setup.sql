-- Script d'initialisation pour Supabase Auth et tables personnalisées
-- Ce script s'assure que toutes les tables et permissions nécessaires sont en place

-- ==========================================
-- 1. VÉRIFICATION ET CRÉATION DES TABLES
-- ==========================================

-- Table users personnalisée (en plus de auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    pubkey TEXT,
    compte_x TEXT,
    compte_nostr TEXT,
    t4g_tokens INTEGER DEFAULT 0,
    node_id TEXT,
    password TEXT, -- Pour l'auth custom si nécessaire
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    customer JSONB,
    product JSONB,
    total INTEGER,
    product_type TEXT,
    plan TEXT,
    billing_cycle TEXT,
    amount INTEGER,
    payment_method TEXT DEFAULT 'lightning',
    payment_status BOOLEAN DEFAULT FALSE,
    payment_hash TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table prospects
CREATE TABLE IF NOT EXISTS public.prospects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    pubkey TEXT,
    choix TEXT,
    source TEXT DEFAULT 'website',
    prospect BOOLEAN DEFAULT TRUE,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table otp_codes
CREATE TABLE IF NOT EXISTS public.otp_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    plan_id TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending',
    payment_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. INDEX POUR PERFORMANCE
-- ==========================================

-- Index sur orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_hash ON public.orders(payment_hash);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- Index sur users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_pubkey ON public.users(pubkey);

-- Index sur prospects
CREATE INDEX IF NOT EXISTS idx_prospects_email ON public.prospects(email);

-- Index sur otp_codes
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON public.otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- ==========================================
-- 3. POLITIQUES RLS (Row Level Security)
-- ==========================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Service role full access users" ON public.users;
CREATE POLICY "Service role full access users" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour la table orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid()::text = user_id::text OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

DROP POLICY IF EXISTS "Service role full access orders" ON public.orders;
CREATE POLICY "Service role full access orders" ON public.orders
    FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour prospects (accès public pour inscription)
DROP POLICY IF EXISTS "Anyone can insert prospects" ON public.prospects;
CREATE POLICY "Anyone can insert prospects" ON public.prospects
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access prospects" ON public.prospects;
CREATE POLICY "Service role full access prospects" ON public.prospects
    FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour OTP codes
DROP POLICY IF EXISTS "Service role full access otp" ON public.otp_codes;
CREATE POLICY "Service role full access otp" ON public.otp_codes
    FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Service role full access subscriptions" ON public.subscriptions;
CREATE POLICY "Service role full access subscriptions" ON public.subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Service role full access payments" ON public.payments;
CREATE POLICY "Service role full access payments" ON public.payments
    FOR ALL USING (auth.role() = 'service_role');

-- ==========================================
-- 4. FONCTIONS UTILITAIRES
-- ==========================================

-- Fonction pour nettoyer les codes OTP expirés
CREATE OR REPLACE FUNCTION cleanup_expired_otp_codes()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.otp_codes 
    WHERE expires_at < EXTRACT(EPOCH FROM NOW()) * 1000;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. COMMENTAIRES ET DOCUMENTATION
-- ==========================================

COMMENT ON TABLE public.users IS 'Table des utilisateurs personnalisée pour stockage des données supplémentaires';
COMMENT ON TABLE public.orders IS 'Table des commandes avec support Lightning Network';
COMMENT ON TABLE public.prospects IS 'Table des prospects et leads marketing';
COMMENT ON TABLE public.otp_codes IS 'Table des codes OTP pour authentification';
COMMENT ON TABLE public.subscriptions IS 'Table des abonnements utilisateurs';
COMMENT ON TABLE public.payments IS 'Table des paiements et transactions';

-- Fin du script d'initialisation 