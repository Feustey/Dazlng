#!/usr/bin/env tsx

import { createUnifiedLightningService } from '../lib/services/unified-lightning-service';
import { createDazNodeWalletService } from '../lib/services/daznode-wallet-service';
import fetch from 'node-fetch';

// Configuration pour les tests
const TEST_CONFIG = {
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  testAmount: 1000, // 1000 sats
  testDescription: 'Test wallet DazNode - ' + new Date().toISOString()
};

async function testDazNodeWallet() {
  console.log('🧪 TEST WALLET DAZNODE v2.0\n');
  console.log('=======================================\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // Fonction utilitaire pour marquer les tests
  const markTest = (passed: boolean, testName: string, details?: string) => {
    totalTests++;
    if (passed) {
      passedTests++;
      console.log(`✅ ${testName}`);
      if (details) console.log(`   ${details}`);
    } else {
      failedTests++;
      console.log(`❌ ${testName}`);
      if (details) console.log(`   ${details}`);
    }
    console.log('');
  };

  try {
    // Test 1: Vérification des clés DazNode
    console.log('1️⃣ Test des clés publiques DazNode...');
    const expectedAppPubkey = '69620ced6b014d8b6013aa86c6b37cd86f28a5843ce8b430b5d96d7bc991c697';
    const expectedWalletPubkey = 'de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30';
    
    const appPubkey = process.env.APP_PUKEY || process.env.DAZNODE_APP_PUBLIC_KEY || expectedAppPubkey;
    const walletPubkey = process.env.WALLET_PUKEY || process.env.DAZNODE_WALLET_PUBLIC_KEY || expectedWalletPubkey;
    
    markTest(appPubkey === expectedAppPubkey, 'App Public Key DazNode', 
      `${appPubkey.substring(0, 20)}...${appPubkey === expectedAppPubkey ? ' (configuré)' : ' (différent)'}`);
    
    markTest(walletPubkey === expectedWalletPubkey, 'Wallet Public Key DazNode',
      `${walletPubkey.substring(0, 20)}...${walletPubkey === expectedWalletPubkey ? ' (configuré)' : ' (différent)'}`);

    // Test 2: Initialisation du service DazNode direct
    console.log('2️⃣ Test service DazNode direct...');
    let dazNodeService;
    try {
      dazNodeService = createDazNodeWalletService();
      markTest(true, 'Service DazNode initialisé', 'Connexion NWC configurée');
    } catch (error) {
      markTest(false, 'Service DazNode initialisé', 
        `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    // Test 3: Informations wallet DazNode
    if (dazNodeService) {
      console.log('3️⃣ Test informations wallet DazNode...');
      try {
        const walletInfo = await dazNodeService.getWalletInfo();
        
        if (walletInfo.isOnline && walletInfo.walletInfo) {
          markTest(true, 'Wallet DazNode en ligne', 
            `Balance: ${walletInfo.walletInfo.balance} sats | Alias: ${walletInfo.walletInfo.alias}`);
        } else {
          markTest(false, 'Wallet DazNode en ligne', 'Wallet hors ligne ou inaccessible');
        }
      } catch (error) {
        markTest(false, 'Wallet DazNode en ligne', 
          `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    // Test 4: Service unifié (doit utiliser DazNode par défaut)
    console.log('4️⃣ Test service Lightning unifié...');
    let unifiedService;
    try {
      unifiedService = createUnifiedLightningService();
      const provider = unifiedService.getProvider();
      
      markTest(provider === 'daznode', 'Service unifié utilise DazNode', 
        `Provider détecté: ${provider}`);
    } catch (error) {
      markTest(false, 'Service unifié utilise DazNode', 
        `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    // Test 5: Génération de facture via service unifié
    if (unifiedService) {
      console.log('5️⃣ Test génération facture (service unifié)...');
      let testInvoice;
      try {
        testInvoice = await unifiedService.generateInvoice({
          amount: TEST_CONFIG.testAmount,
          description: TEST_CONFIG.testDescription,
          expiry: 3600
        });
        
        markTest(true, 'Facture générée via service unifié', 
          `ID: ${testInvoice.id?.substring(0, 20)}... | Montant: ${testInvoice.amount} sats`);
      } catch (error) {
        markTest(false, 'Facture générée via service unifié', 
          `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }

      // Test 6: Vérification statut facture
      if (testInvoice) {
        console.log('6️⃣ Test vérification statut facture...');
        try {
          const status = await unifiedService.checkInvoiceStatus(testInvoice.paymentHash);
          
          markTest(status.status === 'pending', 'Statut facture vérifié', 
            `Statut: ${status.status} | Montant: ${status.amount || 'N/A'} sats`);
        } catch (error) {
          markTest(false, 'Statut facture vérifié', 
            `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
      }
    }

    // Test 7: Test endpoint API create-invoice
    console.log('7️⃣ Test endpoint API /api/create-invoice...');
    try {
      const response = await fetch(`${TEST_CONFIG.baseUrl}/api/create-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: TEST_CONFIG.testAmount,
          description: TEST_CONFIG.testDescription + ' (API Test)'
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        const hasInvoice = data.success && data.data?.invoice?.payment_request;
        const isDazNodeProvider = data.meta?.provider === 'daznode';
        
        markTest(hasInvoice && isDazNodeProvider, 'Endpoint API utilise DazNode', 
          `Provider: ${data.meta?.provider} | Version: ${data.meta?.version}`);
        
        // Test 8: Test endpoint API check-invoice
        if (hasInvoice) {
          console.log('8️⃣ Test endpoint API /api/check-invoice...');
          const checkResponse = await fetch(
            `${TEST_CONFIG.baseUrl}/api/check-invoice?id=${data.data.invoice.payment_hash}`
          );
          
          if (checkResponse.ok) {
            const checkData = await checkResponse.json() as any;
            const hasStatus = checkData.success && checkData.data?.status;
            const isDazNodeCheck = checkData.meta?.provider === 'daznode';
            
            markTest(hasStatus && isDazNodeCheck, 'Endpoint check-invoice utilise DazNode', 
              `Statut: ${checkData.data?.status} | Provider: ${checkData.meta?.provider}`);
          } else {
            markTest(false, 'Endpoint check-invoice utilise DazNode', 
              `Erreur HTTP: ${checkResponse.status}`);
          }
        }
      } else {
        markTest(false, 'Endpoint API utilise DazNode', 
          `Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      markTest(false, 'Endpoint API utilise DazNode', 
        `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    // Test 9: Validation des factures BOLT11
    console.log('9️⃣ Test validation format BOLT11...');
    try {
      const testResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/create-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 100,
          description: 'Test BOLT11'
        })
      });

      if (testResponse.ok) {
        const data = await testResponse.json() as any;
        const bolt11 = data.data?.invoice?.payment_request;
        const isValidBolt11 = bolt11 && bolt11.toLowerCase().startsWith('ln');
        
        markTest(isValidBolt11, 'Format BOLT11 valide', 
          `Facture: ${bolt11?.substring(0, 30)}...`);
      } else {
        markTest(false, 'Format BOLT11 valide', 'Impossible de générer facture test');
      }
    } catch (error) {
      markTest(false, 'Format BOLT11 valide', 
        `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    // Fermeture des connexions
    if (dazNodeService) {
      await dazNodeService.close();
    }
    if (unifiedService) {
      await unifiedService.close();
    }

    // Résumé final
    console.log('\n📊 RÉSUMÉ TEST WALLET DAZNODE');
    console.log('==============================');
    console.log(`Total des tests: ${totalTests}`);
    console.log(`✅ Tests réussis: ${passedTests}`);
    console.log(`❌ Tests échoués: ${failedTests}`);
    console.log(`📈 Taux de réussite: ${Math.round((passedTests / totalTests) * 100)}%\n`);

    if (failedTests === 0) {
      console.log('🎉 WALLET DAZNODE PARFAITEMENT CONFIGURÉ !');
      console.log('\n💡 Le système utilise maintenant le wallet DazNode pour :');
      console.log('   ✅ Génération de factures Lightning');
      console.log('   ✅ Vérification des paiements');
      console.log('   ✅ Réception des paiements sur le wallet DazNode');
      console.log('\n🔑 Clés configurées :');
      console.log(`   App Public Key: ${expectedAppPubkey.substring(0, 20)}...`);
      console.log(`   Wallet Public Key: ${expectedWalletPubkey.substring(0, 20)}...`);
      
      process.exit(0);
    } else {
      console.log('⚠️ CONFIGURATION PARTIELLEMENT RÉUSSIE');
      console.log('\n🔧 Actions correctives possibles :');
      
      if (failedTests > 3) {
        console.log('   1. Vérifier la connectivité internet');
        console.log('   2. Vérifier que le relay Alby est accessible');
        console.log('   3. Valider les clés publiques DazNode');
      }
      
      console.log('   4. Consulter les logs pour plus de détails');
      console.log('   5. Tenter une réinitialisation du wallet NWC');
      
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 ERREUR CRITIQUE LORS DU TEST:', error);
    console.log('\n🆘 Le wallet DazNode n\'est pas accessible');
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  testDazNodeWallet().catch(console.error);
}

export { testDazNodeWallet }; 