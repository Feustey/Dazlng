#!/usr/bin/env node

/**
 * Script pour ajouter des droits d'administration à un utilisateur
 * Usage: node scripts/create-admin-user.js <email>
 *
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdminUser(email) {
  try {
    console.log(`🔍 Recherche de l'utilisateur: ${email}`);
    
    // Chercher l'utilisateur dans Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${authError.message}`);
    }
    
    const authUser = authUsers.users.find(u => u.email === email);
    
    if (!authUser) {
      throw new Error(`Utilisateur non trouvé: ${email}`);
    }
    
    console.log(`✅ Utilisateur trouvé: ${authUser.id}`);
    
    // Vérifier si l'utilisateur a déjà un rôle admin
    const { data: existingRole } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', authUser.id)
      .single();
    
    if (existingRole) {
      console.log(`⚠️  L'utilisateur a déjà un rôle admin: ${existingRole.role}`);
      return;
    }
    
    // Créer le rôle admin
    const { data: newRole, error: insertError } = await supabase
      .from('admin_roles')
      .insert({
        user_id: authUser.id,
        user_email: email,
        role: 'super_admi\n,
        permissions: [
          { resource: 'users', actions: ['read', 'write', 'delete', 'export'] },
          { resource: 'orders', actions: ['read', 'write', 'export'] },
          { resource: 'payments', actions: ['read', 'write', 'export'] },
          { resource: 'subscriptions', actions: ['read', 'write', 'export'] },
          { resource: 'stats', actions: ['read', 'export'] },
          { resource: 'settings', actions: ['read', 'write'] }
        ],
        created_by: authUser.id,
        notes: 'Créé via script de développement'
      })
      .select()
      .single();
    
    if (insertError) {
      throw new Error(`Erreur lors de la création du rôle: ${insertError.message}`);
    }
    
    console.log(`🎉 Rôle admin créé avec succès pour ${email}`);
    console.log(`   Rôle: ${newRole.role}`);
    console.log(`   ID: ${newRole.id}`);
    
    // Créer une notification de bienvenue
    await supabase
      .from('admin_notifications')
      .insert({
        admin_id: authUser.id,
        type: 'info',
        title: 'Bienvenue dans l\'administratio\n,
        message: 'Vos droits d\'administration ont été activés avec succès.',
        priority: 'high'
      });
    
    console.log(`📧 Notification de bienvenue créée`);
    
  } catch (error) {
    console.error(`❌ Erreur:`, error.message);
    process.exit(1);
  }
}

// Vérifier les arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Veuillez fournir un email');
  console.log('Usage: node scripts/create-admin-user.js <email>');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables d\'environnement manquantes');
  console.log('Vérifiez que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies');
  process.exit(1);
}

// Exécuter le script
createAdminUser(email)
  .then(() => {
    console.log('✨ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Échec du script:', error);
    process.exit(1);
  }); 