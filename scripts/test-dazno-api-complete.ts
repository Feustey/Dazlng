import axios from 'axios';
import { config } from 'dotenv';
import { HttpsProxyAgent } from 'https-proxy-agent';

config();

const API_BASE_URL = 'https://api.dazno.de';
const TEST_PUBKEY = '03eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619';

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
      timeout: 10000
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
  console.log('🚀 Démarrage des tests complets api.dazno.de...\n');
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Proxy: ${proxyUrl}\n`);

  const tests = [
    // 1. Santé et Statut
    testEndpoint('/health'),
    testEndpoint('/status'),

    // 2. RAG (Retrieval Augmented Generation)
    testEndpoint('/rag/documents', 'POST', {
      content: 'Test document',
      metadata: { type: 'test' }
    }),
    testEndpoint('/rag/documents/batch', 'POST', {
      documents: [
        { content: 'Test 1', metadata: { type: 'test' } },
        { content: 'Test 2', metadata: { type: 'test' } }
      ]
    }),
    testEndpoint('/rag/documents/test-doc-id'),
    testEndpoint('/rag/query', 'POST', {
      query: 'Test query',
      context: 'Test context'
    }),
    testEndpoint('/rag/embed', 'POST', {
      text: 'Test text for embedding'
    }),
    testEndpoint('/rag/analyze', 'POST', {
      content: 'Test content for analysis'
    }),

    // 3. Réseau Lightning
    testEndpoint(`/network/node/${TEST_PUBKEY}/stats`),
    testEndpoint(`/network/node/${TEST_PUBKEY}/history`),
    testEndpoint(`/network/node/${TEST_PUBKEY}/optimize`, 'POST'),
    testEndpoint('/network/summary'),
    testEndpoint('/network/centralities'),
    testEndpoint('/lightning/validate-key', 'POST', {
      pubkey: TEST_PUBKEY
    }),
    testEndpoint('/lightning/validate-node', 'POST', {
      pubkey: TEST_PUBKEY
    }),

    // 4. Simulation
    testEndpoint('/api/v1/simulate/profiles'),
    testEndpoint('/api/v1/simulate/node', 'POST', {
      pubkey: TEST_PUBKEY,
      scenario: 'test'
    }),
    testEndpoint(`/api/v1/optimize/node/${TEST_PUBKEY}`, 'POST'),

    // 5. Administration
    testEndpoint('/api/v1/admin/metrics'),
    testEndpoint('/api/v1/admin/maintenance', 'POST', {
      action: 'test'
    }),

    // 6. LNBits
    testEndpoint('/api/v1/payments'),
    testEndpoint('/api/v1/wallet'),
    testEndpoint('/api/v1/payments/decode', 'POST', {
      bolt11: 'lnbc1m1p...' // Remplacer par une facture valide
    }),
    testEndpoint('/api/v1/payments/bolt11', 'POST', {
      bolt11: 'lnbc1m1p...' // Remplacer par une facture valide
    }),
    testEndpoint('/api/v1/channels'),

    // 7. Automatisation
    testEndpoint('/config')
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

  // Générer un rapport d'implémentation
  console.log('\n📝 Rapport d\'implémentation:');
  console.log('==========================');
  
  const implementedEndpoints = results
    .filter(r => r.status === 'success')
    .map(r => r.endpoint);
    
  const missingEndpoints = results
    .filter(r => r.status === 'error')
    .map(r => r.endpoint);

  console.log('\n✅ Endpoints implémentés:');
  implementedEndpoints.forEach(endpoint => console.log(`- ${endpoint}`));
  
  console.log('\n❌ Endpoints manquants:');
  missingEndpoints.forEach(endpoint => console.log(`- ${endpoint}`));
}

runTests().catch(console.error); 