#!/usr/bin/env tsx

import { createLightningService } from '../lib/services/lightning-service';
import fetch from 'node-fetch';

// Configuration pour les tests
const TEST_CONFIG = {
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  testAmount: 1000, // 1000 sats
  testDescription: 'Test migration Lightning DazNode - ' + new Date().toISOString()
};

async function testLightningMigration() {
  console.log('🧪 TEST DE MIGRATION LIGHTNING DAZNODE v2.0\n');
  console.log('============================================\n');

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
    // Test 1: Vérification des variables d'environnement
    console.log('1️⃣ Test des variables d\'environnement LND...');
    const hasLndCert = !!process.env.LND_TLS_CERT;
    const hasLndMacaroon = !!process.env.LND_ADMIN_MACAROON;
    const hasLndSocket = !!process.env.LND_SOCKET;
    
    markTest(hasLndCert, 'Variable LND_TLS_CERT présente', 
      hasLndCert ? `Longueur: ${process.env.LND_TLS_CERT?.length} caractères` : 'Variable manquante');
    
    markTest(hasLndMacaroon, 'Variable LND_ADMIN_MACAROON présente',
      hasLndMacaroon ? `Longueur: ${process.env.LND_ADMIN_MACAROON?.length} caractères` : 'Variable manquante');
    
    markTest(hasLndSocket, 'Variable LND_SOCKET présente',
      hasLndSocket ? `Socket: ${process.env.LND_SOCKET}` : `Socket par défaut: 127.0.0.1:10009`);

    // Test 2: Initialisation du service Lightning
    console.log('2️⃣ Test initialisation service Lightning...');
    let lightning;
    try {
      lightning = createLightningService();
      markTest(true, 'Service Lightning initialisé', 'Connexion LND établie');
    } catch (error) {
      markTest(false, 'Service Lightning initialisé', 
        `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      
      // Si on ne peut pas initialiser le service, on arrête ici
      console.log('\n🚨 ARRÊT DES TESTS - Service Lightning non disponible');
      console.log('💡 Actions requises :');
      console.log('   1. Démarrer votre nœud LND');
      console.log('   2. Configurer les variables d\'environnement LND_TLS_CERT et LND_ADMIN_MACAROON');
      console.log('   3. Vérifier la connectivité réseau vers le nœud');
      process.exit(1);
    }

    // Test 3: Health check du nœud
    console.log('3️⃣ Test connectivité nœud Lightning...');
    try {
      const health = await lightning.healthCheck();
      
      if (health.isOnline && health.nodeInfo) {
        markTest(true, 'Nœud Lightning en ligne', 
          `Alias: ${health.nodeInfo.alias} | Canaux: ${health.nodeInfo.channels} | Bloc: ${health.nodeInfo.blockHeight}`);
      } else {
        markTest(false, 'Nœud Lightning en ligne', 'Nœud hors ligne ou inaccessible');
      }
    } catch (error) {
      markTest(false, 'Nœud Lightning en ligne', 
        `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    // Test 4: Génération de facture via service direct
    console.log('4️⃣ Test génération facture (service direct)...');
    let testInvoice;
    try {
      testInvoice = await lightning.generateInvoice({
        amount: TEST_CONFIG.testAmount,
        description: TEST_CONFIG.testDescription,
        expiry: 3600
      });
      
      markTest(true, 'Facture générée (service direct)', 
        `ID: ${testInvoice.id?.substring(0, 20)}... | Montant: ${testInvoice.amount} sats`);
    } catch (error) {
      markTest(false, 'Facture générée (service direct)', 
        `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    // Test 5: Décodage de facture
    if (testInvoice) {
      console.log('5️⃣ Test décodage facture BOLT11...');
      try {
        const decoded = await lightning.decodeInvoice(testInvoice.paymentRequest);
        
        const amountMatch = decoded.amount === testInvoice.amount;
        const descriptionMatch = decoded.description === testInvoice.description;
        
        markTest(amountMatch && descriptionMatch, 'Facture décodée correctement', 
          `Montant: ${decoded.amount} sats | Description validée: ${descriptionMatch}`);
      } catch (error) {
        markTest(false, 'Facture décodée correctement', 
          `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    // Test 6: Vérification statut facture via service direct
    if (testInvoice) {
      console.log('6️⃣ Test vérification statut (service direct)...');
      try {
        const status = await lightning.checkInvoiceStatus(testInvoice.paymentHash);
        
        markTest(status.status === 'pending', 'Statut facture vérifié', 
          `Statut: ${status.status} | Montant: ${status.amount || 'N/A'} sats`);
      } catch (error) {
        markTest(false, 'Statut facture vérifié', 
          `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
        
        markTest(hasInvoice, 'Endpoint create-invoice fonctionnel', 
          `Version: ${data.meta?.version} | Provider: ${data.meta?.provider}`);
        
        // Test 8: Test endpoint API check-invoice
        if (hasInvoice) {
          console.log('8️⃣ Test endpoint API /api/check-invoice...');
          const checkResponse = await fetch(
            `${TEST_CONFIG.baseUrl}/api/check-invoice?id=${data.data.invoice.payment_hash}`
          );
          
          if (checkResponse.ok) {
            const checkData = await checkResponse.json() as any;
            const hasStatus = checkData.success && checkData.data?.status;
            
            markTest(hasStatus, 'Endpoint check-invoice fonctionnel', 
              `Statut: ${checkData.data?.status} | Version: ${checkData.meta?.version}`);
          } else {
            markTest(false, 'Endpoint check-invoice fonctionnel', 
              `Erreur HTTP: ${checkResponse.status}`);
          }
        }
      } else {
        markTest(false, 'Endpoint create-invoice fonctionnel', 
          `Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      markTest(false, 'Endpoint create-invoice fonctionnel', 
        `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    // Résumé final
    console.log('\n📊 RÉSUMÉ DE LA MIGRATION');
    console.log('===========================');
    console.log(`Total des tests: ${totalTests}`);
    console.log(`✅ Tests réussis: ${passedTests}`);
    console.log(`❌ Tests échoués: ${failedTests}`);
    console.log(`📈 Taux de réussite: ${Math.round((passedTests / totalTests) * 100)}%\n`);

    if (failedTests === 0) {
      console.log('🎉 MIGRATION LIGHTNING COMPLÈTEMENT RÉUSSIE !');
      console.log('\n💡 Prochaines étapes recommandées :');
      console.log('   1. ✅ Supprimer les anciens services (LNbits, NWC)');
      console.log('   2. ✅ Mettre à jour les composants frontend');
      console.log('   3. ✅ Déployer en production');
      console.log('   4. ✅ Monitorer les performances');
      
      process.exit(0);
    } else {
      console.log('⚠️ MIGRATION PARTIELLEMENT RÉUSSIE');
      console.log('\n🔧 Actions correctives requises :');
      
      if (!hasLndCert || !hasLndMacaroon) {
        console.log('   1. Configurer les variables d\'environnement LND');
        console.log('      export LND_TLS_CERT="$(base64 -w0 ~/.lnd/tls.cert)"');
        console.log('      export LND_ADMIN_MACAROON="$(base64 -w0 ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon)"');
      }
      
      console.log('   2. Vérifier que le nœud LND est démarré et accessible');
      console.log('   3. Vérifier la connectivité réseau');
      console.log('   4. Consulter les logs pour plus de détails');
      
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 ERREUR CRITIQUE LORS DU TEST:', error);
    console.log('\n🆘 Assistance technique requise');
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  testLightningMigration().catch(console.error);
}

export { testLightningMigration }; 