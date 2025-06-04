-- Table pour les logs de sécurité
CREATE TABLE IF NOT EXISTS security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index pour les requêtes fréquentes
    CHECK (event_type IN ('AUTH_SUCCESS', 'AUTH_FAILURE', 'UNAUTHORIZED_ACCESS', 'SUSPICIOUS_ACTIVITY'))
);

-- Index pour performance
CREATE INDEX idx_security_logs_timestamp ON security_logs(timestamp DESC);
CREATE INDEX idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX idx_security_logs_ip ON security_logs(ip_address);

-- RLS pour cette table (seuls les admins peuvent lire)
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read security logs" ON security_logs
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.email LIKE '%@dazno.de'
        )
    );

-- Service role accès complet
CREATE POLICY "Service role full access security logs" ON security_logs
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true); 