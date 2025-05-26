// Test de diagnostic OTP en production
// Usage: node test-otp-prod.js

const SUPABASE_URL = "https://ftpnieqpzstcdttmcsen.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cG5pZXFwenN0Y2R0dG1jc2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDY1ODEsImV4cCI6MjA1ODM4MjU4MX0.8mBJX2SaZMrGqBn9EUpkPBSqC-O_K2OZFaunQcCSmnQ";

async function testProductionOTP() {
  console.log("🔍 DIAGNOSTIC OTP EN PRODUCTION");
  console.log("================================");
  
  const baseUrl = 'http://localhost:3001';
  
  console.log(`📍 URL de test: ${baseUrl}`);
  console.log(`📧 Email de test: stephane.courant@pm.me`);
  console.log(`👤 Nom de test: Stéphane Courant`);
  console.log("");

  // Étape 1: Test Supabase direct
  console.log("🔄 Étape 1: Test connexion Supabase directe...");
  try {
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/otp_codes?select=count&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Supabase statut: ${supabaseResponse.status}`);
    
    if (supabaseResponse.ok) {
      const data = await supabaseResponse.json();
      console.log(`📊 Table otp_codes accessible:`, data);
    } else {
      const errorText = await supabaseResponse.text();
      console.error(`❌ Erreur Supabase: ${errorText}`);
    }
  } catch (error) {
    console.error(`❌ Erreur connexion Supabase:`, error.message);
  }

  // Étape 2: Vérification des tables nécessaires
  console.log("\n🔄 Étape 2: Vérification structure BDD...");
  const tables = ['otp_codes', 'user_email_tracking', 'profiles'];
  
  for (const table of tables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Table ${table}: accessible (${data.length} éléments testés)`);
      } else {
        const errorText = await response.text();
        console.error(`❌ Table ${table}: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error(`❌ Erreur table ${table}:`, error.message);
    }
  }

  // Étape 3: Test envoi code OTP via API locale
  console.log("\n🔄 Étape 3: Test envoi code OTP...");
  try {
    const sendResponse = await fetch(`${baseUrl}/api/otp/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'stephane.courant@pm.me',
        name: 'Stéphane Courant',
        source: 'diagnostic-test'
      })
    });

    console.log(`📤 Statut envoi: ${sendResponse.status}`);
    
    const sendData = await sendResponse.json();
    console.log(`📤 Réponse envoi:`, JSON.stringify(sendData, null, 2));

    if (sendResponse.ok && sendData.success) {
      console.log(`✅ Code OTP envoyé avec succès!`);
      console.log(`\n📱 VÉRIFIEZ VOTRE EMAIL pour le code OTP`);
      console.log(`Puis testez avec: node test-verify.js VOTRE_CODE`);
    } else {
      console.error(`❌ Envoi échoué:`, sendData);
    }

  } catch (error) {
    console.error(`❌ Erreur envoi OTP:`, error.message);
  }

  console.log("\n🏁 DIAGNOSTIC TERMINÉ");
}

// Fonction pour tester la vérification
async function testVerification(code) {
  if (!code) {
    console.log("Usage: node test-verify.js CODE_OTP");
    return;
  }
  
  const baseUrl = 'http://localhost:3001';
  console.log(`\n🔄 Test vérification code: ${code}`);
  
  try {
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

    console.log(`📥 Statut vérification: ${verifyResponse.status}`);
    
    const verifyData = await verifyResponse.json();
    console.log(`📥 Réponse vérification:`, JSON.stringify(verifyData, null, 2));

    if (verifyResponse.ok && verifyData.success) {
      console.log(`✅ Code vérifié avec succès!`);
      console.log(`🎉 Token JWT reçu: ${verifyData.token ? 'OUI' : 'NON'}`);
      console.log(`👤 Utilisateur: ${verifyData.user ? JSON.stringify(verifyData.user, null, 2) : 'NON'}`);
    } else {
      console.error(`❌ Vérification échouée:`, verifyData);
    }

  } catch (error) {
    console.error(`❌ Erreur vérification:`, error.message);
  }
}

// Exécution conditionnelle
if (require.main === module) {
  if (process.argv[2] === 'verify' && process.argv[3]) {
    testVerification(process.argv[3]).catch(console.error);
  } else {
    testProductionOTP().catch(console.error);
  }
}

module.exports = { testProductionOTP, testVerification }; 