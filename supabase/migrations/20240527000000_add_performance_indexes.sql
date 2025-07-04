-- Ajout des index de performance pour les tables principales

-- Table users
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- Table orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_product_type ON orders (product_type);

-- Table payments
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments (order_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_hash ON payments (payment_hash);

-- Table subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions (plan_id);

-- Table deliveries
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries (order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON deliveries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deliveries_shipping_status ON deliveries (shipping_status);

-- Table prospects
CREATE INDEX IF NOT EXISTS idx_prospects_email ON prospects (email);
CREATE INDEX IF NOT EXISTS idx_prospects_created_at ON prospects (date DESC);
CREATE INDEX IF NOT EXISTS idx_prospects_source ON prospects (source);

-- Table network_stats
CREATE INDEX IF NOT EXISTS idx_network_stats_timestamp ON network_stats (timestamp DESC);

-- Ajout des contraintes de clés étrangères manquantes
ALTER TABLE orders;
ADD CONSTRAINT fk_orders_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE payments;
ADD CONSTRAINT fk_payments_order
FOREIGN KEY (order_id) REFERENCES orders(id)
ON DELETE CASCADE;

ALTER TABLE subscriptions;
ADD CONSTRAINT fk_subscriptions_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE deliveries;
ADD CONSTRAINT fk_deliveries_order
FOREIGN KEY (order_id) REFERENCES orders(id)
ON DELETE CASCADE; 