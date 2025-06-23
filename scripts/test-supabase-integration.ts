// Test complet des appels Supabase pour OTP, checkout et contact
// Usage: npx tsx scripts/test-supabase-integration.ts

import { createTestClient, TestResult, TEST_EMAIL, TEST_NAME, TEST_PUBKEY } from '@/lib/test-utils/supabase-test-client';

// Créer le client Supabase avec la nouvelle méthode
const supabase = createTestClient();

async function testSupabaseConnection(): Promise<TestResult> {
  const start = Date.now();
  
  try {
    console.log('🔄 Test connexion Supabase...');
    
    // Test de connexion basique
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      return {
        name: 'Connexion Supabase',
        status: 'FAIL',
        message: `Erreur de connexion: ${error.message}`,
        details: error,
        duration: Date.now() - start
      };
    }
    
    return {
      name: 'Connexion Supabase',
      status: 'PASS',
      message: 'Connexion réussie',
      details: data,
      duration: Date.now() - start
    };
  } catch (error: any) {
    return {
      name: 'Connexion Supabase',
      status: 'FAIL',
      message: `Erreur critique: ${error.message}`,
      details: error,
      duration: Date.now() - start
    };
  }
}

async function testOTPSystem(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  console.log('\n🔄 Test système OTP...');
  
  // Test 1: Vérification table otp_codes
  try {
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .limit(1);
    
    if (error) {
      results.push({
        name: 'Table OTP Codes',
        status: 'FAIL',
        message: `Table inaccessible: ${error.message}`,
        details: error
      });
    } else {
      results.push({
        name: 'Table OTP Codes',
        status: 'PASS',
        message: 'Table accessible',
        details: { count: data?.length || 0 }
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Table OTP Codes',
      status: 'FAIL',
      message: `Erreur: ${error.message}`,
      details: error
    });
  }
  
  // Test 2: Test envoi OTP via API
  try {
    await new Promise(resolve => setTimeout(resolve, 60000));
    const response = await fetch('http://localhost:3001/api/otp/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      results.push({
        name: 'Envoi OTP',
        status: 'PASS',
        message: 'Code OTP envoyé avec succès',
        details: data
      });
    } else {
      results.push({
        name: 'Envoi OTP',
        status: 'FAIL',
        message: `Échec envoi: ${data.error?.message || 'Erreur inconnue'}`,
        details: data
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Envoi OTP',
      status: 'FAIL',
      message: `Erreur réseau: ${error.message}`,
      details: error
    });
  }
  
  // Test 3: Vérification code OTP en base
  try {
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', TEST_EMAIL)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      results.push({
        name: 'Vérification OTP Base',
        status: 'WARN',
        message: `Erreur vérification: ${error.message}`,
        details: error
      });
    } else if (data && data.length > 0) {
      results.push({
        name: 'Vérification OTP Base',
        status: 'PASS',
        message: 'Code OTP trouvé en base',
        details: { code: data[0].code, expires_at: data[0].expires_at }
      });
    } else {
      results.push({
        name: 'Vérification OTP Base',
        status: 'WARN',
        message: 'Aucun code OTP trouvé',
        details: null
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Vérification OTP Base',
      status: 'WARN',
      message: `Erreur: ${error.message}`,
      details: error
    });
  }
  
  return results;
}

async function testContactSystem(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  console.log('\n🔄 Test système Contact...');
  
  // Test 1: Vérification table contacts
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);
    
    if (error) {
      results.push({
        name: 'Table Contacts',
        status: 'FAIL',
        message: `Table inaccessible: ${error.message}`,
        details: error
      });
    } else {
      results.push({
        name: 'Table Contacts',
        status: 'PASS',
        message: 'Table accessible',
        details: { count: data?.length || 0 }
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Table Contacts',
      status: 'FAIL',
      message: `Erreur: ${error.message}`,
      details: error
    });
  }
  
  // Test 2: Test envoi contact via API
  try {
    const contactData = {
      firstName: TEST_NAME.split(' ')[0],
      lastName: TEST_NAME.split(' ')[1],
      email: TEST_EMAIL,
      subject: 'Test intégration Supabase',
      message: 'Ceci est un test automatique du système de contact.'
    };
    
    await new Promise(resolve => setTimeout(resolve, 60000));
    const response = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      results.push({
        name: 'Envoi Contact',
        status: 'PASS',
        message: 'Contact envoyé avec succès',
        details: { id: data.data?.id }
      });
    } else {
      results.push({
        name: 'Envoi Contact',
        status: 'FAIL',
        message: `Échec envoi: ${data.error?.message || 'Erreur inconnue'}`,
        details: data
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Envoi Contact',
      status: 'FAIL',
      message: `Erreur réseau: ${error.message}`,
      details: error
    });
  }
  
  // Test 3: Vérification contact en base
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('email', TEST_EMAIL)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      results.push({
        name: 'Vérification Contact Base',
        status: 'WARN',
        message: `Erreur vérification: ${error.message}`,
        details: error
      });
    } else if (data && data.length > 0) {
      results.push({
        name: 'Vérification Contact Base',
        status: 'PASS',
        message: 'Contact trouvé en base',
        details: { id: data[0].id, status: data[0].status }
      });
    } else {
      results.push({
        name: 'Vérification Contact Base',
        status: 'WARN',
        message: 'Aucun contact trouvé',
        details: null
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Vérification Contact Base',
      status: 'WARN',
      message: `Erreur: ${error.message}`,
      details: error
    });
  }
  
  return results;
}

async function testCheckoutSystem(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  console.log('\n🔄 Test système Checkout...');
  
  // Test 1: Vérification table orders
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (error) {
      results.push({
        name: 'Table Orders',
        status: 'FAIL',
        message: `Table inaccessible: ${error.message}`,
        details: error
      });
    } else {
      results.push({
        name: 'Table Orders',
        status: 'PASS',
        message: 'Table accessible',
        details: { count: data?.length || 0 }
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Table Orders',
      status: 'FAIL',
      message: `Erreur: ${error.message}`,
      details: error
    });
  }
  
  // Test 2: Vérification table profiles
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      results.push({
        name: 'Table Profiles',
        status: 'FAIL',
        message: `Table inaccessible: ${error.message}`,
        details: error
      });
    } else {
      results.push({
        name: 'Table Profiles',
        status: 'PASS',
        message: 'Table accessible',
        details: { count: data?.length || 0 }
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Table Profiles',
      status: 'FAIL',
      message: `Erreur: ${error.message}`,
      details: error
    });
  }
  
  // Test 3: Test création commande (sans authentification)
  try {
    const orderData = {
      user_id: null, // Commande anonyme
      product_type: 'daznode',
      plan: 'basic',
      billing_cycle: 'monthly',
      amount: 50000, // 50k sats
      payment_method: 'lightning',
      customer: {
        firstName: TEST_NAME.split(' ')[0],
        lastName: TEST_NAME.split(' ')[1],
        email: TEST_EMAIL,
        pubkey: TEST_PUBKEY
      },
      product: {
        name: 'DazNode Basic',
        quantity: 1,
        priceSats: 50000
      },
      metadata: {
        source: 'test-integration'
      }
    };
    
    await new Promise(resolve => setTimeout(resolve, 60000));
    const response = await fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      results.push({
        name: 'Création Commande',
        status: 'PASS',
        message: 'Commande créée avec succès',
        details: { id: data.data?.id, amount: data.data?.amount }
      });
    } else {
      results.push({
        name: 'Création Commande',
        status: 'FAIL',
        message: `Échec création: ${data.error?.message || 'Erreur inconnue'}`,
        details: data
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Création Commande',
      status: 'FAIL',
      message: `Erreur réseau: ${error.message}`,
      details: error
    });
  }
  
  // Test 4: Vérification commande en base
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('metadata->>source', 'test-integration')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      results.push({
        name: 'Vérification Commande Base',
        status: 'WARN',
        message: `Erreur vérification: ${error.message}`,
        details: error
      });
    } else if (data && data.length > 0) {
      results.push({
        name: 'Vérification Commande Base',
        status: 'PASS',
        message: 'Commande trouvée en base',
        details: { id: data[0].id, status: data[0].payment_status }
      });
    } else {
      results.push({
        name: 'Vérification Commande Base',
        status: 'WARN',
        message: 'Aucune commande trouvée',
        details: null
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Vérification Commande Base',
      status: 'WARN',
      message: `Erreur: ${error.message}`,
      details: error
    });
  }
  
  return results;
}

async function testDatabaseStructure(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  console.log('\n🔄 Test structure base de données...');
  
  // Tables à vérifier
  const tables = [
    'profiles',
    'orders', 
    'contacts',
    'otp_codes',
    'subscriptions',
    'payments',
    'prospects',
    'user_email_tracking'
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        results.push({
          name: `Table ${table}`,
          status: 'FAIL',
          message: `Inaccessible: ${error.message}`,
          details: error
        });
      } else {
        results.push({
          name: `Table ${table}`,
          status: 'PASS',
          message: 'Accessible',
          details: { count: data?.length || 0 }
        });
      }
    } catch (error: any) {
      results.push({
        name: `Table ${table}`,
        status: 'FAIL',
        message: `Erreur: ${error.message}`,
        details: error
      });
    }
  }
  
  return results;
}

async function runAllTests(): Promise<void> {
  console.log('🚀 TEST COMPLET INTÉGRATION SUPABASE');
  console.log('====================================');
  console.log(`📧 Email de test: ${TEST_EMAIL}`);
  console.log(`👤 Nom de test: ${TEST_NAME}`);
  console.log(`🔑 Pubkey de test: ${TEST_PUBKEY}`);
  console.log(`🌐 URL API: http://localhost:3001`);
  console.log('');
  
  const allResults: TestResult[] = [];
  
  // Test 1: Connexion Supabase
  const connectionResult = await testSupabaseConnection();
  allResults.push(connectionResult);
  
  // Test 2: Structure base de données
  const structureResults = await testDatabaseStructure();
  allResults.push(...structureResults);
  
  // Test 3: Système OTP
  const otpResults = await testOTPSystem();
  allResults.push(...otpResults);
  
  // Test 4: Système Contact
  const contactResults = await testContactSystem();
  allResults.push(...contactResults);
  
  // Test 5: Système Checkout
  const checkoutResults = await testCheckoutSystem();
  allResults.push(...checkoutResults);
  
  // Résultats finaux
  console.log('\n📊 RÉSULTATS FINAUX');
  console.log('===================');
  
  const passCount = allResults.filter(r => r.status === 'PASS').length;
  const failCount = allResults.filter(r => r.status === 'FAIL').length;
  const warnCount = allResults.filter(r => r.status === 'WARN').length;
  const totalCount = allResults.length;
  
  console.log(`✅ Succès: ${passCount}/${totalCount}`);
  console.log(`❌ Échecs: ${failCount}/${totalCount}`);
  console.log(`⚠️ Avertissements: ${warnCount}/${totalCount}`);
  console.log(`📈 Taux de succès: ${((passCount / totalCount) * 100).toFixed(1)}%`);
  
  // Détails des échecs
  const failures = allResults.filter(r => r.status === 'FAIL');
  if (failures.length > 0) {
    console.log('\n❌ DÉTAILS DES ÉCHECS:');
    failures.forEach(failure => {
      console.log(`\n${failure.name}:`);
      console.log(`  Message: ${failure.message}`);
      if (failure.details) {
        console.log(`  Détails: ${JSON.stringify(failure.details, null, 2)}`);
      }
    });
  }
  
  // Détails des avertissements
  const warnings = allResults.filter(r => r.status === 'WARN');
  if (warnings.length > 0) {
    console.log('\n⚠️ DÉTAILS DES AVERTISSEMENTS:');
    warnings.forEach(warning => {
      console.log(`\n${warning.name}:`);
      console.log(`  Message: ${warning.message}`);
      if (warning.details) {
        console.log(`  Détails: ${JSON.stringify(warning.details, null, 2)}`);
      }
    });
  }
  
  // Recommandations
  console.log('\n💡 RECOMMANDATIONS:');
  if (failCount === 0) {
    console.log('✅ Tous les tests critiques sont passés !');
  } else {
    console.log('🔧 Actions recommandées:');
    failures.forEach(failure => {
      console.log(`  - Corriger: ${failure.name}`);
    });
  }
  
  if (warnCount > 0) {
    console.log('📝 Points d\'attention:');
    warnings.forEach(warning => {
      console.log(`  - Vérifier: ${warning.name}`);
    });
  }
  
  console.log('\n🏁 Test terminé !');
}

// Exécution des tests
runAllTests().catch(console.error); 