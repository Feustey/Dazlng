-- Migration pour les fonctionnalités utilisateur avancées
-- Date: 2024-12-01

-- ============================================================================
-- EXTENSION DE LA TABLE PROFILES
-- ============================================================================

-- Ajout des nouvelles colonnes pour le profil avancé
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS studies JSONB;

-- Ajout des métriques enrichies
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_transactions INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS response_time INTEGER DEFAULT 0; -- en secondes;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active_days INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- ============================================================================
-- TABLE DES EXPÉRIENCES PROFESSIONNELLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_experiences (;
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  company VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  industry VARCHAR(100),
  from_date TIMESTAMP WITH TIME ZONE NOT NULL,
  to_date TIMESTAMP WITH TIME ZONE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_experiences_user_id ON user_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_experiences_from_date ON user_experiences(from_date);

-- ============================================================================
-- TABLE DES COMPÉTENCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_skills (;
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  category VARCHAR(50) NOT NULL,
  description TEXT,
  endorsements INTEGER DEFAULT 0,
  endorsed_by UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_category ON user_skills(category);
CREATE INDEX IF NOT EXISTS idx_user_skills_level ON user_skills(level);

-- ============================================================================
-- TABLE DES FAVORIS
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_favorites (;
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('service', 'provider', 'benefit')),
  item_id VARCHAR(255) NOT NULL,
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_type ON user_favorites(type);
CREATE INDEX IF NOT EXISTS idx_user_favorites_item_id ON user_favorites(item_id);

-- Contrainte d'unicité pour éviter les doublons'
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_favorites_unique ON user_favorites(user_id, type, item_id);

-- ============================================================================
-- TABLE DE L'HISTORIQUE DES MOTS DE PASSE'
-- ============================================================================

CREATE TABLE IF NOT EXISTS password_history (;
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45), -- Support IPv6
  user_agent TEXT
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_password_history_user_id ON password_history(user_id);
CREATE INDEX IF NOT EXISTS idx_password_history_changed_at ON password_history(changed_at);

-- ============================================================================
-- FONCTIONS ET TRIGGERS
-- ============================================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_user_experiences_updated_at 
  BEFORE UPDATE ON user_experiences ;
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_skills_updated_at 
  BEFORE UPDATE ON user_skills ;
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- POLITIQUES RLS (Row Level Security)
-- ============================================================================

-- Activer RLS sur les nouvelles tables
ALTER TABLE user_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_history ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_experiences
CREATE POLICY "Users can view their own experiences" ON user_experiences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experiences" ON user_experiences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences" ON user_experiences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences" ON user_experiences
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour user_skills
CREATE POLICY "Users can view their own skills" ON user_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills" ON user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" ON user_skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" ON user_skills
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour user_favorites
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour password_history
CREATE POLICY "Users can view their own password history" ON password_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert password history" ON password_history
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- COMMENTAIRES
-- ============================================================================

COMMENT ON TABLE user_experiences IS 'Expériences professionnelles des utilisateurs';
COMMENT ON TABLE user_skills IS 'Compétences des utilisateurs';
COMMENT ON TABLE user_favorites IS 'Favoris des utilisateurs';
COMMENT ON TABLE password_history IS 'Historique des changements de mot de passe';

COMMENT ON COLUMN profiles.phone IS 'Numéro de téléphone de l''utilisateur';
COMMENT ON COLUMN profiles.preferences IS 'Préférences utilisateur (notifications, langue, etc.)';
COMMENT ON COLUMN profiles.social_links IS 'Liens vers les réseaux sociaux';
COMMENT ON COLUMN profiles.privacy_settings IS 'Paramètres de confidentialité';
COMMENT ON COLUMN profiles.notification_settings IS 'Paramètres de notifications';
COMMENT ON COLUMN profiles.studies IS 'Informations d''études';
COMMENT ON COLUMN profiles.total_transactions IS 'Nombre total de transactions';
COMMENT ON COLUMN profiles.average_rating IS 'Note moyenne reçue';
COMMENT ON COLUMN profiles.total_reviews IS 'Nombre total d''avis';
COMMENT ON COLUMN profiles.completion_rate IS 'Taux de complétion des services (%)';
COMMENT ON COLUMN profiles.response_time IS 'Temps de réponse moyen (secondes)';
COMMENT ON COLUMN profiles.active_days IS 'Nombre de jours actifs';
COMMENT ON COLUMN profiles.referral_count IS 'Nombre de parrainages';
COMMENT ON COLUMN profiles.last_login_at IS 'Dernière connexion'; 