#!/usr/bin/env node

/**
 * Script de test complet pour tous les boutons Lightning
 * Vérifie: QR code, montant correct, payment request valide
 */

// Modules HTTP pour les requêtes

// Configuration des tests
const BASE_URL = 'http://localhost:3000';
const TESTS = [
  {
    name: '🔵 Plan Basic Mensuel',
    endpoint: '/api/create-invoice',
    amount: 10000,
    description: 'Plan Basic - Mensuel'
  },
  {
    name: '🔵 Plan Basic Annuel (x10)',
    endpoint: '/api/create-invoice',
    amount: 100000,
    description: 'Plan Basic - Annuel'
  },
  {
    name: '🟣 Plan Premium Mensuel', 
    endpoint: '/api/create-invoice',
    amount: 15000,
    description: 'Plan Premium - Mensuel'
  },
  {
    name: '🟣 Plan Premium Annuel (x10)',
    endpoint: '/api/create-invoice',
    amount: 150000,
    description: 'Plan Premium - Annuel'
  },
  {
    name: '📦 DazBox (0.004 BTC)',
    endpoint: '/api/create-invoice',
    amount: 400000,
    description: 'DazBox - Hardware Bitcoin'
  },
  {
    name: '⚡ DazNode Base',
    endpoint: '/api/create-invoice',
    amount: 80000,
    description: 'DazNode - Abonnement mensuel'
  },
  {
    name: '⚡ DazNode Annuel',
    endpoint: '/api/create-invoice',
    amount: 960000,
    description: 'DazNode - Abonnement annuel (x12)'
  }
];

// Fonction utilitaire pour faire une requête HTTP
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = require(url.startsWith('https') ? 'https' : 'http').request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: res.headers['content-type']?.includes('application/json') ? JSON.parse(data) : data
          });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Fonction pour vérifier une facture Lightning
async function testInvoiceCreation(test) {
  console.log(`\n🧪 Test: ${test.name}`);
  console.log(`   Montant: ${test.amount.toLocaleString()} sats`);
  
  try {
    const response = await makeRequest(`${BASE_URL}${test.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: test.amount,
        description: test.description
      })
    });
    
    if (response.status !== 200) {
      console.log(`   ❌ Erreur HTTP ${response.status}`);
      return false;
    }
    
    const invoice = response.data;
    
    // Vérifier la structure de la réponse
    if (!invoice.success || !invoice.data) {
      console.log(`   ❌ Structure de réponse invalide`);
      console.log(`   📄 Réponse:`, JSON.stringify(invoice, null, 2));
      return false;
    }
    
         const invoiceData = invoice.data.invoice; // Structure mise à jour
     
     // Vérifications des propriétés essentielles
     const checks = [
       { name: 'ID facture', value: invoiceData.id, test: v => v && v.length > 0 },
       { name: 'Payment Request', value: invoiceData.payment_request, test: v => v && v.startsWith('lnbc') },
       { name: 'Payment Hash', value: invoiceData.payment_hash, test: v => v && v.length === 64 },
       { name: 'Montant', value: invoiceData.amount, test: v => v === test.amount },
     ];
    
    let allChecksPass = true;
    checks.forEach(check => {
      const passed = check.test(check.value);
      console.log(`   ${passed ? '✅' : '❌'} ${check.name}: ${passed ? '✓' : check.value || 'manquant'}`);
      if (!passed) allChecksPass = false;
    });
    
    // Test supplémentaire: vérifier le statut de la facture
    if (allChecksPass) {
      const statusResponse = await makeRequest(`${BASE_URL}/api/check-invoice?id=${invoiceData.id}`, {
        method: 'GET'
      });
      
      if (statusResponse.status === 200 && statusResponse.data.success) {
        console.log(`   ✅ Statut facture: ${statusResponse.data.data.status}`);
      } else {
        console.log(`   ⚠️  Impossible de vérifier le statut`);
      }
    }
    
    console.log(`   🎯 Résultat: ${allChecksPass ? 'SUCCÈS' : 'ÉCHEC'}`);
    return allChecksPass;
    
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    return false;
  }
}

// Test de la génération de QR code
async function testQRCodeGeneration() {
  console.log(`\n🎨 Test génération QR Code`);
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/test/qr-modal`, {
      method: 'GET'
    });
    
    if (response.status === 200) {
      const html = response.data;
      const hasQRCode = html.includes('data:image/png;base64,');
      const hasModalScript = html.includes('showModal') || html.includes('showInvoiceModal');
      const hasCorrectAmount = html.includes('15000'); // Montant du test
      
      console.log(`   ✅ Page test accessible`);
      console.log(`   ${hasQRCode ? '✅' : '❌'} QR Code généré (base64)`);
      console.log(`   ${hasModalScript ? '✅' : '❌'} Script modale présent`);
      console.log(`   ${hasCorrectAmount ? '✅' : '❌'} Montant correct affiché`);
      
      return hasQRCode && hasModalScript && hasCorrectAmount;
    } else {
      console.log(`   ❌ Erreur HTTP ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function runAllTests() {
  console.log('🚀 DÉBUT DES TESTS LIGHTNING MODALS\n');
  console.log('='.repeat(50));
  
  let totalTests = 0;
  let passedTests = 0;
  
  // Tests de création de factures
  for (const test of TESTS) {
    totalTests++;
    const result = await testInvoiceCreation(test);
    if (result) passedTests++;
  }
  
  // Test QR Code
  totalTests++;
  const qrResult = await testQRCodeGeneration();
  if (qrResult) passedTests++;
  
  // Résumé final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('='.repeat(50));
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`📈 Taux de réussite: ${Math.round(passedTests / totalTests * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ Tous les boutons Lightning fonctionnent correctement');
    console.log('✅ Les QR codes sont générés correctement');
    console.log('✅ Les montants sont corrects');
    console.log('✅ Les payment requests sont valides');
  } else {
    console.log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ');
    console.log('🔧 Vérifiez la configuration Lightning et les endpoints');
  }
  
  console.log('\n🏁 Tests terminés\n');
}

// Vérifier que le serveur est démarré
async function checkServer() {
  try {
    // Tester avec l'endpoint create-invoice qui fonctionne bien
    const response = await makeRequest(`${BASE_URL}/api/create-invoice`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000, description: 'Test connection' })
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Point d'entrée
async function main() {
  console.log('🔍 Vérification du serveur de développement...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Le serveur de développement n\'est pas démarré !');
    console.log('💡 Lancez: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Serveur détecté, début des tests...\n');
  await runAllTests();
}

main().catch(console.error); 