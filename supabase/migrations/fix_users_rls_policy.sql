-- Supprimer les politiques RLS existantes si elles existent pour la table users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Allow public registration" ON users;
DROP POLICY IF EXISTS "Enable all operations for service role" ON users;

-- Pour le moment, désactiver RLS sur la table users pour éviter les problèmes
-- Cela permet à l'application de fonctionner pendant que nous testons'
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Alternative : Si vous voulez activer RLS plus tard, utilisez ces politiques :
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique très permissive pour permettre toutes les opérations (temporaire)
-- CREATE POLICY "Enable all operations for service role" ON users
--   FOR ALL 
--   USING (true) 
--   WITH CHECK (true);

-- Permettre aux administrateurs de voir tous les utilisateurs
CREATE POLICY "Admins can view all users" ON users;
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users;
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@dazno.de', 'contact@dazno.de')
    )
  );

-- Permettre aux administrateurs de modifier tous les utilisateurs
CREATE POLICY "Admins can update all users" ON users;
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users;
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@dazno.de', 'contact@dazno.de')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users;
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@dazno.de', 'contact@dazno.de')
    )
  ); 