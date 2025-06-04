-- Migration pour corriger le type de payment_status de BOOLEAN vers TEXT
-- pour être compatible avec les nouveaux standards du code

-- 1. Ajouter une nouvelle colonne avec le bon type
ALTER TABLE public.orders ADD COLUMN payment_status_new TEXT DEFAULT 'pending';

-- 2. Migrer les données existantes
UPDATE public.orders 
SET payment_status_new = CASE 
  WHEN payment_status = TRUE THEN 'paid'
  WHEN payment_status = FALSE THEN 'pending'
  ELSE 'pending'
END;

-- 3. Supprimer l'ancienne colonne
ALTER TABLE public.orders DROP COLUMN payment_status;

-- 4. Renommer la nouvelle colonne
ALTER TABLE public.orders RENAME COLUMN payment_status_new TO payment_status;

-- 5. Ajouter une contrainte pour valider les valeurs autorisées
ALTER TABLE public.orders ADD CONSTRAINT payment_status_check 
CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled'));

-- 6. Recréer l'index
DROP INDEX IF EXISTS idx_orders_payment_status;
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);

-- 7. Créer la table checkout_sessions si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.checkout_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    order_id UUID REFERENCES public.orders(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'expired')),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'BTC',
    payment_method TEXT,
    payment_status TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Créer les index pour checkout_sessions
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON public.checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_order_id ON public.checkout_sessions(order_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON public.checkout_sessions(status);

-- 9. Activer RLS sur checkout_sessions
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

-- 10. Politiques RLS pour checkout_sessions
DROP POLICY IF EXISTS "Users can view own checkout sessions" ON public.checkout_sessions;
CREATE POLICY "Users can view own checkout sessions" ON public.checkout_sessions
    FOR SELECT USING (auth.uid()::text = user_id::text OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert own checkout sessions" ON public.checkout_sessions;
CREATE POLICY "Users can insert own checkout sessions" ON public.checkout_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update own checkout sessions" ON public.checkout_sessions;
CREATE POLICY "Users can update own checkout sessions" ON public.checkout_sessions
    FOR UPDATE USING (auth.uid()::text = user_id::text OR user_id IS NULL);

-- 11. Trigger pour updated_at sur checkout_sessions
DROP TRIGGER IF EXISTS update_checkout_sessions_updated_at ON public.checkout_sessions;
CREATE TRIGGER update_checkout_sessions_updated_at
    BEFORE UPDATE ON public.checkout_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 12. Mettre à jour la fonction notify_order_status_change pour le nouveau type TEXT
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Seulement si le statut a changé vers 'paid' ou 'shipped'
    IF OLD.payment_status != NEW.payment_status AND NEW.payment_status IN ('paid', 'shipped', 'delivered') THEN
        PERFORM http((
            'POST',
            current_setting('app.settings.edge_function_url') || '/functions/v1/send-status-update',
            ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))],
            'application/json',
            jsonb_build_object(
                'order_id', NEW.id,
                'old_status', OLD.payment_status,
                'new_status', NEW.payment_status,
                'customer_email', NEW.metadata->>'customer'->>'email'
            )::text
        )::http_request);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Mettre à jour les politiques RLS pour orders si nécessaire
-- Les politiques existantes pour orders devraient continuer à fonctionner 