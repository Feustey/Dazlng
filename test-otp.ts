// Utilisation de l'API fetch native de Node.js 18+

async function testOTP(): Promise<void> {
  const baseUrl = 'http://localhost:3001';
  
  // Test 1: Envoyer un code OTP
  console.log('🔄 Test 1: Envoi du code OTP...');
  
  try {
    const sendResponse = await fetch(`${baseUrl}/api/otp/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'stephane.courant@pm.me',
        name: 'Stéphane Courant',
        source: 'test'
      })
    });
    
    const sendData = await sendResponse.json();
    console.log('📤 Envoi code - Statut:', sendResponse.status);
    console.log('📤 Envoi code - Réponse:', sendData);
    
    if (!sendResponse.ok) {
      console.error('❌ Échec envoi code:', sendData);
      return;
    }
    
    // Demander le code à l'utilisateur
    console.log('\n⏳ Veuillez entrer le code OTP reçu par email:');
    
    // Test 2: Vérifier le code OTP
    const code = '831385'; // Le code que vous avez reçu
    
    console.log('\n🔄 Test 2: Vérification du code OTP...');
    
    const verifyResponse = await fetch(`${baseUrl}/api/otp/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'stephane.courant@pm.me',
        code: code,
        name: 'Stéphane Courant'
      })
    });
    
    const verifyData = await verifyResponse.json();
    console.log('🔍 Vérification code - Statut:', verifyResponse.status);
    console.log('🔍 Vérification code - Réponse:', JSON.stringify(verifyData, null, 2));
    
    if (verifyResponse.ok) {
      console.log('✅ Test réussi ! Utilisateur créé/connecté avec succès');
      console.log('👤 Nom complet:', (verifyData as any).user?.name);
      console.log('👤 Prénom:', (verifyData as any).user?.prenom);
      console.log('👤 Nom:', (verifyData as any).user?.nom);
    } else {
      console.error('❌ Échec vérification code:', verifyData);
      
      // Essayons de voir les détails de l'erreur
      if ((verifyData as any).details) {
        console.log('🔍 Détails de l\'erreur:', (verifyData as any).details);
      }
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', (error as Error).message);
  }
}

// Lancer le test
testOTP().catch(console.error); 