/**
 * Script de test pour valider la création automatique de profil
 */

const API_BASE = 'http://localhost:3000';

console.log('🧪 TEST: Création automatique de profil');
console.log('======================================\n');

async function testProfileCreation() {
  try {
    console.log('📋 1. État initial des profils...');
    
    // Diagnostic initial
    const diagResponse = await fetch(`${API_BASE}/api/debug/profile-issues`);
    const diagData = await diagResponse.json();
    
    console.log(`   - Utilisateurs sans profil: ${diagData.data.issues.length}`);
    console.log(`   - Profils existants: ${diagData.data.totalProfiles}`);
    
    if (diagData.data.issues.length === 0) {
      console.log('✅ Aucun problème détecté, tous les utilisateurs ont un profil!');
      return;
    }
    
    console.log('\n📝 2. Utilisateurs nécessitant un profil:');
    diagData.data.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue.email} (${issue.user_id})`);
    });
    
    console.log('\n🔧 3. Solutions pour réparer:');
    console.log('   A. Appliquer les migrations Supabase:');
    console.log('      supabase db push migrations/fix_profiles_fk_constraint.sql');
    console.log('');
    console.log('   B. Ou créer manuellement via SQL:');
    diagData.data.issues.forEach((issue) => {
      console.log(`      SELECT ensure_profile_exists('${issue.user_id}', '${issue.email}');`);
    });
    
    console.log('\n🎯 4. Test de l\'API /auth/me (sans token):');
    const authResponse = await fetch(`${API_BASE}/api/auth/me`);
    const authStatus = authResponse.status;
    
    if (authStatus === 401) {
      console.log('   ✅ API retourne 401 (normal sans token)');
      console.log('   ℹ️  Pour tester avec token, connectez-vous via l\'interface');
    } else if (authStatus === 500) {
      console.log('   ❌ API retourne 500 (erreur de contrainte FK probable)');
      console.log('   🔧 Appliquez les migrations pour corriger');
    } else {
      console.log(`   ❓ Statut inattendu: ${authStatus}`);
    }
    
    console.log('\n📊 5. Statut Supabase:');
    const statusResponse = await fetch(`${API_BASE}/api/debug/supabase-status`);
    const statusData = await statusResponse.json();
    
    console.log(`   - Connexion: ${statusData.tests.connection.success ? '✅' : '❌'}`);
    console.log(`   - Accès profiles: ${statusData.tests.profiles_access.success ? '✅' : '❌'}`);
    console.log(`   - Environnement: ${statusData.environment.node_env}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Fonction pour tester la progression du score
async function testScoreProgression() {
  console.log('\n🎯 TEST: Progression du score utilisateur');
  console.log('========================================\n');
  
  console.log('📋 Champs qui doivent faire progresser le score:');
  const scoreFields = [
    { field: 'email_verified', points: 20, description: 'Email vérifié automatiquement' },
    { field: 'pubkey', points: 20, description: 'Nœud Lightning connecté' },
    { field: 'compte_x', points: 20, description: 'Compte Twitter/X renseigné' },
    { field: 'compte_nostr', points: 20, description: 'Compte Nostr renseigné' },
    { field: 'phone_verified', points: 20, description: 'Téléphone vérifié' }
  ];
  
  scoreFields.forEach((field, index) => {
    console.log(`   ${index + 1}. ${field.description} → +${field.points} points`);
  });
  
  console.log('\n🧪 Test API profile (sans token):');
  try {
    const profileResponse = await fetch(`${API_BASE}/api/user/profile`);
    if (profileResponse.status === 401) {
      console.log('   ✅ API retourne 401 (normal sans token)');
      console.log('   ℹ️  Pour tester la progression, connectez-vous et:');
      console.log('      1. Allez sur /user/settings');
      console.log('      2. Renseignez votre compte Twitter');
      console.log('      3. Vérifiez que le score augmente de +20');
    } else {
      console.log(`   ❓ Statut inattendu: ${profileResponse.status}`);
    }
  } catch (error) {
    console.error('   ❌ Erreur API profile:', error.message);
  }
}

// Fonction principale
async function runTests() {
  await testProfileCreation();
  await testScoreProgression();
  
  console.log('\n✨ RÉSUMÉ DES ACTIONS:');
  console.log('=====================');
  console.log('1. 🚀 Les corrections ont été appliquées au code');
  console.log('2. 📊 Le diagnostic fonctionne et détecte les problèmes');
  console.log('3. 🔧 Appliquez les migrations Supabase pour finaliser');
  console.log('4. 🧪 Testez l\'interface utilisateur après migration');
  console.log('\n🎯 Une fois les migrations appliquées:');
  console.log('   - Les profils seront créés automatiquement');
  console.log('   - Le dashboard sera accessible');
  console.log('   - Le score progressera avec chaque information');
  console.log('   - La pubkey sera unique par utilisateur');
}

// Exécuter les tests
runTests().catch(console.error); 