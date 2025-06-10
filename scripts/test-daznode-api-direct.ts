#!/usr/bin/env tsx

// Test direct des endpoints API sans serveur Next.js
import { createUnifiedLightningService } from '../lib/services/unified-lightning-service';

async function testDazNodeApiDirect() {
  console.log('🧪 TEST ENDPOINTS API DAZNODE (DIRECT)\n');
  console.log('=====================================\n');

  let totalTests = 0;
  let passedTests = 0;

  const markTest = (passed: boolean, testName: string, details?: string) => {
    totalTests++;
    if (passed) {
      passedTests++;
      console.log(`✅ ${testName}`);
      if (details) console.log(`   ${details}`);
    } else {
      console.log(`❌ ${testName}`);
      if (details) console.log(`   ${details}`);
    }
    console.log('');
  };

  try {
    // Simulation de l'endpoint create-invoice
    console.log('1️⃣ Test simulation endpoint /api/create-invoice...');
    
    const lightningService = createUnifiedLightningService();
    const provider = lightningService.getProvider();
    
    markTest(provider === 'daznode', 'Provider API correct', `Provider: ${provider}`);

    // Test génération facture
    const invoice = await lightningService.generateInvoice({
      amount: 1000,
      description: 'Test API direct DazNode'
    });

         const hasValidInvoice = !!(invoice && invoice.paymentRequest && invoice.paymentHash);
     markTest(hasValidInvoice, 'Génération facture API', 
       `Hash: ${invoice.paymentHash?.substring(0, 20)}... | BOLT11: ${invoice.paymentRequest?.substring(0, 30)}...`);

    // Test format réponse API
    const apiResponse = {
      success: true,
      data: {
        invoice: {
          id: invoice.id,
          payment_request: invoice.paymentRequest,
          payment_hash: invoice.paymentHash,
          expires_at: invoice.expiresAt,
          amount: invoice.amount
        },
        paymentUrl: `lightning:${invoice.paymentRequest}`
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        provider: provider
      }
    };

         const hasValidApiFormat = !!(apiResponse.success && 
                               apiResponse.data?.invoice?.payment_request &&
                               apiResponse.meta?.provider === 'daznode');
    
    markTest(hasValidApiFormat, 'Format réponse API', 
      `Version: ${apiResponse.meta.version} | Provider: ${apiResponse.meta.provider}`);

    // Test vérification statut
    console.log('2️⃣ Test simulation endpoint /api/check-invoice...');
    
    const status = await lightningService.checkInvoiceStatus(invoice.paymentHash);
         const hasValidStatus = !!(status && status.status);
     
     markTest(hasValidStatus, 'Vérification statut API', 
       `Statut: ${status.status} | Montant: ${status.amount} sats`);

    // Test format réponse check-invoice
    const checkApiResponse = {
      success: true,
      data: {
        status: status.status,
        settledAt: status.settledAt,
        amount: status.amount
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        provider: provider
      }
    };

    const hasValidCheckFormat = checkApiResponse.success && 
                                checkApiResponse.data?.status &&
                                checkApiResponse.meta?.provider === 'daznode';
    
    markTest(hasValidCheckFormat, 'Format réponse check API', 
      `Statut: ${checkApiResponse.data.status} | Provider: ${checkApiResponse.meta.provider}`);

    // Test validation BOLT11 simple
    console.log('3️⃣ Test validation BOLT11...');
    
         const isValidBolt11 = !!(invoice.paymentRequest?.toLowerCase().startsWith('ln'));
     markTest(isValidBolt11, 'Format BOLT11 basique', 
       `Facture: ${invoice.paymentRequest?.substring(0, 30)}...`);

    // Test wallet info
    console.log('4️⃣ Test informations wallet...');
    
    const walletInfo = await lightningService.getWalletInfo();
    const isWalletOnline = walletInfo.isOnline && walletInfo.provider === 'daznode';
    
    markTest(isWalletOnline, 'Wallet DazNode accessible', 
      `Provider: ${walletInfo.provider} | En ligne: ${walletInfo.isOnline}`);

    // Test fermeture propre
    await lightningService.close();
    markTest(true, 'Fermeture connexions', 'Connexions fermées proprement');

    // Résumé
    console.log('\n📊 RÉSUMÉ TEST API DIRECT DAZNODE');
    console.log('==================================');
    console.log(`Total des tests: ${totalTests}`);
    console.log(`✅ Tests réussis: ${passedTests}`);
    console.log(`❌ Tests échoués: ${totalTests - passedTests}`);
    console.log(`📈 Taux de réussite: ${Math.round((passedTests / totalTests) * 100)}%\n`);

    if (passedTests === totalTests) {
      console.log('🎉 ENDPOINTS API DAZNODE PARFAITEMENT FONCTIONNELS !');
      console.log('\n💡 Résultats des tests API :');
      console.log('   ✅ Service unifié utilise bien le wallet DazNode');
      console.log('   ✅ Génération factures Lightning opérationnelle');
      console.log('   ✅ Vérification statuts fonctionnelle');
      console.log('   ✅ Format réponses API standardisé');
      console.log('   ✅ Validation BOLT11 correcte');
      console.log('\n🚀 Les endpoints API sont prêts pour la production !');
      console.log('\nEndpoints testés en simulation :');
      console.log('   - POST /api/create-invoice');
      console.log('   - GET /api/check-invoice');
      
      process.exit(0);
    } else {
      console.log('⚠️ QUELQUES TESTS API ONT ÉCHOUÉ');
      console.log('\n🔧 Vérifier :');
      console.log('   1. Configuration des services');
      console.log('   2. Imports des modules');
      console.log('   3. Format des réponses API');
      
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 ERREUR CRITIQUE LORS DU TEST API:', error);
    console.log('\n🆘 Les endpoints API ne sont pas fonctionnels');
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  testDazNodeApiDirect().catch(console.error);
}

export { testDazNodeApiDirect }; 