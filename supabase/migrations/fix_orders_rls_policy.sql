-- Supprimer les politiques RLS existantes si elles existent
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous orders" ON orders;

-- Activer RLS sur la table orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs authentifiés de créer leurs propres commandes
CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id::uuid OR user_id IS NULL);

-- Politique pour permettre aux utilisateurs authentifiés de voir leurs propres commandes
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT 
  USING (auth.uid() = user_id::uuid OR user_id IS NULL);

-- Politique pour permettre les commandes anonymes (pour les invités)
CREATE POLICY "Allow anonymous orders" ON orders
  FOR INSERT 
  WITH CHECK (user_id IS NULL);

-- Politique pour permettre la lecture des commandes anonymes
CREATE POLICY "Allow read anonymous orders" ON orders
  FOR SELECT 
  USING (user_id IS NULL);

-- Permettre aux administrateurs de voir toutes les commandes
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@dazno.de', 'contact@dazno.de')
    )
  );

-- Permettre aux administrateurs de modifier toutes les commandes
CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@dazno.de', 'contact@dazno.de')
    )
  ); 