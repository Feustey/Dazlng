-- Table des utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Table des commandes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  product_type TEXT NOT NULL, -- 'dazenode' ou 'daz-ia'
  plan TEXT, -- pour daz-ia: 'oneshot' ou 'abonnement'
  billing_cycle TEXT, -- 'once' ou 'yearly'
  amount INTEGER NOT NULL, -- montant en sats
  payment_method TEXT NOT NULL DEFAULT 'lightning',
  payment_status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table des livraisons
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  address TEXT,
  city TEXT,
  zip_code TEXT,
  country TEXT,
  shipping_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Table des paiements
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  payment_hash TEXT,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

create table public.network_stats (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  value numeric -- à adapter selon tes données (float, integer, etc.)
);


-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Permettre l'insertion par les utilisateurs anonymes
CREATE POLICY "Allow inserts for anonymous users" 
ON users FOR INSERT TO anon 
WITH CHECK (true);

CREATE POLICY "Allow inserts for anonymous users" 
ON orders FOR INSERT TO anon 
WITH CHECK (true);

CREATE POLICY "Allow inserts for anonymous users" 
ON deliveries FOR INSERT TO anon 
WITH CHECK (true);

CREATE POLICY "Allow inserts for anonymous users" 
ON payments FOR INSERT TO anon 
WITH CHECK (true);

-- Limiter l'accès en lecture aux administrateurs
CREATE POLICY "Allow select for authenticated users only" 
ON users FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Allow select for authenticated users only" 
ON orders FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Allow select for authenticated users only" 
ON deliveries FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Allow select for authenticated users only" 
ON payments FOR SELECT TO authenticated 
USING (true); 