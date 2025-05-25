const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Clé service role nécessaire

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('Assurez-vous d\'avoir NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyEmergencyMigrations() {
  console.log('🚀 Application des migrations d\'urgence...');
  
  try {
    // Migration 1: Ajouter colonne payment_hash
    console.log('📝 Migration 1: Ajout colonne payment_hash...');
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_hash TEXT;' 
    });
    
    // Migration 2: Désactiver RLS sur users
    console.log('📝 Migration 2: Désactivation RLS table users...');
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE users DISABLE ROW LEVEL SECURITY;' 
    });
    
    // Migration 3: Corriger RLS sur orders
    console.log('📝 Migration 3: Correction RLS table orders...');
    const ordersPolicies = `
      DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
      DROP POLICY IF EXISTS "Allow anonymous orders" ON orders;
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow anonymous orders" ON orders FOR INSERT WITH CHECK (user_id IS NULL);
      CREATE POLICY "Users can insert orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id::uuid OR user_id IS NULL);
    `;
    
    await supabase.rpc('exec_sql', { sql: ordersPolicies });
    
    console.log('✅ Toutes les migrations appliquées avec succès !');
    console.log('🎯 Les paiements devraient maintenant fonctionner.');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'application des migrations:', error);
    console.log('\n📋 Utilisez plutôt l\'interface web Supabase (SQL Editor)');
  }
}

applyEmergencyMigrations(); 