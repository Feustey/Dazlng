-- ==========================================
-- TRIGGERS ET NOTIFICATIONS AUTOMATIQUES
-- ==========================================

-- Activer l'extension http pour les webhooks
CREATE EXTENSION IF NOT EXISTS http;

-- Fonction pour envoyer des notifications email automatiques
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
DECLARE
    customer_data JSONB;
    webhook_payload JSONB;
BEGIN
    -- Construire le payload pour l'email
    SELECT jsonb_build_object(
        'order_id', NEW.id,
        'amount', NEW.amount,
        'status', NEW.payment_status,
        'customer_email', NEW.metadata->>'customer'->>'email',
        'customer_name', NEW.metadata->>'customer'->>'firstName' || ' ' || NEW.metadata->>'customer'->>'lastName',
        'product_name', NEW.metadata->>'product'->>'name',
        'created_at', NEW.created_at
    ) INTO webhook_payload;

    -- Appeler l'Edge Function pour l'envoi d'email
    PERFORM http((
        'POST',
        current_setting('app.settings.edge_function_url') || '/functions/v1/send-order-notification',
        ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))],
        'application/json',
        webhook_payload::text
    )::http_request);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur les commandes
DROP TRIGGER IF EXISTS trigger_notify_new_order ON orders;
CREATE TRIGGER trigger_notify_new_order
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_order();

-- Fonction pour notifier les changements de statut de commande
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

-- Trigger pour les mises à jour de statut
DROP TRIGGER IF EXISTS trigger_notify_order_status_change ON orders;
CREATE TRIGGER trigger_notify_order_status_change
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_order_status_change();

-- Configuration des variables
-- À exécuter avec vos vraies valeurs
-- SELECT set_config('app.settings.edge_function_url', 'https://votre-projet.supabase.co', false);
-- SELECT set_config('app.settings.service_role_key', 'votre-service-role-key', false); 