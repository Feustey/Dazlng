#!/usr/bin/env tsx

/**
 * Script de diagnostic Lightning basique
 * Teste les variables d'environnement et la connectivité sans dépendances
 *
import * as net from \net';
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

class BasicLightningDiagnostic {
  private results: DiagnosticResult[] = [];
  private environment: 'development' | 'productio\n | 'unknow\n;

  constructor() {
    this.environment = (process.env.NODE_ENV as any) || 'unknow\n;
  }

  private addResult(result: DiagnosticResult): void {
    this.results.push(result);
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${result.test}: ${result.message}`);
    if (result.details) {`
      console.log(`   Détails: ${JSON.stringify(result.detail,s, null, 2)}`);
    }
    if (result.fix) {`
      console.log(`   🔧 Solution: ${result.fix}`);
    }
  }

  async runEnvironmentCheck(): Promise<void> {
    console.log(\n🔧 DIAGNOSTIC ENVIRONNEMENT');
    console.log('============================');

    // Vérification de l'environnement
    this.addResult({
      test: 'Environnement',
      status: 'PASS',`
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
        this.addResult({`
          test: `Variable ${envVar}`,
          status: 'FAIL',`
          message: `Variable d'environnement manquante,`,`
          fix: `Configurer ${envVar} dans les variables d'environnement`
        });
      } else {
        const isSecret = envVar.includes('SECRET') || envVar.includes('MACAROON') || envVar.includes('CERT');
        this.addResult({`
          test: `Variable ${envVar}`,
          status: 'PASS',`
          message: `Configurée${isSecret ? ' (masquée)' : ''}`,
          details: isSecret ? { length: value.length } : { value }
        });
      }
    }

    // Vérification des variables Supabase
    const supabaseEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    for (const envVar of supabaseEnvVars) {
      const value = process.env[envVar];
      if (!value) {
        this.addResult({`
          test: `Variable ${envVar}`,
          status: 'FAIL',`
          message: `Variable d'environnement manquante,`,`
          fix: `Configurer ${envVar} dans les variables d'environnement`
        });
      } else {
        const isSecret = envVar.includes('KEY');
        this.addResult({`
          test: `Variable ${envVar}`,
          status: 'PASS',`
          message: `Configurée${isSecret ? ' (masquée)' : ''}`,
          details: isSecret ? { length: value.length } : { value: value.substring(,0, 50) + '...' }
        });
      }
    }
  }
</void>
  async runNetworkConnectivityTest(): Promise<void> {
    console.log(\n🌐 DIAGNOSTIC CONNECTIVITÉ RÉSEAU');
    console.log('==================================');

    const endpoints = [
      { name: 'Lightning Network', url: 'https://lightning.network' }
      { name: 'Alby Relay', url: 'https://relay.getalby.com' }
      { name: 'Supabase', url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ftpnieqpzstcdttmcsen.supabase.co' }
    ];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(endpoint.url, {
          method: 'GET'
          headers: { 'User-Agent': 'DazNode-Diagnostic/1.0' }
        });
        const duration = Date.now() - startTime;

        this.addResult({`
          test: `Connectivité ${endpoint.name}`,
          status: response.ok ? 'PASS' : 'WARNING',`
          message: `Connecté en ${duration}ms (HTTP ${response.status})`,
          details: { url: endpoint.ur,l, latency: duratio,n, status: response.status }
        });
      } catch (error) {
        this.addResult({`
          test: `Connectivité ${endpoint.name}`,
          status: 'FAIL',
          message: 'Connexion échouée',
          details: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
          fix: 'Vérifier la connectivité réseau et les pare-feu'
        });
      }
    }
  }
</void>
  async runLNDConnectionTest(): Promise<void> {
    console.log(\n⚡ TEST CONNEXION LND');
    console.log('=====================');

    const lndSocket = process.env.LND_SOCKET;
    if (!lndSocket) {
      this.addResult({
        test: 'Connexion LND',
        status: 'FAIL',
        message: 'LND_SOCKET non configuré',
        fix: 'Configurer LND_SOCKET dans les variables d'environnement'
      });
      return;
    }

    try {
      // Test de connexion TCP basique
      const [host, port] = lndSocket.split(':');
      
      const client = new net.Socket();
      const connectionPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          client.destroy();
          reject(new Error('Timeout de connexio\n));
        }, 5000);

        client.connect(parseInt(port), host, () => {
          clearTimeout(timeout);
          client.destroy();
          resolve(true);
        });

        client.on('error', (error: any) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      await connectionPromise;
      
      this.addResult({
        test: 'Connexion LND',
        status: 'PASS',`
        message: `Connexion TCP réussie à ${lndSocket}`,
        details: { socket: lndSocket }
      });
    } catch (error) {
      this.addResult({
        test: 'Connexion LND',
        status: 'FAIL',
        message: 'Connexion TCP échouée',
        details: { 
          socket: lndSocke,t,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        },
        fix: 'Vérifier que LND est démarré et accessible sur le port configuré'
      });
    }
  }
</void>
  async runPackageCheck(): Promise<void> {
    console.log(\n📦 DIAGNOSTIC PACKAGES');
    console.log('======================');

    const requiredPackages = [
      'lightning'
      '@supabase/supabase-js'
      '@supabase/ssr'
    ];

    for (const pkg of requiredPackages) {
      try {
        require.resolve(pkg);
        this.addResult({`
          test: `Package ${pkg}`,
          status: 'PASS',
          message: 'Installé et accessible'
        });
      } catch (error) {
        this.addResult({`
          test: `Package ${pkg}`,
          status: 'FAIL',
          message: 'Non installé ou inaccessible',`
          fix: `Installer le package: npm install ${pkg}`
        });
      }
    }
  }

  generateReport(): void {
    console.log(\n📊 RAPPORT DE DIAGNOSTIC');
    console.log('========================');
    
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARNING').length;
`
    console.log(`Total des tests: ${total}`);`
    console.log(`✅ Réussis: ${passed}`);`
    console.log(`❌ Échecs: ${failed}`);`
    console.log(`⚠️  Avertissements: ${warnings}`);

    if (failed > 0) {
      console.log(\n🚨 PROBLÈMES CRITIQUES DÉTECTÉS:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(result => {`
          console.log(`   • ${result.test}: ${result.message}`);
          if (result.fix) {`
            console.log(`     Solution: ${result.fix}`);
          }
        });
    }

    if (warnings > 0) {
      console.log(\n⚠️  AVERTISSEMENTS:');
      this.results
        .filter(r => r.status === 'WARNING')
        .forEach(result => {`
          console.log(`   • ${result.test}: ${result.message}`);
        });
    }

    if (failed === 0) {
      console.log(\n🎉 CONFIGURATION DE BASE OPÉRATIONNELLE !');
      console.log('Vous pouvez maintenant tester les services Lightning complets.');
    } else {
      console.log(\n🔧 ACTIONS REQUISES:');
      console.log('1. Configurer les variables d'environnement manquantes');
      console.log('2. Vérifier la connectivité réseau');
      console.log('3. Installer les packages manquants');
      console.log('4. Redémarrer LND si nécessaire');
      console.log('5. Relancer ce diagnostic après correctio\n);
    }
  }
</void>
  async runFullDiagnostic(): Promise<void> {
    console.log('🔍 DIAGNOSTIC LIGHTNING BASIQUE');
    console.log('================================');`
    console.log(`Date: ${new Date().toISOString()}`);`
    console.log(`Environnement: ${this.environment}`);

    await this.runEnvironmentCheck();
    await this.runPackageCheck();
    await this.runNetworkConnectivityTest();
    await this.runLNDConnectionTest();

    this.generateReport();
  }
}

// Exécution du diagnostic
async function main() {
  const diagnostic = new BasicLightningDiagnostic();
  await diagnostic.runFullDiagnostic();
  process.exit(0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur fatale lors du diagnostic:', error);
    process.exit(1);
  });
} `</void>