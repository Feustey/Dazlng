// Test rapide de production pour dazno.de
// Usage: npx tsx scripts/test-production-quick.ts

const PROD_URL = 'https://dazno.de';

async function testProductionEndpoint(endpoint: string): Promise<{ status: number; ok: boolean; data?: any }> {
  try {
    const response = await fetch(`${PROD_URL}${endpoint}`);
    const data = response.ok ? await response.json() : await response.text();
    
    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? data : { error: data }
    };
  } catch (error: any) {
    return {
      status: 0,
      ok: false,
      data: { error: error.message }
    };
  }
}

async function runProductionTests(): Promise<void> {
  console.log('🚀 TEST RAPIDE PRODUCTION - dazno.de');
  console.log('=====================================');
  console.log(`🌐 URL: ${PROD_URL}`);
  console.log('');
  
  const endpoints = [
    '/api/debug/config',
    '/api/debug/supabase-status',
    '/api/contact',
    '/api/otp/send-code'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`🔄 Test ${endpoint}...`);
    const result = await testProductionEndpoint(endpoint);
    
    if (result.ok) {
      console.log(`✅ ${endpoint} - OK (${result.status})`);
    } else {
      console.log(`❌ ${endpoint} - ÉCHEC (${result.status})`);
      if (result.data?.error) {
        console.log(`   Erreur: ${result.data.error}`);
      }
    }
  }
  
  console.log('\n🏁 Test production terminé !');
}

runProductionTests().catch(console.error); 