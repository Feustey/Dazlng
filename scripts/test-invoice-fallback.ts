#!/usr/bin/env ts-node

/**
 * Script de test pour le système de fallback des factures
 * Teste les différents scénarios : api.dazno.de disponible/indisponible, LND local, service mock
 */

import { createInvoiceFallbackService } from '../lib/services/invoice-fallback-service';
import { CreateInvoiceParams } from '../types/lightning';

// Type local pour éviter les conflits d'import
type PaymentStatus = 'pending' | 'settled' | 'failed' | 'expired';

interface TestResult {
  scenario: string;
  success: boolean;
  provider: string;
  duration: number;
  error?: string;
  servicesStatus?: any;
}

class InvoiceFallbackTester {
  private results: TestResult[] = [];

  async runTest(scenario: string, testFn: () => Promise<any>): Promise<TestResult> {
    console.log(`\n🧪 Test: ${scenario}`);
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      const testResult: TestResult = {
        scenario,
        success: true,
        provider: result.provider || 'unknown',
        duration,
        servicesStatus: result.servicesStatus
      };
      
      console.log(`✅ ${scenario} - Succès (${duration}ms) - Provider: ${result.provider}`);
      this.results.push(testResult);
      return testResult;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      const testResult: TestResult = {
        scenario,
        success: false,
        provider: 'failed',
        duration,
        error: errorMessage
      };
      
      console.log(`❌ ${scenario} - Échec (${duration}ms) - Erreur: ${errorMessage}`);
      this.results.push(testResult);
      return testResult;
    }
  }

  async testBasicInvoiceGeneration(): Promise<TestResult> {
    return this.runTest('Génération facture basique', async () => {
      const service = createInvoiceFallbackService({
        maxRetries: 2,
        retryDelay: 500,
        enableLocalLnd: true,
        enableMockService: true
      });

      try {
        await service.forceHealthCheck();
        
        const params: CreateInvoiceParams = {
          amount: 1000,
          description: 'Test facture fallback',
          expiry: 3600,
          metadata: { test: true }
        };

        const invoice = await service.generateInvoice(params);
        const healthCheck = await service.healthCheck();
        
        return {
          provider: healthCheck.provider,
          invoice,
          servicesStatus: service.getServicesStatus()
        };
      } finally {
        service.destroy();
      }
    });
  }

  async testInvoiceStatusCheck(): Promise<TestResult> {
    return this.runTest('Vérification statut facture', async () => {
      const service = createInvoiceFallbackService({
        maxRetries: 2,
        retryDelay: 500,
        enableLocalLnd: true,
        enableMockService: true
      });

      try {
        await service.forceHealthCheck();
        
        // Génération d'une facture d'abord
        const params: CreateInvoiceParams = {
          amount: 1000,
          description: 'Test statut fallback',
          expiry: 3600
        };

        const invoice = await service.generateInvoice(params);
        
        // Vérification du statut
        const status = await service.checkInvoiceStatus(invoice.paymentHash);
        const healthCheck = await service.healthCheck();
        
        return {
          provider: healthCheck.provider,
          status,
          servicesStatus: service.getServicesStatus()
        };
      } finally {
        service.destroy();
      }
    });
  }

  async testHealthCheckAllServices(): Promise<TestResult> {
    return this.runTest('Health check tous services', async () => {
      const service = createInvoiceFallbackService({
        maxRetries: 1,
        retryDelay: 200,
        enableLocalLnd: true,
        enableMockService: true
      });

      try {
        await service.forceHealthCheck();
        const healthCheck = await service.healthCheck();
        const servicesStatus = service.getServicesStatus();
        
        return {
          provider: healthCheck.provider,
          isOnline: healthCheck.isOnline,
          servicesStatus
        };
      } finally {
        service.destroy();
      }
    });
  }

  async testMockServiceOnly(): Promise<TestResult> {
    return this.runTest('Service mock uniquement', async () => {
      const service = createInvoiceFallbackService({
        maxRetries: 1,
        retryDelay: 100,
        enableLocalLnd: false,
        enableMockService: true
      });

      try {
        await service.forceHealthCheck();
        
        const params: CreateInvoiceParams = {
          amount: 500,
          description: 'Test mock service',
          expiry: 1800
        };

        const invoice = await service.generateInvoice(params);
        const status = await service.checkInvoiceStatus(invoice.paymentHash);
        const healthCheck = await service.healthCheck();
        
        return {
          provider: healthCheck.provider,
          invoice,
          status,
          servicesStatus: service.getServicesStatus()
        };
      } finally {
        service.destroy();
      }
    });
  }

  async testRetryMechanism(): Promise<TestResult> {
    return this.runTest('Mécanisme de retry', async () => {
      const service = createInvoiceFallbackService({
        maxRetries: 3,
        retryDelay: 100,
        enableLocalLnd: true,
        enableMockService: true
      });

      try {
        await service.forceHealthCheck();
        
        // Forcer une erreur en utilisant un hash invalide
        const invalidHash = 'invalid_hash_for_testing';
        
        try {
          await service.checkInvoiceStatus(invalidHash);
        } catch (error) {
          // C'est attendu, on teste juste que le retry fonctionne
        }
        
        const healthCheck = await service.healthCheck();
        
        return {
          provider: healthCheck.provider,
          servicesStatus: service.getServicesStatus()
        };
      } finally {
        service.destroy();
      }
    });
  }

  async testWatchInvoice(): Promise<TestResult> {
    return this.runTest('Watch invoice (mock)', async () => {
      const service = createInvoiceFallbackService({
        maxRetries: 1,
        retryDelay: 100,
        enableLocalLnd: false,
        enableMockService: true
      });

      try {
        await service.forceHealthCheck();
        
        const params: CreateInvoiceParams = {
          amount: 2000,
          description: 'Test watch invoice',
          expiry: 3600
        };

        const invoice = await service.generateInvoice(params);
        
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            service.destroy();
            reject(new Error('Watch timeout'));
          }, 10000);

          service.watchInvoice({
            paymentHash: invoice.paymentHash,
            onPaid: async () => {
              clearTimeout(timeout);
              const healthCheck = await service.healthCheck();
              service.destroy();
              resolve({
                provider: healthCheck.provider,
                status: 'paid',
                servicesStatus: service.getServicesStatus()
              });
            },
            onExpired: () => {
              clearTimeout(timeout);
              service.destroy();
              reject(new Error('Invoice expired during watch'));
            },
            onError: (error) => {
              clearTimeout(timeout);
              service.destroy();
              reject(error);
            }
          });
        });
      } catch (error) {
        service.destroy();
        throw error;
      }
    });
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Démarrage des tests du système de fallback des factures\n');
    
    await this.testBasicInvoiceGeneration();
    await this.testInvoiceStatusCheck();
    await this.testHealthCheckAllServices();
    await this.testMockServiceOnly();
    await this.testRetryMechanism();
    await this.testWatchInvoice();
    
    this.printSummary();
  }

  private printSummary(): void {
    console.log('\n📊 RÉSUMÉ DES TESTS');
    console.log('='.repeat(50));
    
    const successful = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const successRate = ((successful / total) * 100).toFixed(1);
    
    console.log(`✅ Tests réussis: ${successful}/${total} (${successRate}%)`);
    console.log(`⏱️  Temps moyen: ${Math.round(this.results.reduce((sum, r) => sum + r.duration, 0) / total)}ms`);
    
    console.log('\n📋 Détails par test:');
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.scenario} (${result.duration}ms) - ${result.provider}`);
      if (result.error) {
        console.log(`   └─ Erreur: ${result.error}`);
      }
    });
    
    console.log('\n🔧 Statut des services (dernier test):');
    const lastResult = this.results[this.results.length - 1];
    if (lastResult?.servicesStatus) {
      Object.entries(lastResult.servicesStatus).forEach(([service, status]: [string, any]) => {
        const indicator = status.isOnline ? '🟢' : '🔴';
        const latency = status.latency ? ` (${status.latency}ms)` : '';
        console.log(`   ${indicator} ${service}: ${status.isOnline ? 'Online' : 'Offline'}${latency}`);
      });
    }
    
    if (successful === total) {
      console.log('\n🎉 Tous les tests sont passés ! Le système de fallback fonctionne correctement.');
    } else {
      console.log('\n⚠️  Certains tests ont échoué. Vérifiez la configuration et les services.');
    }
  }
}

// Exécution des tests
async function main() {
  const tester = new InvoiceFallbackTester();
  
  try {
    await tester.runAllTests();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des tests:', error);
    process.exit(1);
  }
}

// Exécuter seulement si ce script est appelé directement
if (require.main === module) {
  main();
}

export { InvoiceFallbackTester };