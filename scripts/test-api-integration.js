#!/usr/bin/env node

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:8080';
const NEXT_BASE = 'http://localhost:3000';

const TEST_PUBKEYS = {
  ACINQ: '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
  BitMEX: '026165850492521f4ac8abd9bd8088123446d126f648ca35e60f88177dc149ceb2d'
};

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`\n🧪 Testing ${name}...`);
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name} - Status: ${response.status}`);
      console.log(`📊 Response preview:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
      return data;
    } else {
      console.log(`❌ ${name} - Status: ${response.status}`);
      console.log(`🚨 Error:`, data);
      return null;
    }
  } catch (error) {
    console.log(`💥 ${name} - Network Error:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing DazNo API Integration');
  console.log('=' * 50);

  // Test 1: Health check
  await testEndpoint('Health Check', `${API_BASE}/health`);

  // Test 2: Node info
  const nodeInfo = await testEndpoint(
    'Node Info (ACINQ)', 
    `${API_BASE}/api/v1/node/${TEST_PUBKEYS.ACINQ}/info`
  );

  // Test 3: Recommendations
  const recommendations = await testEndpoint(
    'Recommendations (ACINQ)', 
    `${API_BASE}/api/v1/node/${TEST_PUBKEYS.ACINQ}/recommendations`
  );

  // Test 4: Priority actions
  await testEndpoint(
    'Priority Actions (ACINQ)', 
    `${API_BASE}/api/v1/node/${TEST_PUBKEYS.ACINQ}/priorities`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actions: ['optimize'] })
    }
  );

  // Test 5: Invalid pubkey
  await testEndpoint(
    'Invalid Pubkey Test', 
    `${API_BASE}/api/v1/node/invalid123/info`
  );

  // Test 6: Next.js Integration
  const integration = await testEndpoint(
    'Next.js Integration', 
    `${NEXT_BASE}/api/dazno/test`
  );

  console.log('\n🎯 Test Summary:');
  console.log('=' * 50);
  
  if (nodeInfo && recommendations && integration) {
    console.log('✅ All core tests passed!');
    console.log(`📈 Node: ${nodeInfo.alias} (Health: ${nodeInfo.health_score}%)`);
    console.log(`💡 Recommendations: ${recommendations.length} available`);
    console.log(`🔗 Integration: ${integration.dazno_api.status}`);
    
    // Show recommendation categories
    if (recommendations.length > 0) {
      const categories = [...new Set(recommendations.map(r => r.category))];
      console.log(`📋 Categories: ${categories.join(', ')}`);
      
      const freeRecs = recommendations.filter(r => r.free).length;
      const premiumRecs = recommendations.filter(r => !r.free).length;
      console.log(`🆓 Free: ${freeRecs} | 💎 Premium: ${premiumRecs}`);
    }
  } else {
    console.log('❌ Some tests failed. Check API connectivity.');
  }

  console.log('\n🔧 Ready for dashboard testing!');
  console.log(`Dashboard URL: ${NEXT_BASE}/user/dashboard`);
  console.log(`Test pubkeys available:`);
  Object.entries(TEST_PUBKEYS).forEach(([name, pubkey]) => {
    console.log(`  ${name}: ${pubkey}`);
  });
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, TEST_PUBKEYS }; 