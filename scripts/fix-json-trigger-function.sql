-- Script pour corriger la fonction notify_new_order avec la bonne syntaxe JSON

CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
DECLARE
    webhook_payload JSONB;
BEGIN
    -- Construire le payload avec la syntaxe JSON correcte
    SELECT jsonb_build_object(
        'order_id', NEW.id,
        'amount', NEW.amount,
        'status', NEW.payment_status,
        'customer_email', NEW.metadata->'customer'->>'email',
        'customer_name', 
            COALESCE(NEW.metadata->'customer'->>'firstName', '') || ' ' || 
            COALESCE(NEW.metadata->'customer'->>'lastName', ''),
        'product_name', NEW.metadata->'product'->>'name',
        'created_at', NEW.created_at
    ) INTO webhook_payload;

    -- Edge Function call (si configuré)
    IF current_setting('app.settings.edge_function_url', true) IS NOT NULL THEN
        PERFORM http((
            'POST',
            current_setting('app.settings.edge_function_url') || '/functions/v1/send-order-notification',
            ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))],
            'application/json',
            webhook_payload::text
        )::http_request);
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN others THEN
        RAISE WARNING 'Erreur dans notify_new_order: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Corriger aussi la deuxième fonction
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.payment_status != NEW.payment_status AND NEW.payment_status IN ('paid', 'shipped', 'delivered') THEN
        IF current_setting('app.settings.edge_function_url', true) IS NOT NULL THEN
            PERFORM http((
                'POST',
                current_setting('app.settings.edge_function_url') || '/functions/v1/send-status-update',
                ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))],
                'application/json',
                jsonb_build_object(
                    'order_id', NEW.id,
                    'old_status', OLD.payment_status,
                    'new_status', NEW.payment_status,
                    'customer_email', NEW.metadata->'customer'->>'email'
                )::text
            )::http_request);
        END IF;
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN others THEN
        RAISE WARNING 'Erreur dans notify_order_status_change: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 