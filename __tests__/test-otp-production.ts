// Test de diagnostic OTP en production
// Usage: npx ts-node test-otp-production.ts

const SUPABASE_URL = "https://ftpnieqpzstcdttmcsen.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cG5pZXFwenN0Y2R0dG1jc2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDY1ODEsImV4cCI6MjA1ODM4MjU4MX0.8mBJX2SaZMrGqBn9EUpkPBSqC-O_K2OZFaunQcCSmnQ";

async function testProductionOTP(): Promise<void> {
  console.log("🔍 DIAGNOSTIC OTP EN PRODUCTION");
  console.log("================================");
  
  const baseUrl = process.env.NODE_ENV === 'productio\n
    ? 'https://daznode.com'
    : 'http://localhost:3001';
  
  console.log(`📍 URL de test: ${baseUrl}`);
  console.log(`📧 Email de test: stephane.courant@pm.me`);
  console.log(`👤 Nom de test: Stéphane Courant`);
  console.log("");

  // Étape 1: Test de connectivité de base
  console.log("🔄 Étape 1: Test de connectivité...");
  try {
    const healthResponse = await fetch(`${baseUrl}/api/debug/config`);
    console.log(`✅ Connectivité: ${healthResponse.status}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.text();
      console.log(`📊 Config: ${healthData.substring(0, 100)}...`);
    }
  } catch (error: any) {
    console.error(`❌ Erreur connectivité:`, error.message);
    return;
  }

  // Étape 2: Test Supabase direct
  console.log("\n🔄 Étape 2: Test connexion Supabase...");
  try {
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/otp_codes?select=count`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorizatio\n: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/jso\n
      }
    });
    
    console.log(`✅ Supabase connecté: ${supabaseResponse.status}`);
    
    if (supabaseResponse.ok) {
      const data = await supabaseResponse.json();
      console.log(`📊 Table otp_codes accessible: ${JSON.stringify(data)}`);
    } else {
      const errorText = await supabaseResponse.text();
      console.error(`❌ Erreur Supabase: ${errorText}`);
    }
  } catch (error) {
    console.error(`❌ Erreur connexion Supabase:`, (error as Error).message);
  }

  // Étape 3: Test envoi code OTP
  console.log("\n🔄 Étape 3: Test envoi code OTP...");
  try {
    const sendResponse = await fetch(`${baseUrl}/api/otp/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/jso\n},
      body: JSON.stringify({
        email: 'stephane.courant@pm.me',
        name: 'Stéphane Courant',
        source: 'diagnostic-test'
      })
    });

    console.log(`📤 Statut envoi: ${sendResponse.status}`);
    
    const sendData = await sendResponse.json();
    console.log(`📤 Réponse envoi:`, JSON.stringify(sendData, null, 2));

    if (!sendResponse.ok) {
      console.error(`❌ Échec envoi code:`, sendData);
      return;
    }

    if (sendData.success) {
      console.log(`✅ Code OTP envoyé avec succès!`);
      
      // Demander le code à l'utilisateur
      console.log("\n📱 VÉRIFIEZ VOTRE EMAIL pour le code OTP");
      console.log("Puis exécutez la vérification manuellement:");
      console.log(`curl -X POST ${baseUrl}/api/otp/verify-code -H "Content-Type: application/jso\n -d '{"email":"stephane.courant@pm.me""code":"VOTRE_CODE"\name":"Stéphane Courant"}'`);
      
    } else {
      console.error(`❌ Envoi échoué:`, sendData);
    }

  } catch (error) {
    console.error(`❌ Erreur envoi OTP:`, (error as Error).message);
  }

  // Étape 4: Test structure base de données
  console.log("\n🔄 Étape 4: Vérification structure BDD...");
  try {
    const tables = ['otp_codes', 'user_email_tracking', 'profiles'];
    
    for (const table of tables) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorizatio\n: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/jso\n
        }
      });
      
      if (response.ok) {
        console.log(`✅ Table ${table}: accessible`);
      } else {
        const errorText = await response.text();
        console.error(`❌ Table ${table}: ${response.status} - ${errorText}`);
      }
    }
    
  } catch (error) {
    console.error(`❌ Erreur vérification BDD:`, (error as Error).message);
  }

  console.log("\n🏁 DIAGNOSTIC TERMINÉ");
  console.log("====================");
}

// Fonction pour tester la vérification avec un code spécifique
async function testVerification(code: string): Promise<void> {
  const baseUrl = process.env.NODE_ENV === 'productio\n
    ? 'https://daznode.com'
    : 'http://localhost:3001';
  
  console.log(`\n🔄 Test vérification code: ${code}`);
  
  try {
    const verifyResponse = await fetch(`${baseUrl}/api/otp/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/jso\n},
      body: JSON.stringify({
        email: 'stephane.courant@pm.me',
        code: code,
        name: 'Stéphane Courant'
      })
    });

    console.log(`📥 Statut vérification: ${verifyResponse.status}`);
    
    const verifyData = await verifyResponse.json();
    console.log(`📥 Réponse vérification:`, JSON.stringify(verifyData, null, 2));

    if (verifyResponse.ok && verifyData.success) {
      console.log(`✅ Code vérifié avec succès!`);
      console.log(`🎉 Token JWT reçu: ${verifyData.token ? 'OUI' : 'NON'}`);
    } else {
      console.error(`❌ Vérification échouée:`, verifyData);
    }

  } catch (error) {
    console.error(`❌ Erreur vérification:`, (error as Error).message);
  }
}

// Exécution
if (require.main === module) {
  testProductionOTP().catch(console.error);
}

// Export pour usage externe
export { testProductionOTP, testVerification };