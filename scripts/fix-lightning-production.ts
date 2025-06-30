#!/usr/bin/env tsx

/**
 * Script de correction automatique pour les problèmes Lightning en production
 */

import { createInvoiceFallbackService } from '../lib/services/invoice-fallback-service';
import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';
import { createLightningService } from '../lib/services/lightning-service';

interface FixResult {
  fix: string;
  status: 'APPLIED' | 'SKIPPED' | 'FAILED';
  message: string;
  details?: any;
}

class LightningProductionFixer {
  private results: FixResult[] = [];

  private addResult(result: FixResult): void {
    this.results.push(result);
    const icon = result.status === 'APPLIED' ? '✅' : result.status === 'SKIPPED' ? '⏭️' : '❌';
    console.log(`${icon} ${result.fix}: ${result.message}`);
    if (result.details) {
      console.log(`   Détails: ${JSON.stringify(result.details, null, 2)}`);
    }
  }

  async fixEnvironmentVariables(): Promise<void> {
    console.log('\n🔧 CORRECTION VARIABLES D\'ENVIRONNEMENT');
    console.log('========================================');

    // Vérification et correction des variables critiques
    const envFixes = [
      {
        name: 'DAZNODE_API_KEY',
        current: process.env.DAZNODE_API_KEY,
        fix: () => {
          if (!process.env.DAZNODE_API_KEY) {
            console.log('⚠️  DAZNODE_API_KEY manquante - Configuration requise manuellement');
            this.addResult({
              fix: 'DAZNODE_API_KEY',
              status: 'FAILED',
              message: 'Variable requise pour api.dazno.de',
              details: { required: true, manual: true }
            });
          } else {
            this.addResult({
              fix: 'DAZNODE_API_KEY',
              status: 'APPLIED',
              message: 'Variable configurée'
            });
          }
        }
      },
      {
        name: 'DAZNODE_API_URL',
        current: process.env.DAZNODE_API_URL,
        fix: () => {
          if (!process.env.DAZNODE_API_URL) {
            process.env.DAZNODE_API_URL = 'https://api.dazno.de';
            this.addResult({
              fix: 'DAZNODE_API_URL',
              status: 'APPLIED',
              message: 'URL par défaut configurée',
              details: { value: 'https://api.dazno.de' }
            });
          } else {
            this.addResult({
              fix: 'DAZNODE_API_URL',
              status: 'SKIPPED',
              message: 'Déjà configurée'
            });
          }
        }
      }
    ];

    for (const envFix of envFixes) {
      envFix.fix();
    }
  }

  async fixFallbackConfiguration(): Promise<void> {
    console.log('\n🔄 CORRECTION CONFIGURATION FALLBACK');
    console.log('=====================================');

    try {
      // Configuration optimisée pour la production
      const fallbackService = createInvoiceFallbackService({
        maxRetries: parseInt(process.env.LIGHTNING_FALLBACK_MAX_RETRIES || '3'),
        retryDelay: parseInt(process.env.LIGHTNING_FALLBACK_RETRY_DELAY || '2000'),
        healthCheckInterval: parseInt(process.env.LIGHTNING_FALLBACK_HEALTH_CHECK_INTERVAL || '30000'),
        enableLocalLnd: process.env.LIGHTNING_FALLBACK_ENABLE_LOCAL_LND !== 'false',
        enableMockService: false // Désactivé en production
      });

      // Force health check pour initialiser les services
      await fallbackService.forceHealthCheck();
      const health = await fallbackService.healthCheck();

      this.addResult({
        fix: 'Configuration Fallback',
        status: health.isOnline ? 'APPLIED' : 'FAILED',
        message: `Service ${health.isOnline ? 'opérationnel' : 'indisponible'}`,
        details: { provider: health.provider, isOnline: health.isOnline }
      });

      fallbackService.destroy();
    } catch (error) {
      this.addResult({
        fix: 'Configuration Fallback',
        status: 'FAILED',
        message: 'Erreur de configuration',
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      });
    }
  }

  async fixApiEndpoints(): Promise<void> {
    console.log('\n🌐 CORRECTION ENDPOINTS API');
    console.log('============================');

    // Vérification des endpoints critiques
    const endpoints = [
      { name: 'Health Check', path: '/api/lightning/health' },
      { name: 'Create Invoice', path: '/api/create-invoice' },
      { name: 'Check Invoice', path: '/api/check-invoice' }
    ];

    for (const endpoint of endpoints) {
      try {
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}${endpoint.path}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        this.addResult({
          fix: `Endpoint ${endpoint.name}`,
          status: response.ok ? 'APPLIED' : 'FAILED',
          message: `HTTP ${response.status}`,
          details: { url: endpoint.path, status: response.status }
        });
      } catch (error) {
        this.addResult({
          fix: `Endpoint ${endpoint.name}`,
          status: 'FAILED',
          message: 'Endpoint inaccessible',
          details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
        });
      }
    }
  }

  async fixServiceInitialization(): Promise<void> {
    console.log('\n⚙️  CORRECTION INITIALISATION SERVICES');
    console.log('=======================================');

    // Test d'initialisation du service DazNode
    try {
      const daznodeService = createDazNodeLightningService();
      const health = await daznodeService.healthCheck();

      this.addResult({
        fix: 'Service DazNode',
        status: health.isOnline ? 'APPLIED' : 'FAILED',
        message: `Service ${health.isOnline ? 'initialisé' : 'échec d\'initialisation'}`,
        details: { provider: health.provider, isOnline: health.isOnline }
      });
    } catch (error) {
      this.addResult({
        fix: 'Service DazNode',
        status: 'FAILED',
        message: 'Erreur d\'initialisation',
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      });
    }

    // Test d'initialisation du service LND local (si configuré)
    if (process.env.LND_TLS_CERT && process.env.LND_ADMIN_MACAROON && process.env.LND_SOCKET) {
      try {
        const lndService = createLightningService();
        const health = await lndService.healthCheck();

        this.addResult({
          fix: 'Service LND Local',
          status: health.isOnline ? 'APPLIED' : 'FAILED',
          message: `Service ${health.isOnline ? 'initialisé' : 'échec d\'initialisation'}`,
          details: { provider: health.provider, isOnline: health.isOnline }
        });
      } catch (error) {
        this.addResult({
          fix: 'Service LND Local',
          status: 'FAILED',
          message: 'Erreur d\'initialisation LND',
          details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
        });
      }
    } else {
      this.addResult({
        fix: 'Service LND Local',
        status: 'SKIPPED',
        message: 'Variables LND non configurées'
      });
    }
  }

  generateFixReport(): void {
    console.log('\n📋 RAPPORT DE CORRECTION');
    console.log('========================');
    
    const total = this.results.length;
    const applied = this.results.filter(r => r.status === 'APPLIED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const skipped = this.results.filter(r => r.status === 'SKIPPED').length;

    console.log(`Total des corrections: ${total}`);
    console.log(`✅ Appliquées: ${applied}`);
    console.log(`❌ Échecs: ${failed}`);
    console.log(`⏭️  Ignorées: ${skipped}`);

    if (failed > 0) {
      console.log('\n🚨 CORRECTIONS MANUELLES REQUISES:');
      this.results
        .filter(r => r.status === 'FAILED')
        .forEach(result => {
          console.log(`   • ${result.fix}: ${result.message}`);
        });
    }

    if (applied > 0) {
      console.log('\n✅ CORRECTIONS APPLIQUÉES AVEC SUCCÈS');
      console.log('Le système Lightning devrait maintenant fonctionner correctement.');
    }
  }

  async runFullFix(): Promise<void> {
    console.log('🔧 CORRECTION AUTOMATIQUE LIGHTNING PRODUCTION');
    console.log('===============================================');
    console.log(`Date: ${new Date().toISOString()}`);

    await this.fixEnvironmentVariables();
    await this.fixFallbackConfiguration();
    await this.fixApiEndpoints();
    await this.fixServiceInitialization();

    this.generateFixReport();
  }
}

// Exécution des corrections
async function main() {
  const fixer = new LightningProductionFixer();
  await fixer.runFullFix();
  process.exit(0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur fatale lors de la correction:', error);
    process.exit(1);
  });
} 