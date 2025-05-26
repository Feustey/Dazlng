-- Migration pour les fonctionnalités administrateur
-- Date: 2024-12-13
-- Description: Création des tables pour l'audit, notifications, permissions et exports admin

-- Table pour les rôles et permissions admin
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator', 'support')),
    permissions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Table pour l'audit des actions admin
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    changes JSONB DEFAULT '{}',
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les notifications admin
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('alert', 'info', 'success', 'warning')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action JSONB,
    read BOOLEAN DEFAULT false,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Table pour les jobs d'export
CREATE TABLE IF NOT EXISTS export_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('users', 'orders', 'payments', 'subscriptions', 'analytics')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    file_url TEXT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Table pour le tracking des emails (si pas déjà existante)
CREATE TABLE IF NOT EXISTS user_email_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    conversion_status TEXT DEFAULT 'otp_only' CHECK (conversion_status IN ('otp_only', 'conversion_candidate', 'converted')),
    source TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_timestamp ON admin_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_entity ON admin_audit_logs(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_id ON admin_notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(admin_id, read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_priority ON admin_notifications(priority, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_export_jobs_admin_id ON export_jobs(admin_id);
CREATE INDEX IF NOT EXISTS idx_export_jobs_status ON export_jobs(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_email_tracking_email ON user_email_tracking(email);
CREATE INDEX IF NOT EXISTS idx_user_email_tracking_status ON user_email_tracking(conversion_status);
CREATE INDEX IF NOT EXISTS idx_user_email_tracking_source ON user_email_tracking(source);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour les mises à jour automatiques
DROP TRIGGER IF EXISTS update_admin_roles_updated_at ON admin_roles;
CREATE TRIGGER update_admin_roles_updated_at 
    BEFORE UPDATE ON admin_roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_export_jobs_updated_at ON export_jobs;
CREATE TRIGGER update_export_jobs_updated_at 
    BEFORE UPDATE ON export_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_email_tracking_updated_at ON user_email_tracking;
CREATE TRIGGER update_user_email_tracking_updated_at 
    BEFORE UPDATE ON user_email_tracking 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) pour les tables admin
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_email_tracking ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (à adapter selon vos besoins de sécurité)
-- Les super admins peuvent tout voir
DROP POLICY IF EXISTS admin_roles_policy ON admin_roles;
CREATE POLICY admin_roles_policy ON admin_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role = 'super_admin'
        )
    );

-- Les admins peuvent voir leurs propres logs et ceux de leur équipe
DROP POLICY IF EXISTS admin_audit_logs_policy ON admin_audit_logs;
CREATE POLICY admin_audit_logs_policy ON admin_audit_logs
    FOR SELECT USING (
        admin_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin')
        )
    );

-- Les admins peuvent voir leurs notifications
DROP POLICY IF EXISTS admin_notifications_policy ON admin_notifications;
CREATE POLICY admin_notifications_policy ON admin_notifications
    FOR ALL USING (admin_id = auth.uid());

-- Les admins peuvent voir leurs exports
DROP POLICY IF EXISTS export_jobs_policy ON export_jobs;
CREATE POLICY export_jobs_policy ON export_jobs
    FOR ALL USING (admin_id = auth.uid());

-- Seuls les admins peuvent voir le tracking email
DROP POLICY IF EXISTS user_email_tracking_policy ON user_email_tracking;
CREATE POLICY user_email_tracking_policy ON user_email_tracking
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin', 'moderator')
        )
    );

-- Bucket de stockage pour les exports (si utilisation de Supabase Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

-- Politique pour le bucket exports
DROP POLICY IF EXISTS "Admins can manage exports" ON storage.objects;
CREATE POLICY "Admins can manage exports" ON storage.objects
    FOR ALL USING (
        bucket_id = 'exports' AND
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin')
        )
    );

-- Données d'exemple pour un super admin (à adapter)
-- INSERT INTO admin_roles (user_id, role, permissions) 
-- VALUES (
--     'UUID_DU_SUPER_ADMIN', 
--     'super_admin', 
--     '[
--         {"resource": "*", "actions": ["read", "write", "delete", "export"]}
--     ]'
-- )
-- ON CONFLICT (user_id) DO NOTHING;

COMMENT ON TABLE admin_roles IS 'Rôles et permissions des administrateurs';
COMMENT ON TABLE admin_audit_logs IS 'Journal d''audit des actions administrateur';
COMMENT ON TABLE admin_notifications IS 'Notifications pour les administrateurs';
COMMENT ON TABLE export_jobs IS 'Jobs d''export de données';
COMMENT ON TABLE user_email_tracking IS 'Suivi des interactions utilisateur par email'; 