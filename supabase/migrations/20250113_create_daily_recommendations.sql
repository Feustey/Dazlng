-- Création de la table pour les recommandations journalières
CREATE TABLE IF NOT EXISTS public.daily_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pubkey TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    recommendation_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_daily_recommendations_user_date 
ON public.daily_recommendations(user_id, generated_at);

CREATE INDEX IF NOT EXISTS idx_daily_recommendations_pubkey 
ON public.daily_recommendations(pubkey);

CREATE INDEX IF NOT EXISTS idx_daily_recommendations_expires 
ON public.daily_recommendations(expires_at);

-- RLS (Row Level Security)
ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs ne voient que leurs recommandations
CREATE POLICY "Users can view their own daily recommendations" ON public.daily_recommendations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily recommendations" ON public.daily_recommendations  
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fonction pour nettoyer les recommandations expirées (optionnel)
CREATE OR REPLACE FUNCTION public.cleanup_expired_recommendations()
RETURNS void AS $$
BEGIN
    DELETE FROM public.daily_recommendations 
    WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour la documentation
COMMENT ON TABLE public.daily_recommendations IS 'Stocke les recommandations générées quotidiennement pour chaque utilisateur';
COMMENT ON COLUMN public.daily_recommendations.user_id IS 'ID de l\'utilisateur propriétaire de la recommandation';
COMMENT ON COLUMN public.daily_recommendations.pubkey IS 'Clé publique du nœud Lightning';
COMMENT ON COLUMN public.daily_recommendations.generated_at IS 'Date et heure de génération de la recommandation';
COMMENT ON COLUMN public.daily_recommendations.expires_at IS 'Date et heure d\'expiration de la recommandation';
COMMENT ON COLUMN public.daily_recommendations.recommendation_data IS 'Données JSON de la recommandation générée'; 