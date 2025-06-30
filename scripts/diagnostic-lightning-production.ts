#!/usr/bin/env tsx

/**
 * Script de diagnostic complet pour les factures Lightning en production
 * Utilise exclusivement l'API Dazno (api.dazno.de)
 */

import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

interface DiagnosticResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: any;
  fix?: string;
}

interface DaznoApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class DaznoLightningDiagnostic {
  private results: DiagnosticResult[] = [];
  private environment: 'development' | 'production' | 'unknown';
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.environment = (process.env.NODE_ENV as any) || 'unknown';
    this.apiUrl = process.env.DAZNODE_API_URL || 'https://api.dazno.de';
    this.apiKey = process.env.DAZNODE_API_KEY || '';
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

  private async makeDaznoRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'User-Agent': 'DazNode-Diagnostic/1.0',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Dazno erreur: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async runEnvironmentCheck(): Promise<void> {
    console.log('\n🔧 DIAGNOSTIC ENVIRONNEMENT DAZNO');
    console.log('==================================');

    // Vérification de l'environnement
    this.addResult({
      test: 'Environnement',
      status: 'PASS',
      message: `Environnement détecté: ${this.environment}`,
      details: { NODE_ENV: process.env.NODE_ENV }
    });

    // Vérification des variables d'environnement Dazno
    const daznoEnvVars = [
      'DAZNODE_API_URL',
      'DAZNODE_API_KEY'
    ];

    for (const envVar of daznoEnvVars) {
      const value = process.env[envVar];
      if (!value) {
        this.addResult({
          test: `Variable ${envVar}`,
          status: 'FAIL',
          message: `Variable d'environnement manquante`,
          fix: `Configurer ${envVar} dans les variables d'environnement`
        });
      } else {
        const isSecret = envVar.includes('KEY');
        this.addResult({
          test: `Variable ${envVar}`,
          status: 'PASS',
          message: `Configurée${isSecret ? ' (masquée)' : ''}`,
          details: isSecret ? { length: value.length } : { value }
        });
      }
    }

    // Vérification de la configuration API
    this.addResult({
      test: 'Configuration API Dazno',
      status: 'PASS',
      message: `API configurée: ${this.apiUrl}`,
      details: { apiUrl: this.apiUrl, hasApiKey: !!this.apiKey }
    });
  }

  async runDaznoHealthCheck(): Promise<void> {
    console.log('\n🏥 DIAGNOSTIC SANTÉ API DAZNO');
    console.log('==============================');

    try {
      const startTime = Date.now();
      const health = await this.makeDaznoRequest<DaznoApiResponse<{ status: string; timestamp: string }>>('/api/v1/lightning/health');
      const duration = Date.now() - startTime;

      this.addResult({
        test: 'API Dazno Health Check',
        status: health.success ? 'PASS' : 'FAIL',
        message: `API ${health.success ? 'opérationnelle' : 'indisponible'} en ${duration}ms`,
        details: { 
          success: health.success, 
          latency: duration,
          status: health.data?.status,
          timestamp: health.data?.timestamp
        }
      });
    } catch (error) {
      this.addResult({
        test: 'API Dazno Health Check',
        status: 'FAIL',
        message: 'Erreur lors du health check',
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        fix: 'Vérifier la connectivité réseau et la configuration API Dazno'
      });
    }
  }

  async runInvoiceCreationTest(): Promise<void> {
    console.log('\n💰 TEST CRÉATION DE FACTURE DAZNO');
    console.log('==================================');

    try {
      const testParams = {
        amount: 1000,
        description: 'Test diagnostic production Dazno',
        expiry: 3600,
        metadata: { 
          diagnostic: true, 
          timestamp: new Date().toISOString(),
          environment: this.environment
        }
      };

      const startTime = Date.now();
      const response = await this.makeDaznoRequest<DaznoApiResponse<{
        id: string;
        paymentRequest: string;
        paymentHash: string;
        amount: number;
        description: string;
        createdAt: string;
        expiresAt: string;
      }>>('/api/v1/lightning/invoice/create', {
        method: 'POST',
        body: JSON.stringify(testParams)
      });
      const duration = Date.now() - startTime;

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Réponse API invalide');
      }

      const invoice = response.data;

      this.addResult({
        test: 'Création de facture Dazno',
        status: 'PASS',
        message: `Facture créée en ${duration}ms`,
        details: {
          id: invoice.id,
          amount: invoice.amount,
          paymentHash: invoice.paymentHash,
          provider: 'dazno',
          latency: duration
        }
      });

      // Test de vérification du statut
      await this.runInvoiceStatusCheck(invoice.paymentHash);

    } catch (error) {
      this.addResult({
        test: 'Création de facture Dazno',
        status: 'FAIL',
        message: 'Échec de la création de facture',
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        fix: 'Vérifier la configuration API Dazno et les permissions'
      });
    }
  }

  async runInvoiceStatusCheck(paymentHash: string): Promise<void> {
    try {
      const startTime = Date.now();
      const response = await this.makeDaznoRequest<DaznoApiResponse<{
        status: string;
        amount: number;
        settledAt?: string;
        metadata?: Record<string, any>;
      }>>(`/api/v1/lightning/invoice/${paymentHash}/status`);
      const duration = Date.now() - startTime;

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Réponse API invalide');
      }

      this.addResult({
        test: 'Vérification statut facture Dazno',
        status: 'PASS',
        message: `Statut vérifié: ${response.data.status} en ${duration}ms`,
        details: { 
          status: response.data.status, 
          amount: response.data.amount,
          latency: duration
        }
      });
    } catch (error) {
      this.addResult({
        test: 'Vérification statut facture Dazno',
        status: 'FAIL',
        message: 'Échec de la vérification du statut',
        details: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      });
    }
  }

  async runNetworkConnectivityTest(): Promise<void> {
    console.log('\n🌐 DIAGNOSTIC CONNECTIVITÉ RÉSEAU');
    console.log('==================================');

    const endpoints = [
      { name: 'API Dazno', url: this.apiUrl },
      { name: 'Lightning Network', url: 'https://lightning.network' }
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

  async runApiEndpointsTest(): Promise<void> {
    console.log('\n🌐 DIAGNOSTIC ENDPOINTS API DAZNO');
    console.log('==================================');

    const endpoints = [
      { name: 'Health Check', url: '/api/v1/lightning/health', method: 'GET' },
      { name: 'Node Info', url: '/api/v1/node/info', method: 'GET' },
      { name: 'Network Stats', url: '/api/v1/lightning/network/stats', method: 'GET' }
    ];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await this.makeDaznoRequest<DaznoApiResponse<any>>(endpoint.url, {
          method: endpoint.method as any
        });
        const duration = Date.now() - startTime;

        this.addResult({
          test: `Endpoint ${endpoint.name}`,
          status: response.success ? 'PASS' : 'WARNING',
          message: `Endpoint ${response.success ? 'accessible' : 'erreur'} en ${duration}ms`,
          details: { 
            url: endpoint.url, 
            method: endpoint.method,
            latency: duration,
            success: response.success
          }
        });
      } catch (error) {
        this.addResult({
          test: `Endpoint ${endpoint.name}`,
          status: 'FAIL',
          message: 'Endpoint inaccessible',
          details: { 
            url: endpoint.url,
            error: error instanceof Error ? error.message : 'Erreur inconnue' 
          },
          fix: 'Vérifier les permissions API et la configuration'
        });
      }
    }
  }

  generateReport(): void {
    console.log('\n📊 RAPPORT DE DIAGNOSTIC DAZNO');
    console.log('===============================');
    
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
      console.log('\n🎉 API DAZNO OPÉRATIONNELLE !');
      console.log('Tous les services Lightning via Dazno sont fonctionnels.');
    } else {
      console.log('\n🔧 ACTIONS REQUISES:');
      console.log('1. Configurer les variables d\'environnement DAZNODE_API_*');
      console.log('2. Vérifier la connectivité réseau vers api.dazno.de');
      console.log('3. Vérifier les permissions API Dazno');
      console.log('4. Relancer ce diagnostic après correction');
    }
  }

  async runFullDiagnostic(): Promise<void> {
    console.log('🔍 DIAGNOSTIC COMPLET API DAZNO');
    console.log('===============================');
    console.log(`Date: ${new Date().toISOString()}`);
    console.log(`Environnement: ${this.environment}`);
    console.log(`API URL: ${this.apiUrl}`);

    await this.runEnvironmentCheck();
    await this.runNetworkConnectivityTest();
    await this.runDaznoHealthCheck();
    await this.runApiEndpointsTest();
    await this.runInvoiceCreationTest();

    this.generateReport();
  }
}

// Exécution du diagnostic
async function main() {
  const diagnostic = new DaznoLightningDiagnostic();
  await diagnostic.runFullDiagnostic();
  process.exit(0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur fatale lors du diagnostic:', error);
    process.exit(1);
  });
} 