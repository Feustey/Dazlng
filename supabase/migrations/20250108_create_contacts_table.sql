-- Création de la table contacts pour stocker les messages du formulaire de contact

CREATE TABLE IF NOT EXISTS contacts (;
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    source VARCHAR(50) DEFAULT 'website',
    status VARCHAR(50) DEFAULT 'NEW' CHECK (status IN ('NEW', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_subject ON contacts(subject);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at 
    BEFORE UPDATE ON contacts 
    FOR EACH ROW ;
    EXECUTE FUNCTION update_contacts_updated_at();

-- RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Politique pour les administrateurs (accès complet)
CREATE POLICY "Admin full access to contacts" ON contacts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin', 'moderator', 'support')
        )
    );

-- Politique pour l'insertion anonyme (pour le formulaire public)'
CREATE POLICY "Anonymous can insert contacts" ON contacts
    FOR INSERT WITH CHECK (true);

-- Commentaires
COMMENT ON TABLE contacts IS 'Messages reçus via le formulaire de contact';
COMMENT ON COLUMN contacts.status IS 'Statut du message: NEW=nouveau, read=lu, replied=répondu, archived=archivé';
COMMENT ON COLUMN contacts.source IS 'Source du contact: website, telegram, etc.';