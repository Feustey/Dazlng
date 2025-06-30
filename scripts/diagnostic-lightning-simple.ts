#!/usr/bin/env tsx

/**
 * Script de diagnostic Lightning simplifié
 * Teste les services Lightning sans dépendances Supabase
 */

import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';
import { createLightningService } from '../lib/services/lightning-service';

interface DiagnosticResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: any;
  fix?: string;
}

class SimpleLightningDiagnostic {
  private results: DiagnosticResult[] = [];
  private environment: 'development' | 'production' | 'unknown';

  constructor() {
    this.environment = (process.env.NODE_ENV as any) || 'unknown';
  }

  private addResult(result: DiagnosticResult): void {
    this.results.push(result);
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${result.test}: ${result.message}`);
    if (result.details) {
      console.log(`   Détails: ${JSON.stringify(result.details, null, 2)}`);
    }
    if (result.fix) {
      console.log(`   🔧 Solution: ${result.fix}`);
    }
  }

  async runEnvironmentCheck(): Promise<void> {
    console.log('\n🔧 DIAGNOSTIC ENVIRONNEMENT');
    console.log('============================');

    // Vérification de l'environnement
    this.addResult({
      test: 'Environnement',
      status: 'PASS',
      message: `Environnement détecté: ${this.environment}`,
      details: { NODE_ENV: process.env.NODE_ENV }
    });

    // Vérification des variables d'environnement Lightning
    const lightningEnvVars = [
      'LND_TLS_CERT',
      'LND_ADMIN_MACAROON',
      'LND_SOCKET',
      'DAZNODE_WALLET_SECRET'
    ];

    for (const envVar of lightningEnvVars) {
      const value = process.env[envVar];
      if (!value) {
        this.addResult({
          test: `Variable ${envVar}`,
          status: 'FAIL',
          message: `Variable d'environnement manquante`,
          fix: `Configurer ${envVar} dans les variables d'environnement`
        });
      } else {
        const isSecret = envVar.includes('SECRET') || envVar.includes('MACAROON') || envVar.includes('CERT');
        this.addResult({
          test: `Variable ${envVar}`,
          status: 'PASS',
          message: `Configurée${isSecret ? ' (masquée)' : ''}`,
          details: isSecret ? { length: value.length } : { value }
        });
      }
    }
  }

  async runDazNodeLightningTest(): Promise<void> {
    console.log('\n⚡ TEST SERVICE DAZNODE LIGHTNING');
    console.log('==================================');

    try {
      const daznodeService = createDazNodeLightningService();

      // Test de santé
      const health = await daznodeService.healthCheck();
      this.addResult({
        test: 'DazNode Lightning Service',
        status: health.isOnline ? 'PASS' : 'FAIL',
        message: `Service ${health.isOnline ? 'opérationnel' : 'indisponible'}`,
        details: { provider: health.provider, isOnline: health.isOnline }
      });

      if (health.isOnline) {
        // Test de création de facture
        const testParams = {
          amount: 1000,
          description: 'Test diagnostic DazNode',
          expiry: 3600
        };

        const startTime = Date.now();
        const invoice = await daznodeService.generateInvoice(testParams);
        const duration = Date.now() - startTime;

        this.addResult({
          test: 'Création facture DazNode',
          status: 'PASS',
          message: `Facture créée en ${duration}ms`,
          details: {
            amount: invoice.amount,
            paymentHash: invoice.paymentHash,
            provider: 'daznode'
          }
        });

        // Test de vérification
        const status = await daznodeService.checkInvoiceStatus(invoice.paymentHash);
        this.addResult({
          test: 'Vérification statut DazNode',
          status: 'PASS',
          message: `Statut vérifié: ${status.status}`,
          details: { status: status.status, amount: status.amount }
        });
      }
    } catch (error) {
      this.addResult({
        test: 'DazNode Lightning Service',
        status: 'FAIL',
        message: 'Erreur lors du test',
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        fix: 'Vérifier la configuration DazNode et les variables d\'environnement'
      });
    }
  }

  async runLocalLightningTest(): Promise<void> {
    console.log('\n🏠 TEST SERVICE LIGHTNING LOCAL');
    console.log('===============================');

    try {
      const localService = createLightningService();

      // Test de santé
      const health = await localService.healthCheck();
      this.addResult({
        test: 'Local Lightning Service',
        status: health.isOnline ? 'PASS' : 'FAIL',
        message: `Service ${health.isOnline ? 'opérationnel' : 'indisponible'}`,
        details: { provider: health.provider, isOnline: health.isOnline }
      });

      if (health.isOnline) {
        // Test de création de facture
        const testParams = {
          amount: 1000,
          description: 'Test diagnostic local',
          expiry: 3600
        };

        const startTime = Date.now();
        const invoice = await localService.generateInvoice(testParams);
        const duration = Date.now() - startTime;

        this.addResult({
          test: 'Création facture locale',
          status: 'PASS',
          message: `Facture créée en ${duration}ms`,
          details: {
            amount: invoice.amount,
            paymentHash: invoice.paymentHash,
            provider: 'local'
          }
        });

        // Test de vérification
        const status = await localService.checkInvoiceStatus(invoice.paymentHash);
        this.addResult({
          test: 'Vérification statut local',
          status: 'PASS',
          message: `Statut vérifié: ${status.status}`,
          details: { status: status.status, amount: status.amount }
        });
      }
    } catch (error) {
      this.addResult({
        test: 'Local Lightning Service',
        status: 'FAIL',
        message: 'Erreur lors du test',
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        fix: 'Vérifier la configuration LND locale et les variables d\'environnement'
      });
    }
  }

  async runNetworkConnectivityTest(): Promise<void> {
    console.log('\n🌐 DIAGNOSTIC CONNECTIVITÉ RÉSEAU');
    console.log('==================================');

    const endpoints = [
      { name: 'Lightning Network', url: 'https://lightning.network' },
      { name: 'Alby Relay', url: 'https://relay.getalby.com' }
    ];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(endpoint.url, {
          method: 'GET',
          headers: { 'User-Agent': 'DazNode-Diagnostic/1.0' }
        });
        const duration = Date.now() - startTime;

        this.addResult({
          test: `Connectivité ${endpoint.name}`,
          status: response.ok ? 'PASS' : 'WARNING',
          message: `Connecté en ${duration}ms (HTTP ${response.status})`,
          details: { url: endpoint.url, latency: duration, status: response.status }
        });
      } catch (error) {
        this.addResult({
          test: `Connectivité ${endpoint.name}`,
          status: 'FAIL',
          message: 'Connexion échouée',
          details: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
          fix: 'Vérifier la connectivité réseau et les pare-feu'
        });
      }
    }
  }

  generateReport(): void {
    console.log('\n📊 RAPPORT DE DIAGNOSTIC');
    console.log('========================');
    
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARNING').length;

    console.log(`Total des tests: ${total}`);
    console.log(`✅ Réussis: ${passed}`);
    console.log(`❌ Échecs: ${failed}`);
    console.log(`⚠️  Avertissements: ${warnings}`);

    if (failed > 0) {
      console.log('\n🚨 PROBLÈMES CRITIQUES DÉTECTÉS:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          console.log(`   • ${result.test}: ${result.message}`);
          if (result.fix) {
            console.log(`     Solution: ${result.fix}`);
          }
        });
    }

    if (warnings > 0) {
      console.log('\n⚠️  AVERTISSEMENTS:');
      this.results
        .filter(r => r.status === 'WARNING')
        .forEach(result => {
          console.log(`   • ${result.test}: ${result.message}`);
        });
    }

    if (failed === 0) {
      console.log('\n🎉 SYSTÈME LIGHTNING OPÉRATIONNEL !');
    } else {
      console.log('\n🔧 ACTIONS REQUISES:');
      console.log('1. Configurer les variables d\'environnement manquantes');
      console.log('2. Vérifier la connectivité réseau');
      console.log('3. Redémarrer les services si nécessaire');
      console.log('4. Relancer ce diagnostic après correction');
    }
  }

  async runFullDiagnostic(): Promise<void> {
    console.log('🔍 DIAGNOSTIC LIGHTNING SIMPLIFIÉ');
    console.log('==================================');
    console.log(`Date: ${new Date().toISOString()}`);
    console.log(`Environnement: ${this.environment}`);

    await this.runEnvironmentCheck();
    await this.runDazNodeLightningTest();
    await this.runLocalLightningTest();
    await this.runNetworkConnectivityTest();

    this.generateReport();
  }
}

// Exécution du diagnostic
async function main() {
  const diagnostic = new SimpleLightningDiagnostic();
  await diagnostic.runFullDiagnostic();
  process.exit(0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur fatale lors du diagnostic:', error);
    process.exit(1);
  });
} 