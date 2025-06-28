-- Create daznode_subscriptions table
CREATE TABLE IF NOT EXISTS daznode_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  pubkey TEXT NOT NULL CHECK (length(pubkey) = 66),
  email TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  payment_hash TEXT UNIQUE,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  recommendations_sent BOOLEAN DEFAULT false,
  admin_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on pubkey for faster lookups
CREATE INDEX IF NOT EXISTS daznode_subscriptions_pubkey_idx ON daznode_subscriptions(pubkey);

-- Create index on payment_hash for faster payment lookups
CREATE INDEX IF NOT EXISTS daznode_subscriptions_payment_hash_idx ON daznode_subscriptions(payment_hash);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_daznode_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daznode_subscriptions_updated_at
  BEFORE UPDATE ON daznode_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_daznode_subscriptions_updated_at();

-- Create daznode_recommendations table
CREATE TABLE IF NOT EXISTS daznode_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES daznode_subscriptions(id),
  pubkey TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'sent', 'failed')),
  admin_validated BOOLEAN DEFAULT false,
  admin_validator TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on pubkey for faster lookups
CREATE INDEX IF NOT EXISTS daznode_recommendations_pubkey_idx ON daznode_recommendations(pubkey);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_daznode_recommendations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daznode_recommendations_updated_at
  BEFORE UPDATE ON daznode_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_daznode_recommendations_updated_at();

-- Create daznode_performance_logs table
CREATE TABLE IF NOT EXISTS daznode_performance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pubkey TEXT NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on pubkey and created_at for faster lookups
CREATE INDEX IF NOT EXISTS daznode_performance_logs_pubkey_created_at_idx 
ON daznode_performance_logs(pubkey, created_at DESC);

-- Create RLS policies
ALTER TABLE daznode_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daznode_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daznode_performance_logs ENABLE ROW LEVEL SECURITY;

-- Policies for daznode_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON daznode_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for daznode_recommendations
CREATE POLICY "Users can view their own recommendations"
  ON daznode_recommendations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daznode_subscriptions
      WHERE daznode_subscriptions.id = subscription_id
      AND daznode_subscriptions.user_id = auth.uid()
    )
  );

-- Policies for daznode_performance_logs
CREATE POLICY "Users can view their own performance logs"
  ON daznode_performance_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daznode_subscriptions
      WHERE daznode_subscriptions.pubkey = daznode_performance_logs.pubkey
      AND daznode_subscriptions.user_id = auth.uid()
    )
  ); 