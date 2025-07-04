-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (;
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product TEXT NOT NULL,
  amount BIGINT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_address TEXT,
  plan TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed')),
  payment_hash TEXT UNIQUE,
  payment_request TEXT,
  order_ref TEXT UNIQUE,
  paid_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL;
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_payment_hash_idx ON orders(payment_hash);
CREATE INDEX IF NOT EXISTS orders_order_ref_idx ON orders(order_ref);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);

-- Trigger pour la mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN;
  NEW.updated_at = timezone('utc'::TEXT, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at;
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at(); 