-- CORRECTIF D'URGENCE : Désactiver temporairement le trigger problématique
-- À exécuter IMMÉDIATEMENT via Supabase Dashboard

-- 1. Supprimer le trigger qui cause l'erreur
DROP TRIGGER IF EXISTS trigger_notify_order_status_change ON orders;

-- 2. Créer une version temporaire compatible avec BOOLEAN
CREATE OR REPLACE FUNCTION notify_order_status_change_temp()
RETURNS TRIGGER AS $$
BEGIN
    -- Version temporaire qui utilise BOOLEAN au lieu de TEXT
    IF OLD.payment_status != NEW.payment_status AND NEW.payment_status = TRUE THEN
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

-- 3. Recréer le trigger avec la fonction temporaire
CREATE TRIGGER trigger_notify_order_status_change_temp
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_order_status_change_temp();

-- Note: Cette solution temporaire sera remplacée par la migration complète 