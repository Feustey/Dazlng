#!/usr/bin/env tsx

/**
 * Script de test pour l'implémentation Lightning daznode@getalby.com
 * Usage: npm run test:daznode-lightning
 */

import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';

interface TestResult {
  test: string;
  success: boolean;
  error?: string;
  data?: any;
  duration: number;
}

class DazNodeLightningTester {
  private results: TestResult[] = [];

  async runTest(testName: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log(`\n🧪 Test: ${testName}`);
      
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      this.results.push({
        test: testName,
        success: true,
        data: result,
        duration
      });
      
      console.log(`✅ ${testName} - SUCCÈS (${duration}ms)`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        test: testName,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        duration
      });
      
      console.error(`❌ ${testName} - ÉCHEC (${duration}ms):`, error instanceof Error ? error.message : error);
    }
  }

  /**
   * Test 1: Vérification configuration daznode@getalby.com
   */
  async testConfiguration(): Promise<any> {
    console.log('🔍 Vérification configuration daznode@getalby.com...');
    
    // Vérification des variables d'environnement
    const hasConfig = process.env.DAZNODE_TLS_CERT && process.env.DAZNODE_ADMIN_MACAROON;
    const hasLndConfig = process.env.LND_TLS_CERT && process.env.LND_ADMIN_MACAROON;
    
    if (!hasConfig && !hasLndConfig) {
      throw new Error('Configuration daznode@getalby.com manquante: DAZNODE_TLS_CERT et DAZNODE_ADMIN_MACAROON requis');
    }
    
    return {
      daznode_config: hasConfig,
      lnd_fallback: hasLndConfig,
      socket: process.env.DAZNODE_SOCKET || 'daznode.getalby.com:10009'
    };
  }

  /**
   * Test 2: Création du service Lightning
   */
  async testServiceCreation(): Promise<any> {
    console.log('🏗️ Création service Lightning daznode@getalby.com...');
    
    const service = createDazNodeLightningService();
    
    if (!service) {
      throw new Error('Service Lightning non créé');
    }
    
    return {
      service_created: true,
      service_type: 'DazNodeLightningService'
    };
  }

  /**
   * Test 3: Health check daznode@getalby.com
   */
  async testHealthCheck(): Promise<any> {
    console.log('💓 Health check daznode@getalby.com...');
    
    const service = createDazNodeLightningService();
    const health = await service.healthCheck();
    
    if (!health.isOnline) {
      throw new Error('daznode@getalby.com non accessible');
    }
    
    return {
      online: health.isOnline,
      wallet_info: health.walletInfo
    };
  }

  /**
   * Test 4: Génération facture test
   */
  async testInvoiceGeneration(): Promise<any> {
    console.log('📄 Génération facture test...');
    
    const service = createDazNodeLightningService();
    
    const invoice = await service.generateInvoice({
      amount: 1000, // 1000 sats
      description: 'Test facture daznode@getalby.com',
      expiry: 3600
    });
    
    if (!invoice.paymentRequest || !invoice.paymentHash) {
      throw new Error('Facture invalide générée');
    }
    
    // Validation format BOLT11
    if (!invoice.paymentRequest.toLowerCase().startsWith('ln')) {
      throw new Error('Format BOLT11 invalide');
    }
    
    return {
      invoice_id: invoice.id,
      payment_hash: invoice.paymentHash?.substring(0, 20) + '...',
      payment_request_length: invoice.paymentRequest.length,
      amount: invoice.amount,
      expires_at: invoice.expiresAt
    };
  }

  /**
   * Test 5: Vérification statut facture
   */
  async testInvoiceStatusCheck(): Promise<any> {
    console.log('🔍 Vérification statut facture...');
    
    const service = createDazNodeLightningService();
    
    // Générer une facture de test
    const invoice = await service.generateInvoice({
      amount: 500,
      description: 'Test statut facture',
      expiry: 300
    });
    
    // Vérifier le statut
    const status = await service.checkInvoiceStatus(invoice.paymentHash);
    
    if (!status.status) {
      throw new Error('Statut invalide');
    }
    
    return {
      payment_hash: invoice.paymentHash?.substring(0, 20) + '...',
      status: status.status,
      amount: status.amount
    };
  }

  /**
   * Affichage du rapport final
   */
  printReport(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE TEST - DAZNODE@GETALBY.COM');
    console.log('='.repeat(60));
    
    const successCount = this.results.filter(r => r.success).length;
    const failCount = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`\n✅ Tests réussis: ${successCount}/${this.results.length}`);
    console.log(`❌ Tests échoués: ${failCount}/${this.results.length}`);
    console.log(`⏱️  Durée totale: ${totalDuration}ms`);
    
    if (failCount > 0) {
      console.log('\n❌ ÉCHECS DÉTAILLÉS:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`   • ${r.test}: ${r.error}`);
        });
    }
    
    const successRate = Math.round((successCount / this.results.length) * 100);
    console.log(`\n🎯 Taux de réussite: ${successRate}%`);
    
    if (successRate >= 80) {
      console.log('🚀 IMPLÉMENTATION DAZNODE@GETALBY.COM PRÊTE !');
    } else if (successRate >= 60) {
      console.log('⚠️  Implémentation partiellement fonctionnelle');
    } else {
      console.log('🚨 Configuration requise pour daznode@getalby.com');
    }
    
    console.log('='.repeat(60));
  }

  /**
   * Exécution de tous les tests
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 TESTS LIGHTNING DAZNODE@GETALBY.COM');
    console.log('Package: lightning@10.25.2');
    console.log('Provider: daznode@getalby.com');
    
    // Tests séquentiels
    await this.runTest('Configuration daznode@getalby.com', () => this.testConfiguration());
    await this.runTest('Création service Lightning', () => this.testServiceCreation());
    await this.runTest('Health check daznode@getalby.com', () => this.testHealthCheck());
    await this.runTest('Génération facture test', () => this.testInvoiceGeneration());
    await this.runTest('Vérification statut facture', () => this.testInvoiceStatusCheck());
    
    // Rapport final
    this.printReport();
  }
}

// Exécution si le script est lancé directement
if (require.main === module) {
  const tester = new DazNodeLightningTester();
  
  tester.runAllTests()
    .then(() => {
      console.log('\n✅ Tests terminés');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erreur lors des tests:', error);
      process.exit(1);
    });
}

export default DazNodeLightningTester; 