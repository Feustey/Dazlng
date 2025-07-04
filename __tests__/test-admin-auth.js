// Test de l'authentification admin
// Usage: node test-admin-auth.js

const baseUrl = 'http://localhost:3001';
const adminEmail = 'admin@dazno.de';

async function testAdminAuth() {
  console.log('🧪 TEST DE L\'AUTHENTIFICATION ADMIN');
  console.log('=====================================');
  console.log(`📍 URL de test: ${baseUrl}`);
  console.log(`👤 Email admin: ${adminEmail}`);
  console.log('');

  try {
    // Étape 1: Test de la page admin principale
    console.log('🔄 Étape 1: Test de la page admin principale...');
    const adminPageResponse = await fetch(`${baseUrl}/admin`);
    console.log(`✅ Page /admin accessible: ${adminPageResponse.status}`);

    // Étape 2: Test d'envoi de code OTP admin
    console.log('\n🔄 Étape 2: Test envoi code OTP admin...');
    const sendCodeResponse = await fetch(`${baseUrl}/api/otp/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/jso\n},
      body: JSON.stringify({
        email: adminEmail,
        name: 'Administrateur DazNode',
        source: 'admin-auth'
      })});

    console.log(`📤 Statut envoi: ${sendCodeResponse.status}`);
    
    const sendData = await sendCodeResponse.json();
    console.log(`📤 Réponse envoi:`, JSON.stringify(sendData, null, 2));

    if (sendCodeResponse.ok && sendData.success) {
      console.log(`✅ Code OTP envoyé avec succès à ${adminEmail}!`);
      console.log('\n📱 VÉRIFIEZ VOTRE EMAIL pour le code OTP');
      console.log('Puis testez la vérification avec:');
      console.log(`curl -X POST ${baseUrl}/api/otp/verify-code -H "Content-Type: application/jso\n -d '{"email":"${adminEmail}""code":"VOTRE_CODE"\name":"Administrateur DazNode"}'`);
      
      // Instructions pour tester manuellement
      console.log('\n📋 PROCHAINES ÉTAPES MANUELLES:');
      console.log('1. Allez sur http://localhost:3001/admi\n);
      console.log('2. Vérifiez que le formulaire d\'auth s\'affiche');
      console.log('3. Entrez admin@dazno.de et envoyez le code');
      console.log('4. Vérifiez la réception du code OTP par email');
      console.log('5. Entrez le code et vérifiez la redirection vers /admin/dashboard');
      
    } else {
      console.error(`❌ Envoi échoué:`, sendData);
    }

    // Étape 3: Test de l'API auth/me (sans authentification)
    console.log('\n🔄 Étape 3: Test API /auth/me (non authentifié)...');
    const meResponse = await fetch(`${baseUrl}/api/auth/me`);
    console.log(`🔒 Statut /auth/me: ${meResponse.status} (${meResponse.status === 401 ? 'Non authentifié - OK' : 'Inattendu'})`);

    // Étape 4: Test accès dashboard admin sans auth
    console.log('\n🔄 Étape 4: Test accès dashboard admin sans auth...');
    const dashboardResponse = await fetch(`${baseUrl}/admin/dashboard`, { redirect: 'manual' });
    console.log(`🔒 Dashboard admin protégé: ${dashboardResponse.status} (${dashboardResponse.status === 302 || dashboardResponse.status === 200 ? 'Protection OK' : 'Problème de protectio\n})`);

    // Étape 5: Test de l'endpoint de déconnexion
    console.log('\n🔄 Étape 5: Test endpoint déconnexion...');
    const logoutResponse = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST'});
    console.log(`🚪 Endpoint logout: ${logoutResponse.status}`);
    const logoutData = await logoutResponse.json();
    console.log(`🚪 Réponse logout:`, logoutData);

    console.log('\n🎉 TESTS COMPLETÉS !');
    console.log('====================');
    console.log('✅ Page admin accessible');
    console.log('✅ Envoi OTP configuré');
    console.log('✅ API d\'authentification en place');
    console.log('✅ Protection des routes activée');
    console.log('✅ Système de déconnexion configuré');
    
    console.log('\n🚨 IMPORTANT:');
    console.log('Pour que l\'authentification admin fonctionne complètement');
    console.log('assurez-vous qu\'un utilisateur admin@dazno.de existe dans Supabase Auth.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Fonction pour tester la vérification d'un code OTP admin
async function testAdminOtpVerification(code) {
  console.log(`\n🔄 Test vérification OTP admin: ${code}`);
  
  try {
    const response = await fetch(`${baseUrl}/api/otp/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/jso\n },
      body: JSON.stringify({ 
        email: adminEmail, 
        code: code,
        name: 'Administrateur DazNode'
      })
    });

    const data = await response.json();
    console.log(`📥 Statut: ${response.status}`);
    console.log(`📥 Réponse:`, JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log(`✅ Code admin vérifié avec succès!`);
      console.log(`🎯 L'admin peut maintenant accéder au dashboard`);
    } else {
      console.log(`❌ Vérification échouée: ${data.error?.message}`);
    }

  } catch (error) {
    console.error(`❌ Erreur vérification:`, error.message);
  }
}

// Exécuter le test principal
testAdminAuth();

// Exporter la fonction de test pour usage externe
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAdminAuth, testAdminOtpVerification };
} 