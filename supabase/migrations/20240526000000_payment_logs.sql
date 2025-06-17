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