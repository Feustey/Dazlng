-- Table pour stocker les logs de paiement Lightning
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_hash TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  error TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS payment_logs_payment_hash_idx ON payment_logs (payment_hash);
CREATE INDEX IF NOT EXISTS payment_logs_status_idx ON payment_logs (status);
CREATE INDEX IF NOT EXISTS payment_logs_created_at_idx ON payment_logs (created_at DESC);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_payment_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_payment_logs_updated_at ON payment_logs;
CREATE TRIGGER update_payment_logs_updated_at
  BEFORE UPDATE ON payment_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_logs_updated_at();

-- Politique RLS pour restreindre l'accès
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins (accès complet)
CREATE POLICY admin_payment_logs_policy ON payment_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Politique pour les utilisateurs (lecture seule de leurs propres paiements)
CREATE POLICY user_payment_logs_policy ON payment_logs
  FOR SELECT
  TO authenticated
  USING (
    payment_hash IN (
      SELECT payment_hash FROM orders
      WHERE orders.user_id = auth.uid()
    )
  );

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