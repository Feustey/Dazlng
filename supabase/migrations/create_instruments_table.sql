-- Création de la table instruments pour le test Supabase
CREATE TABLE IF NOT EXISTS instruments (
  id bigint primary key generated always as identity,
  name text not null,
  created_at timestamp with time zone default now()
);

-- Insérer des données de test
INSERT INTO instruments (name)
VALUES 
  ('violin'),
  ('viola'),
  ('cello'),
  ('piano'),
  ('guitar')
ON CONFLICT DO NOTHING;

-- Activer RLS
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "public can read instruments"
ON public.instruments
FOR SELECT TO anon
USING (true);

-- Politique pour permettre la lecture aux utilisateurs authentifiés
CREATE POLICY "authenticated can read instruments"
ON public.instruments
FOR SELECT TO authenticated
USING (true); 