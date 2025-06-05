-- ==========================================
-- POLITIQUES RLS SÉCURISÉES POUR ORDERS
-- ==========================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques trop permissives
DROP POLICY IF EXISTS "orders_all_operations" ON orders;
DROP POLICY IF EXISTS "Allow anonymous orders" ON orders;

-- Politiques strictes
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT 
    TO authenticated
    USING (
        auth.uid()::text = user_id::text 
        OR user_id IS NULL -- Commandes anonymes
    );

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        auth.uid()::text = user_id::text 
        OR user_id IS NULL -- Permettre commandes anonymes
    );

-- Seuls les admins peuvent modifier/supprimer
CREATE POLICY "Admins can manage all orders" ON orders
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.email LIKE '%@dazno.de'
        )
    );

-- Service role accès complet
CREATE POLICY "Service role full access orders" ON orders
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true); 