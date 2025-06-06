-- Migration CRM : Création des tables pour le système CRM

-- Table des segments de clients
CREATE TABLE IF NOT EXISTS crm_customer_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL,
    auto_update BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches par nom
CREATE INDEX IF NOT EXISTS idx_crm_segments_name ON crm_customer_segments(name);
CREATE INDEX IF NOT EXISTS idx_crm_segments_auto_update ON crm_customer_segments(auto_update);

-- Table des membres des segments
CREATE TABLE IF NOT EXISTS crm_customer_segment_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id UUID REFERENCES crm_customer_segments(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(segment_id, customer_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_crm_segment_members_segment ON crm_customer_segment_members(segment_id);
CREATE INDEX IF NOT EXISTS idx_crm_segment_members_customer ON crm_customer_segment_members(customer_id);

-- Table des templates d'emails
CREATE TABLE IF NOT EXISTS crm_email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les templates
CREATE INDEX IF NOT EXISTS idx_crm_email_templates_active ON crm_email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_crm_email_templates_category ON crm_email_templates(category);

-- Table des campagnes d'emails
CREATE TABLE IF NOT EXISTS crm_email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_id UUID REFERENCES crm_email_templates(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    segment_ids UUID[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    stats JSONB DEFAULT '{}',
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les campagnes
CREATE INDEX IF NOT EXISTS idx_crm_campaigns_status ON crm_email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_crm_campaigns_created_by ON crm_email_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_campaigns_scheduled ON crm_email_campaigns(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- Table des envois d'emails
CREATE TABLE IF NOT EXISTS crm_email_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES crm_email_campaigns(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Index pour les envois
CREATE INDEX IF NOT EXISTS idx_crm_email_sends_campaign ON crm_email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_crm_email_sends_customer ON crm_email_sends(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_email_sends_status ON crm_email_sends(status);
CREATE INDEX IF NOT EXISTS idx_crm_email_sends_sent_at ON crm_email_sends(sent_at);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger aux tables appropriées
CREATE TRIGGER update_crm_segments_updated_at BEFORE UPDATE ON crm_customer_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_templates_updated_at BEFORE UPDATE ON crm_email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_campaigns_updated_at BEFORE UPDATE ON crm_email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer le nombre de membres d'un segment
CREATE OR REPLACE FUNCTION calculate_segment_member_count(segment_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    member_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO member_count 
    FROM crm_customer_segment_members 
    WHERE segment_id = segment_uuid;
    
    RETURN COALESCE(member_count, 0);
END;
$$ language 'plpgsql';

-- Vue pour les statistiques des segments
CREATE OR REPLACE VIEW crm_segment_stats AS
SELECT 
    s.id,
    s.name,
    s.description,
    s.criteria,
    s.auto_update,
    s.created_at,
    s.updated_at,
    calculate_segment_member_count(s.id) as member_count
FROM crm_customer_segments s;

-- Vue pour les statistiques des campagnes
CREATE OR REPLACE VIEW crm_campaign_stats AS
SELECT 
    c.id,
    c.name,
    c.subject,
    c.status,
    c.scheduled_at,
    c.sent_at,
    c.created_at,
    COUNT(es.id) as total_sends,
    COUNT(CASE WHEN es.status = 'sent' THEN 1 END) as sent_count,
    COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) as delivered_count,
    COUNT(CASE WHEN es.status = 'opened' THEN 1 END) as opened_count,
    COUNT(CASE WHEN es.status = 'clicked' THEN 1 END) as clicked_count,
    COUNT(CASE WHEN es.status = 'bounced' THEN 1 END) as bounced_count,
    COUNT(CASE WHEN es.status = 'failed' THEN 1 END) as failed_count,
    CASE 
        WHEN COUNT(es.id) > 0 THEN 
            ROUND((COUNT(CASE WHEN es.status = 'opened' THEN 1 END)::DECIMAL / COUNT(es.id)) * 100, 2)
        ELSE 0 
    END as open_rate,
    CASE 
        WHEN COUNT(CASE WHEN es.status = 'opened' THEN 1 END) > 0 THEN 
            ROUND((COUNT(CASE WHEN es.status = 'clicked' THEN 1 END)::DECIMAL / COUNT(CASE WHEN es.status = 'opened' THEN 1 END)) * 100, 2)
        ELSE 0 
    END as click_rate
FROM crm_email_campaigns c
LEFT JOIN crm_email_sends es ON c.id = es.campaign_id
GROUP BY c.id, c.name, c.subject, c.status, c.scheduled_at, c.sent_at, c.created_at;

-- Politiques RLS (Row Level Security)
ALTER TABLE crm_customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_customer_segment_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_email_sends ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès pour les administrateurs
-- Note: Ces politiques devront être ajustées selon votre système d'authentification admin

-- Segments : accès complet pour les admins
CREATE POLICY "Admin full access to segments" ON crm_customer_segments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin')
        )
    );

-- Membres des segments : accès complet pour les admins
CREATE POLICY "Admin full access to segment members" ON crm_customer_segment_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin')
        )
    );

-- Templates : accès complet pour les admins
CREATE POLICY "Admin full access to email templates" ON crm_email_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin', 'moderator')
        )
    );

-- Campagnes : accès complet pour les admins
CREATE POLICY "Admin full access to email campaigns" ON crm_email_campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin', 'moderator')
        )
    );

-- Envois : accès en lecture pour les admins
CREATE POLICY "Admin read access to email sends" ON crm_email_sends
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin', 'moderator', 'support')
        )
    );

-- Données initiales pour les segments par défaut
INSERT INTO crm_customer_segments (name, description, criteria, auto_update) VALUES
('Clients Premium', 'Clients avec abonnement premium', '{"subscription":{"plan":["premium"]}}', true),
('Nouveaux Clients', 'Clients inscrits dans les 30 derniers jours', '{"profile":{"created_days_ago":{"max":30}}}', true),
('Clients Inactifs', 'Clients sans connexion depuis 90 jours', '{"activity":{"last_login_days":90}}', true),
('Clients Vérifiés', 'Clients avec email vérifié', '{"profile":{"email_verified":true}}', true),
('Clients Lightning', 'Clients avec clé publique Lightning', '{"profile":{"has_pubkey":true}}', true)
ON CONFLICT DO NOTHING;

-- Templates d'emails par défaut
INSERT INTO crm_email_templates (name, subject, content, category, variables) VALUES
('Bienvenue', 'Bienvenue sur DazNode !', '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenue</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4f46e5;">Bienvenue {{prenom}} !</h1>
        <p>Merci de nous avoir rejoint sur DazNode. Votre aventure dans le Lightning Network commence maintenant.</p>
        <p>Votre email : {{email}}</p>
        <div style="margin: 30px 0;">
            <a href="{{dashboard_url}}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accéder au dashboard</a>
        </div>
        <p>L''équipe DazNode</p>
    </div>
</body>
</html>', 'onboarding', '{"prenom": "Prénom du client", "email": "Email du client", "dashboard_url": "URL du dashboard"}'),

('Newsletter', 'Actualités DazNode', '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Newsletter</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4f46e5;">Actualités DazNode</h1>
        <p>Bonjour {{prenom}},</p>
        <p>Voici les dernières actualités de DazNode :</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            {{newsletter_content}}
        </div>
        <p>Cordialement,<br>L''équipe DazNode</p>
    </div>
</body>
</html>', 'newsletter', '{"prenom": "Prénom du client", "newsletter_content": "Contenu de la newsletter"}')

ON CONFLICT DO NOTHING; 