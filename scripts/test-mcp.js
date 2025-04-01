import fetch from 'node-fetch';

const MCP_API_URL = 'http://localhost:8002';
const JWT_SECRET_KEY = '704eedbe13328635c8b46cdbdc2a89ede7e22efb403cd36b236bda3a854e2d75';

// Fonction utilitaire pour attendre un certain temps
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_SECRET_KEY}`,
      },
    };

    // Construire l'URL avec les paramètres de requête requis
    const url = new URL(`${MCP_API_URL}${endpoint}`);
    url.searchParams.append('args', '[]');
    url.searchParams.append('kwargs', '{}');

    // Pour les requêtes POST, inclure le corps
    if (method === 'POST' && body) {
      options.body = JSON.stringify(body);
    }

    console.log(`\nTest de l'endpoint: ${url.toString()}`);
    if (method === 'POST' && body) {
      console.log('Corps de la requête:', options.body);
    }

    const response = await fetch(url.toString(), options);
    const responseText = await response.text();
    
    // Afficher le statut et les en-têtes de la réponse
    console.log(`Status: ${response.status}`);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    // Essayer de parser la réponse JSON
    try {
      const data = JSON.parse(responseText);
      console.log('Réponse:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Réponse brute:', responseText);
    }
    
    return response.ok;
  } catch (error) {
    console.error(`Erreur lors du test de ${endpoint}:`, error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    return false;
  }
}

async function runTests() {
  console.log('\nDémarrage des tests MCP...\n');

  const testPubkey = '02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b';

  // Test des endpoints
  await testEndpoint('/health');
  await sleep(1000);

  await testEndpoint(`/node/${testPubkey}/stats`);
  await sleep(1000);

  await testEndpoint('/centralities');
  await sleep(1000);

  await testEndpoint('/network-summary');
  await sleep(1000);

  // Optimize node avec le bon format
  await testEndpoint('/optimize-node', 'POST', { node_id: testPubkey });
  await sleep(1000);

  // Optimize node spécifique avec le bon format
  await testEndpoint(`/node/${testPubkey}/optimize`, 'POST');
  await sleep(1000);

  // History avec le bon format
  await testEndpoint(`/node/${testPubkey}/history`, 'GET');

  console.log('\nTests terminés.');
}

runTests().catch(console.error); 