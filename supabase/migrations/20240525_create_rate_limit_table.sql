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