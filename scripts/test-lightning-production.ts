#!/usr/bin/env tsx

/**
 * Test rapide du système Lightning en production
 */

import { createInvoiceFallbackService } from '../lib/services/invoice-fallback-service';

async function testLightningProduction() {
  console.log('🚀 TEST RAPIDE LIGHTNING PRODUCTION');
  console.log('====================================');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'unknown'}\n`);

  try {
    // Test 1: Service de fallback
    console.log('🔄 Test 1: Service de fallback');
    const service = createInvoiceFallbackService({
      maxRetries: 2,
      retryDelay: 1000,
      enableLocalLnd: true,
      enableMockService: false
    });

    await service.forceHealthCheck();
    const health = await service.healthCheck();
    console.log(`   Status: ${health.isOnline ? '✅ Online' : '❌ Offline'}`);
    console.log(`   Provider: ${health.provider}\n`);

    // Test 2: Création de facture
    if (health.isOnline) {
      console.log('💰 Test 2: Création de facture');
      const startTime = Date.now();
      
      const invoice = await service.generateInvoice({
        amount: 1000,
        description: 'Test production Lightning',
        expiry: 3600,
        metadata: { test: true, production: true }
      });

      const duration = Date.now() - startTime;
      console.log(`   ✅ Facture créée en ${duration}ms`);
      console.log(`   ID: ${invoice.id}`);
      console.log(`   Montant: ${invoice.amount} sats`);
      console.log(`   Hash: ${invoice.paymentHash}\n`);

      // Test 3: Vérification statut
      console.log('🔍 Test 3: Vérification statut');
      const status = await service.checkInvoiceStatus(invoice.paymentHash);
      console.log(`   ✅ Statut: ${status.status}\n`);

      console.log('🎉 TOUS LES TESTS PASSÉS !');
      console.log('Le système Lightning est opérationnel en production.');
    } else {
      console.log('❌ Service indisponible - Vérifier la configuration');
    }

    service.destroy();
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.log('\n🔧 Actions recommandées:');
    console.log('1. Vérifier les variables d\'environnement');
    console.log('2. Exécuter: npm run diagnostic:lightning');
    console.log('3. Exécuter: npm run fix:lightning');
    process.exit(1);
  }
}

if (require.main === module) {
  testLightningProduction();
} 