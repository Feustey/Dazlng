// Test simplifié des endpoints API
// Usage: npx tsx scripts/test-simple.ts

const API_BASE = 'http://localhost:3001/api';

async function testEndpoint(endpoint: string, method: 'GET' | 'POST', data?: any) {
  try {
    console.log(`🔄 Test ${method} ${endpoint}...`);
    
    const config: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const responseData = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${method} ${endpoint} - Succès`);
      return { status: 'PASS', data: responseData };
    } else {
      console.log(`❌ ${method} ${endpoint} - Échec:`, responseData.error?.message || responseData.error);
      return { status: 'FAIL', error: responseData };
    }
  } catch (error: any) {
    console.log(`❌ ${method} ${endpoint} - Erreur réseau:`, error.message);
    return { status: 'FAIL', error: { message: error.message } };
  }
}

async function runTests() {
  console.log('🚀 TEST SIMPLIFIÉ DES ENDPOINTS');
  console.log('===============================');
  
  const results = [];
  
  // Test 1: Debug config (toujours accessible)
  results.push(await testEndpoint('/debug/config', 'GET'));
  
  // Test 2: Debug supabase status (toujours accessible)
  results.push(await testEndpoint('/debug/supabase-status', 'GET'));
  
  // Test 3: OTP (peut avoir rate limiting)
  results.push(await testEndpoint('/otp/send-code', 'POST', {
    email: 'stephane.courant@pm.me'
  }));
  
  // Test 4: Contact (sans email pour éviter les erreurs de config)
  results.push(await testEndpoint('/contact', 'POST', {
    firstName: 'Test',
    lastName: 'Test',
    email: 'test@test.com',
    interest: 'support',
    message: 'Test automatique'
  }));
  
  // Test 5: Orders (avec UUID valide)
  results.push(await testEndpoint('/orders', 'POST', {
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    product_type: 'daznode',
    plan: 'basic',
    billing_cycle: 'monthly',
    amount: 50000,
    payment_method: 'lightning',
    customer: {
      firstName: 'Test',
      lastName: 'Test',
      email: 'test@test.com',
      pubkey: '03eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619',
      address: '123 Rue de Test',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    product: {
      name: 'DazNode Basic',
      quantity: 1,
      priceSats: 50000
    },
    metadata: { source: 'test' }
  }));
  
  // Résultats
  const passCount = results.filter(r => r.status === 'PASS').length;
  const totalCount = results.length;
  
  console.log('\n📊 RÉSULTATS:');
  console.log(`✅ Succès: ${passCount}/${totalCount}`);
  console.log(`📈 Taux: ${((passCount / totalCount) * 100).toFixed(1)}%`);
  
  if (passCount === totalCount) {
    console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
  } else {
    console.log('⚠️ Certains tests ont échoué, mais c\'est normal si les services externes ne sont pas configurés.');
  }
}

runTests().catch(console.error);
