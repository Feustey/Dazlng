// Test direct OTP en contournant les variables d'environnement
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ftpnieqpzstcdttmcsen.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cG5pZXFwenN0Y2R0dG1jc2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDY1ODEsImV4cCI6MjA1ODM4MjU4MX0.8mBJX2SaZMrGqBn9EUpkPBSqC-O_K2OZFaunQcCSmnQ";

// Créer le client Supabase directement
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Générer un code OTP simple
function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function testDirectOTP() {
  console.log("🔄 Test direct OTP sans API...");
  
  const email = 'stephane.courant@pm.me';
  const code = generateOTP();
  const expiresAtMs = Date.now() + (15 * 60 * 1000); // 15 minutes
  
  console.log(`📧 Email: ${email}`);
  console.log(`🔐 Code généré: ${code}`);
  
  // 1. Test de connexion Supabase
  console.log("\n1️⃣ Test connexion Supabase...");
  try {
    const { data, error } = await supabase
      .from('otp_codes')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error("❌ Erreur connexion:", error);
      return;
    }
    
    console.log("✅ Connexion Supabase OK");
  } catch (err) {
    console.error("❌ Erreur critique:", err.message);
    return;
  }
  
  // 2. Nettoyage des anciens codes
  console.log("\n2️⃣ Nettoyage codes expirés...");
  try {
    const { error: cleanupError } = await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', Date.now());
    
    if (cleanupError) {
      console.warn("⚠️ Avertissement nettoyage:", cleanupError.message);
    } else {
      console.log("✅ Nettoyage OK");
    }
  } catch (err) {
    console.warn("⚠️ Erreur nettoyage:", err.message);
  }
  
  // 3. Désactivation codes existants
  console.log("\n3️⃣ Désactivation codes existants...");
  try {
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('email', email)
      .eq('used', false);
    
    if (updateError) {
      console.warn("⚠️ Avertissement désactivation:", updateError.message);
    } else {
      console.log("✅ Désactivation OK");
    }
  } catch (err) {
    console.warn("⚠️ Erreur désactivation:", err.message);
  }
  
  // 4. Création nouveau code
  console.log("\n4️⃣ Création nouveau code...");
  try {
    const { data, error: insertError } = await supabase
      .from('otp_codes')
      .insert([{
        email: email,
        code: code,
        expires_at: expiresAtMs,
        used: false,
        attempts: 0
      }])
      .select();
    
    if (insertError) {
      console.error("❌ Erreur création code:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      return;
    }
    
    console.log("✅ Code créé avec succès:", data);
    
    // 5. Vérification du code
    console.log("\n5️⃣ Vérification du code...");
    const { data: verifyData, error: verifyError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (verifyError) {
      console.error("❌ Erreur vérification:", verifyError);
      return;
    }
    
    console.log("✅ Code vérifié:", verifyData);
    
    // 6. Test tracking email
    console.log("\n6️⃣ Test tracking email...");
    try {
      const { data: trackingData, error: trackingError } = await supabase
        .from('user_email_tracking')
        .upsert([{
          email: email,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
          total_logins: 1,
          conversion_status: 'otp_only',
          marketing_consent: false,
          source: 'diagnostic-test',
          notes: 'Test de diagnostic OTP'
        }], {
          onConflict: 'email'
        })
        .select();
      
      if (trackingError) {
        console.warn("⚠️ Avertissement tracking:", trackingError.message);
      } else {
        console.log("✅ Tracking créé:", trackingData);
      }
    } catch (err) {
      console.warn("⚠️ Erreur tracking:", err.message);
    }
    
    console.log("\n🎉 TOUS LES TESTS RÉUSSIS !");
    console.log(`📱 Code OTP valide: ${code}`);
    console.log(`⏰ Expire à: ${new Date(expiresAtMs).toLocaleString()}`);
    
  } catch (err) {
    console.error("❌ Erreur critique création:", err.message);
  }
}

// Exécution
if (require.main === module) {
  testDirectOTP().catch(console.error);
}

module.exports = { testDirectOTP }; 