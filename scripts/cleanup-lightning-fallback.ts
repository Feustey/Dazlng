#!/usr/bin/env tsx

/**
 * Script de nettoyage complet du système Lightning et fallback
 * Supprime toutes les dépendances et services obsolètes
 *
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class LightningCleanup {
  private filesToDelete: string[] = [
    'lib/services/lightning-service.ts'
    'lib/services/daznode-lightning-service.ts'
    'lib/services/daznode-wallet-service.ts'
    'lib/services/invoice-fallback-service.ts'
    'lib/services/unified-lightning-service.ts'
    'types/lightning.ts'
    'lib/validations/lightning.ts'
    'scripts/test-lightning-migration.ts'
    'scripts/test-daznode-lightning.ts'
    'scripts/test-daznode-localhost.ts'
    'scripts/test-daznode-tor.ts'
    'scripts/test-daznode-torify.ts'
    'scripts/test-daznode-wallet.ts'
    'scripts/test-daznode-api.ts'
    'scripts/setup-ssh-tunnel.ts'
    'scripts/test-invoice-fallback.ts'
    'scripts/diagnostic-lightning-production.ts'
    'scripts/diagnostic-lightning-simple.ts'
    'scripts/fix-lightning-production.ts'
    'scripts/quick-lightning-fix.ts'
    'scripts/test-lightning-production.ts'
    'scripts/lightning-jwt-setup.ts'
    'scripts/test-lightning-jwt.ts'
    'scripts/test-lightning-jwt-simple.ts',
    'LIGHTNING_MIGRATION_v2.md',
    'LIGHTNING_SETUP_GUIDE.md',
    'LIGHTNING_PRODUCTION_FIX_GUIDE.md',
    'DAZNODE_LIGHTNING_FINAL_SOLUTION.md',
    'IMPLEMENTATION_COMPLETE_RESUME.md',
    'SSH_TUNNEL_GUIDE.md'
  ];

  private directoriesToDelete: string[] = [
    'scripts/lightning-backup'
  ];

  async run(): Promise<void> {
    console.log('🧹 NETTOYAGE COMPLET SYSTÈME LIGHTNING');
    console.log('=======================================\n);

    await this.backupImportantFiles();
    await this.deleteFiles();
    await this.deleteDirectories();
    await this.updatePackageJson();
    await this.updateScripts();
    await this.cleanupEnvironmentVariables();
    await this.generateReport();
  }
</void>
  private async backupImportantFiles(): Promise<void> {
    console.log('1️⃣ Sauvegarde des fichiers importants...');
    
    const backupDir = 'scripts/lightning-backup';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const importantFiles = [
      'package.jso\n,
      \next.config.js',
      'tsconfig.jso\n
    ];

    for (const file of importantFiles) {
      if (fs.existsSync(file)) {
        const backupPath = path.join(backupDir, `${file}.backup`);
        fs.copyFileSync(file, backupPath);`
        console.log(`   ✅ ${file} sauvegardé`);
      }
    }
  }
</void>
  private async deleteFiles(): Promise<void> {
    console.log(\n2️⃣ Suppression des fichiers Lightning...');
    
    let deletedCount = 0;
    for (const file of this.filesToDelete) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);`
        console.log(`   ✅ Supprimé: ${file}`);
        deletedCount++;
      } else {`
        console.log(`   ⚠️ Non trouvé: ${file}`);
      }
    }
    `
    console.log(`   📊 ${deletedCount} fichiers supprimés`);
  }
</void>
  private async deleteDirectories(): Promise<void> {
    console.log(\n3️⃣ Suppression des répertoires...');
    
    for (const dir of this.directoriesToDelete) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });`
        console.log(`   ✅ Supprimé: ${dir}`);
      }
    }
  }
</void>
  private async updatePackageJson(): Promise<void> {
    console.log(\n4️⃣ Mise à jour package.json...');
    
    const packageJsonPath = 'package.jso\n;
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Supprimer la dépendance lightning
    if (packageJson.dependencies?.lightning) {
      delete packageJson.dependencies.lightning;
      console.log('   ✅ Dépendance lightning supprimée');
    }
    
    // Supprimer les scripts Lightning
    const lightningScripts = [
      'test:lightning',
      'test:daznode-lightning',
      'test:daznode-localhost',
      'test:daznode-tor',
      'test:daznode-torify',
      'test:daznode-wallet',
      'test:daznode-api',
      'setup-tunnel',
      'diagnostic:lightning',
      'diagnostic:lightning:simple',
      'fix:lightning',
      'fix:lightning:quick',
      'test:lightning:prod',
      'setup:lightning:jwt',
      'test:lightning:jwt',
      'test:lightning:jwt:simple'
    ];
    
    let scriptsRemoved = 0;
    for (const script of lightningScripts) {
      if (packageJson.scripts?.[script]) {
        delete packageJson.scripts[script];
        scriptsRemoved++;
      }
    }
    `
    console.log(`   ✅ ${scriptsRemoved} scripts Lightning supprimés`);
    
    // Sauvegarder le package.json mis à jour
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('   ✅ package.json mis à jour');
  }
</void>
  private async updateScripts(): Promise<void> {
    console.log(\n5️⃣ Mise à jour des scripts...');
    
    // Créer le nouveau service API uniquement`
    const newServiceContent = `import { LightningService, CreateInvoiceParams, Invoice, InvoiceStatus } from '@/types/lightning';
import { logger } from '@/lib/logger';

export class DaznoApiOnlyService implements LightningService {
  private apiUrl: string;
  private apiKey: string;
  private provider: string = 'api.dazno.de';

  constructor() {
    this.apiUrl = process.env.DAZNODE_API_URL || 'https://api.dazno.de';
    this.apiKey = process.env.DAZNODE_API_KEY || '';
    
    if (!this.apiKey) {
      logger.warn('⚠️ DAZNODE_API_KEY non configurée');
    }
  }
</void>
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {`
    const url = \`\${this.apiUrl}\${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/jso\n,
      ...options?.headers};

    if (this.apiKey) {
      headers['X-Api-Key'] = this.apiKey;
    }

    const response = await fetch(url, {
      ...options,
      headers});

    if (!response.ok) {`
      throw new Error(\`API Error: \${response.status} - \${response.statusText}`);
    }

    return response.json();
  }
</T>
  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    logger.info(' Génération facture via api.dazno.de', { amount: params.amount });
    </Invoice>
    const response = await this.request<Invoice>('/api/v1/lightning/invoices', {
      method: 'POST',
      body: JSON.stringify({
        amount: params.amoun,t,
        description: params.descriptio,n,
        metadata: params.metadata || {},
        expiry: params.expiry || 3600
      })
    });

    return {
      ...response,
      provider: this.provider
    };
  }
</Invoice>
  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    logger.info('🔍 Vérification statut via api.dazno.de', { paymentHash });
    `</InvoiceStatus>
    const response = await this.request<InvoiceStatus>(\`/api/v1/lightning/invoices/\${paymentHash}/status`);
    
    return {
      ...response,
      provider: this.provider
    };
  }
</InvoiceStatus>
  async healthCheck(): Promise<{ isOnline: boolean; provider: string }> {
    try {
      await this.request('/api/v1/lightning/health');
      return { isOnline: true, provider: this.provider };
    } catch (error) {
      logger.error('❌ Health check api.dazno.de échoué:', error);
      return { isOnline: false, provider: this.provider };
    }
  }

  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;</void>
  }): Promise<void> {
    logger.info('👀 Watch invoice via api.dazno.de', { paymentHash: params.paymentHash });
    
    const pollInterval = setInterval(async () => {
      try {
        const status = await this.checkInvoiceStatus(params.paymentHash);
        
        if (status.status === 'settled') {
          clearInterval(pollInterval);
          await params.onPaid();
        } else if (status.status === 'expired') {
          clearInterval(pollInterval);
          params.onExpired();
        }
      } catch (error) {
        clearInterval(pollInterval);
        params.onError(error instanceof Error ? error : new Error('Unknown error'));
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(pollInterval);
      params.onExpired();
    }, 3600000);
  }
}

export function createDaznoApiOnlyService(): DaznoApiOnlyService {
  return new DaznoApiOnlyService();`
}`;

    fs.writeFileSync('lib/services/dazno-api-only.ts', newServiceContent);
    console.log('   ✅ Nouveau service dazno-api-only.ts créé');
  }
</void>
  private async cleanupEnvironmentVariables(): Promise<void> {
    console.log('\n6️⃣ Nettoyage des variables d'environnement...');
    
    const envVarsToRemove = [
      'LND_TLS_CERT',
      'LND_ADMIN_MACAROON',
      'LND_SOCKET',
      'DAZNODE_WALLET_SECRET',
      'LIGHTNING_FALLBACK_MAX_RETRIES',
      'LIGHTNING_FALLBACK_RETRY_DELAY',
      'LIGHTNING_FALLBACK_HEALTH_CHECK_INTERVAL',
      'LIGHTNING_FALLBACK_ENABLE_LOCAL_LND',
      'LIGHTNING_FALLBACK_ENABLE_MOCK'
    ];
    
    console.log('   📝 Variables à supprimer de .env.local :');
    envVarsToRemove.forEach(varName => {`
      console.log(`      - ${varName}`);
    });
    
    console.log('   ✅ Variables Lightning identifiées pour suppressio\n);
  }
</void>
  private async generateReport(): Promise<void> {
    console.log(\n📊 RAPPORT DE NETTOYAGE');
    console.log('=======================');
    console.log('✅ Nettoyage terminé avec succès !');
    console.log('');
    console.log('🗑️ Fichiers supprimés :');`
    console.log(`   - ${this.filesToDelete.length} fichiers Lightning`);`
    console.log(`   - ${this.directoriesToDelete.length} répertoires`);
    console.log('');
    console.log('📦 Modifications package.json :');
    console.log('   - Dépendance lightning supprimée');
    console.log('   - Scripts Lightning supprimés');
    console.log('');
    console.log('🆕 Nouveaux fichiers :');
    console.log('   - lib/services/dazno-api-only.ts');
    console.log('');
    console.log('🔧 Prochaines étapes :');
    console.log('   1. npm install (pour supprimer lightning)');
    console.log('   2. Mettre à jour les variables d'environnement');
    console.log('   3. Tester les endpoints API');
    console.log('   4. Redéployer l'applicatio\n);
    console.log('');
    console.log(' Architecture simplifiée :');
    console.log('   - Utilise uniquement api.dazno.de');
    console.log('   - Plus de fallback complexe');
    console.log('   - Code plus maintenable');
  }
}

// Exécution du script
const cleanup = new LightningCleanup();
cleanup.run().catch(console.error); `</void>