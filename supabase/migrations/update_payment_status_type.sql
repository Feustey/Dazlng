-- Créer une nouvelle colonne temporaire de type boolean
ALTER TABLE orders ADD COLUMN payment_status_bool BOOLEAN DEFAULT FALSE;

-- Copier les données existantes avec conversion
UPDATE orders 
SET payment_status_bool = CASE 
  WHEN payment_status = 'true' OR payment_status = 'completed' OR payment_status = 'success' THEN TRUE 
  ELSE FALSE 
END;

-- Supprimer l'ancienne colonne
ALTER TABLE orders DROP COLUMN payment_status;

-- Renommer la nouvelle colonne
ALTER TABLE orders RENAME COLUMN payment_status_bool TO payment_status; 