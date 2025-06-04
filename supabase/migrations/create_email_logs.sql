-- Table pour tracker les emails envoyés
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'order_confirmation', 'contact_form', 'status_update', etc.
    recipient TEXT NOT NULL,
    subject TEXT,
    order_id UUID REFERENCES orders(id),
    contact_id UUID,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Métadonnées additionnelles
    metadata JSONB DEFAULT '{}'
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_email_logs_type ON email_logs(type);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);

-- RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent lire les logs
CREATE POLICY "Admins can read email logs" ON email_logs
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
CREATE POLICY "Service role full access email logs" ON email_logs
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true); 