-- Migration: Création de la table user_actions
-- Date: 2025-01-06
-- Description: Table pour tracker les actions utilisateurs et leurs résultats

-- Créer la table user_actions
CREATE TABLE IF NOT EXISTS public.user_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
    estimated_gain INTEGER,
    actual_gain INTEGER,
    user_segment VARCHAR(20) CHECK (user_segment IN ('prospect', 'lead', 'client', 'premium', 'champion')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON public.user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_action_type ON public.user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_user_actions_status ON public.user_actions(status);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_segment ON public.user_actions(user_segment);
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON public.user_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_actions_action_type_status ON public.user_actions(action_type, status);
CREATE INDEX IF NOT EXISTS idx_user_actions_action_type_segment ON public.user_actions(action_type, user_segment);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_user_actions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_user_actions_updated_at_trigger
    BEFORE UPDATE ON public.user_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_actions_updated_at();

-- Activer RLS (Row Level Security)
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs peuvent voir et modifier leurs propres actions
CREATE POLICY "user_actions_user_policy" ON public.user_actions
    FOR ALL USING (auth.uid() = user_id);

-- Politique RLS : Les admins peuvent voir toutes les actions
CREATE POLICY "user_actions_admin_policy" ON public.user_actions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role IN ('super_admin', 'admin')
        )
    );

-- Commentaires pour la documentation
COMMENT ON TABLE public.user_actions IS 'Table pour tracker les actions utilisateurs et leurs résultats';
COMMENT ON COLUMN public.user_actions.user_id IS 'Référence vers l''utilisateur qui a effectué l''action';
COMMENT ON COLUMN public.user_actions.action_type IS 'Type d''action effectuée (verify-email, add-pubkey, etc.)';
COMMENT ON COLUMN public.user_actions.status IS 'Statut de l''action (started, completed, failed)';
COMMENT ON COLUMN public.user_actions.estimated_gain IS 'Gain estimé en satoshis lors de la recommandation';
COMMENT ON COLUMN public.user_actions.actual_gain IS 'Gain réel en satoshis après application';
COMMENT ON COLUMN public.user_actions.user_segment IS 'Segment utilisateur au moment de l''action';
COMMENT ON COLUMN public.user_actions.metadata IS 'Données supplémentaires (source, contexte, etc.)';

-- Vérification de la création
DO $$
BEGIN
    -- Vérifier que la table existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_actions' AND table_schema = 'public') THEN
        RAISE NOTICE 'Table user_actions créée avec succès';
    ELSE
        RAISE EXCEPTION 'Erreur: Table user_actions non créée';
    END IF;
    
    -- Vérifier que les colonnes existent
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_actions' AND column_name = 'user_segment') THEN
        RAISE EXCEPTION 'Erreur: Colonne user_segment manquante';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_actions' AND column_name = 'estimated_gain') THEN
        RAISE EXCEPTION 'Erreur: Colonne estimated_gain manquante';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_actions' AND column_name = 'actual_gain') THEN
        RAISE EXCEPTION 'Erreur: Colonne actual_gain manquante';
    END IF;
    
    RAISE NOTICE 'Toutes les colonnes requises sont présentes';
END $$; 