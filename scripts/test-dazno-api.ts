import axios from 'axios';
import { config } from 'dotenv';
import { HttpsProxyAgent } from 'https-proxy-agent';

config(); // Charge les variables d'environnement

const API_BASE_URL = 'https://api.dazno.de/v1';
const TEST_PUBKEY = '03eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619';

// Configuration du proxy local
const proxyUrl = process.env.HTTP_PROXY || 'http://localhost:8080';
const proxyAgent = new HttpsProxyAgent(proxyUrl);

interface TestResult {
  endpoint: string;
  status: 'success' | 'error';
  response?: any;
  error?: any;
}

async function testEndpoint(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any): Promise<TestResult> {
  try {
    console.log(`🔄 Test de ${endpoint}...`);
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      httpsAgent: proxyAgent,
      headers: {
        'Authorization': `Bearer ${process.env.DAZNO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 secondes timeout
    });
    
    console.log(`✅ ${endpoint} - Succès`);
    return {
      endpoint,
      status: 'success',
      response: response.data
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`❌ ${endpoint} - Erreur:`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    } else {
      console.error(`❌ ${endpoint} - Erreur inconnue:`, error);
    }
    
    return {
      endpoint,
      status: 'error',
      error: axios.isAxiosError(error) ? {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      } : error
    };
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests api.dazno.de...\n');
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Proxy: ${proxyUrl}\n`);

  const tests = [
    // Endpoints Lightning
    testEndpoint('/lightning/explorer/nodes'),
    testEndpoint('/lightning/rankings'),
    testEndpoint('/lightning/network/global-stats'),
    testEndpoint(`/node/${TEST_PUBKEY}/priorities-enhanced`),
    testEndpoint('/lightning/calculator'),
    testEndpoint('/lightning/decoder', 'POST', {
      bolt11: 'lnbc1m1p...' // Remplacer par une facture BOLT11 valide
    }),

    // Endpoints Node
    testEndpoint(`/node/${TEST_PUBKEY}/status/complete`),
    testEndpoint(`/node/${TEST_PUBKEY}/lnd/status`),
    testEndpoint(`/node/${TEST_PUBKEY}/info/amboss`),

    // Endpoints Channels
    testEndpoint('/channels/recommendations/amboss', 'POST', {
      pubkey: TEST_PUBKEY
    }),
    testEndpoint('/channels/recommendations/unified', 'POST', {
      pubkey: TEST_PUBKEY
    })
  ];

  const results = await Promise.all(tests);
  
  console.log('\n📊 Résultats des tests:');
  console.log('=====================');
  
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  console.log(`\n✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📈 Taux de succès: ${((successCount / results.length) * 100).toFixed(1)}%`);
  
  if (errorCount > 0) {
    console.log('\n🔍 Détails des erreurs:');
    results
      .filter(r => r.status === 'error')
      .forEach(r => {
        console.log(`\n${r.endpoint}:`);
        console.log(JSON.stringify(r.error, null, 2));
      });
  }
}

runTests().catch(console.error); 