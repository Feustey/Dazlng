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

-- Politique de sécurité pour permettre aux utilisateurs d'interagir avec leurs propres tentatives
-- (optionnel selon votre configuration RLS)
-- ALTER TABLE rate_limit_attempts ENABLE ROW LEVEL SECURITY;

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