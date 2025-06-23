// Test des endpoints API pour OTP, checkout et contact
// Usage: npx tsx scripts/test-api-endpoints.ts

const API_BASE = 'http://localhost:3001/api';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL';
  response?: any;
  error?: any;
  duration: number;
}

async function testEndpoint(endpoint: string, method: 'GET' | 'POST', data?: any): Promise<TestResult> {
  const start = Date.now();
  
  try {
    console.log(`🔄 Test ${method} ${endpoint}...`);
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const responseData = await response.json();
    
    const duration = Date.now() - start;
    
    if (response.ok) {
      console.log(`✅ ${method} ${endpoint} - Succès (${duration}ms)`);
      return {
        endpoint,
        method,
        status: 'PASS',
        response: responseData,
        duration
      };
    } else {
      console.log(`❌ ${method} ${endpoint} - Échec (${duration}ms)`);
      return {
        endpoint,
        method,
        status: 'FAIL',
        error: responseData,
        duration
      };
    }
  } catch (error: any) {
    const duration = Date.now() - start;
    console.log(`❌ ${method} ${endpoint} - Erreur réseau (${duration}ms)`);
    return {
      endpoint,
      method,
      status: 'FAIL',
      error: { message: error.message },
      duration
    };
  }
}

async function runApiTests(): Promise<void> {
  console.log('🚀 TEST DES ENDPOINTS API');
  console.log('=========================');
  console.log(`🌐 Base URL: ${API_BASE}`);
  console.log('');
  
  const tests = [
    // Tests OTP (avec délai pour éviter le rate limiting)
    testEndpoint('/otp/send-code', 'POST', {
      email: 'stephane.courant@pm.me'
    }),
    
    // Tests Contact (avec tous les champs requis)
    testEndpoint('/contact', 'POST', {
      firstName: 'Stéphane',
      lastName: 'Courant',
      email: 'stephane.courant@pm.me',
      subject: 'support',
      message: 'Test automatique des endpoints API avec tous les champs requis.',
      consent: true,
      website: ''
    }),
    
    // Tests Checkout/Orders (avec tous les champs requis)
    testEndpoint('/orders', 'POST', {
      user_id: '00000000-0000-0000-0000-000000000000',
      product_type: 'daznode',
      plan: 'basic',
      billing_cycle: 'monthly',
      amount: 50000,
      payment_method: 'lightning',
      customer: {
        firstName: 'Stéphane',
        lastName: 'Courant',
        email: 'stephane.courant@pm.me',
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
      metadata: {
        source: 'api-test'
      }
    }),
    
    // Tests Debug (toujours accessibles)
    testEndpoint('/debug/config', 'GET'),
    testEndpoint('/debug/supabase-status', 'GET')
  ];
  
  const results = await Promise.all(tests);
  
  console.log('\n📊 RÉSULTATS DES TESTS API');
  console.log('==========================');
  
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const totalCount = results.length;
  
  console.log(`✅ Succès: ${passCount}/${totalCount}`);
  console.log(`❌ Échecs: ${failCount}/${totalCount}`);
  console.log(`📈 Taux de succès: ${((passCount / totalCount) * 100).toFixed(1)}%`);
  
  // Détails des échecs
  const failures = results.filter(r => r.status === 'FAIL');
  if (failures.length > 0) {
    console.log('\n❌ DÉTAILS DES ÉCHECS:');
    failures.forEach(failure => {
      console.log(`\n${failure.method} ${failure.endpoint}:`);
      console.log(`  Durée: ${failure.duration}ms`);
      if (failure.error) {
        console.log(`  Erreur: ${JSON.stringify(failure.error, null, 2)}`);
      }
    });
  }
  
  // Performance
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  console.log(`\n⚡ Performance moyenne: ${avgDuration.toFixed(0)}ms`);
  
  console.log('\n🏁 Tests API terminés !');
}

runApiTests().catch(console.error);
