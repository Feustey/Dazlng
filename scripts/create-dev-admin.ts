#!/usr/bin/env tsx
/**
 * Script pour créer un utilisateur admin temporaire en développement
 */

import { config } from 'dotenv';
import { getSupabaseAdminClient } from '@/lib/supabase';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

// Créer le client admin Supabase
const supabase = getSupabaseAdminClient();

async function createDevAdmin() {
  console.log('🔧 Création d\'un utilisateur admin temporaire pour développement...\n');

  const adminEmail = 'admin@dazno.de';
  const adminPassword = 'dev-admin-123';

  try {
    console.log('📧 Création de l\'utilisateur dans Supabase Auth...');
    
    // Créer l'utilisateur dans auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true // Confirmer directement l'email
    });

    let userId: string;
    
    if (authError) {
      if (authError.message.includes('already registered') || authError.code === 'email_exists') {
        console.log('✅ Utilisateur admin existe déjà');
        
        // Récupérer l'utilisateur existant
        const existingUser = await getUserByEmail(adminEmail);
        if (existingUser) {
          console.log('👤 Utilisateur trouvé:', existingUser.id);
          userId = existingUser.id;
          await createProfile(userId);
        } else {
          throw new Error('Utilisateur non trouvé après vérification');
        }
      } else {
        throw authError;
      }
    } else if (authUser.user) {
      console.log('✅ Utilisateur créé:', authUser.user.id);
      userId = authUser.user.id;
      await createProfile(userId);
    } else {
      throw new Error('Impossible de créer ou récupérer l\'utilisateur');
    }

    // Créer ou mettre à jour le rôle admin
    console.log('\n🔑 Attribution des permissions admin...');
    
    const { error: roleError } = await supabase
      .from('admin_roles')
      .upsert({
        user_id: userId,
        role: 'super_admin',
        granted_by: 'system',
        granted_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (roleError) {
      console.warn('⚠️ Erreur lors de l\'attribution du rôle:', roleError.message);
    } else {
      console.log('✅ Rôle super_admin attribué');
    }

    console.log('\n🎉 UTILISATEUR ADMIN CRÉÉ AVEC SUCCÈS !');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Mot de passe: ${adminPassword}`);
    console.log(`🌐 URL: http://localhost:3000/admin/crm`);
    console.log('\n🔗 Pour vous connecter :');
    console.log('1. Allez sur http://localhost:3000/auth/login');
    console.log(`2. Utilisez l'email: ${adminEmail}`);
    console.log(`3. Utilisez le mot de passe: ${adminPassword}`);
    console.log('4. Puis naviguez vers /admin/crm');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
}

async function createProfile(userId: string) {
  console.log('👤 Création du profil utilisateur...');
  
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: 'admin@dazno.de',
      nom: 'Admin',
      prenom: 'DazNode',
      email_verified: true,
      verified_at: new Date().toISOString(),
      t4g_tokens: 1000,
      settings: { role: 'admin' }
    }, {
      onConflict: 'id'
    });

  if (profileError) {
    console.warn('⚠️ Erreur lors de la création du profil:', profileError.message);
  } else {
    console.log('✅ Profil créé');
  }
}

async function getUserByEmail(email: string) {
  const { data } = await supabase.auth.admin.listUsers();
  return data.users.find(u => u.email === email);
}

if (require.main === module) {
  createDevAdmin().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
} 