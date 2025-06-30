#!/usr/bin/env tsx

/**
 * Script de correction rapide pour les factures Lightning
 * Configure automatiquement les variables d'environnement manquantes
 */

import * as fs from 'fs';
import * as path from 'path';

interface EnvFix {
  key: string;
  value: string;
  description: string;
  required: boolean;
}

class QuickLightningFix {
  private envFile: string;
  private fixes: EnvFix[] = [];

  constructor() {
    this.envFile = path.resolve(process.cwd(), '.env.local');
    this.initializeFixes();
  }

  private initializeFixes(): void {
    this.fixes = [
      {
        key: 'DAZNODE_API_URL',
        value: 'https://api.dazno.de',
        description: 'URL de l\'API DazNode',
        required: true
      },
      {
        key: 'LIGHTNING_FALLBACK_MAX_RETRIES',
        value: '3',
        description: 'Nombre maximum de tentatives de fallback',
        required: false
      },
      {
        key: 'LIGHTNING_FALLBACK_RETRY_DELAY',
        value: '2000',
        description: 'Délai entre les tentatives (ms)',
        required: false
      },
      {
        key: 'LIGHTNING_FALLBACK_ENABLE_LOCAL_LND',
        value: 'true',
        description: 'Activer le fallback LND local',
        required: false
      },
      {
        key: 'LIGHTNING_FALLBACK_ENABLE_MOCK',
        value: 'false',
        description: 'Activer le service mock (développement uniquement)',
        required: false
      }
    ];
  }

  private readEnvFile(): string {
    try {
      return fs.readFileSync(this.envFile, 'utf8');
    } catch (error) {
      return '';
    }
  }

  private writeEnvFile(content: string): void {
    fs.writeFileSync(this.envFile, content, 'utf8');
  }

  private addEnvVariable(key: string, value: string, description: string): void {
    const envContent = this.readEnvFile();
    const newLine = `# ${description}\n${key}=${value}\n`;
    
    if (!envContent.includes(`${key}=`)) {
      this.writeEnvFile(envContent + newLine);
      console.log(`✅ Ajouté: ${key}=${value}`);
    } else {
      console.log(`⏭️  Déjà configuré: ${key}`);
    }
  }

  async runQuickFix(): Promise<void> {
    console.log('🔧 CORRECTION RAPIDE LIGHTNING');
    console.log('===============================');
    console.log(`Fichier: ${this.envFile}\n`);

    // Créer le fichier .env.local s'il n'existe pas
    if (!fs.existsSync(this.envFile)) {
      fs.writeFileSync(this.envFile, '# Configuration Lightning DazNode\n', 'utf8');
      console.log('📄 Fichier .env.local créé');
    }

    // Appliquer les corrections automatiques
    console.log('\n🔧 Configuration automatique:');
    for (const fix of this.fixes) {
      this.addEnvVariable(fix.key, fix.value, fix.description);
    }

    // Variables requises manuellement
    console.log('\n⚠️  Variables à configurer manuellement:');
    const manualVars = [
      'DAZNODE_API_KEY',
      'LND_TLS_CERT',
      'LND_ADMIN_MACAROON',
      'LND_SOCKET'
    ];

    for (const varName of manualVars) {
      if (!process.env[varName]) {
        console.log(`   • ${varName} - Requis pour le fonctionnement`);
      } else {
        console.log(`   ✅ ${varName} - Déjà configuré`);
      }
    }

    // Instructions finales
    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. Configurer DAZNODE_API_KEY dans .env.local');
    console.log('2. Optionnel: Configurer LND local pour fallback');
    console.log('3. Démarrer le serveur: npm run dev');
    console.log('4. Tester: npm run diagnostic:lightning:simple');

    console.log('\n🎯 Configuration recommandée .env.local:');
    console.log('```');
    console.log('# API DazNode (REQUIS)');
    console.log('DAZNODE_API_KEY=votre_clé_api_ici');
    console.log('DAZNODE_API_URL=https://api.dazno.de');
    console.log('');
    console.log('# LND Local (optionnel - fallback)');
    console.log('LND_SOCKET=localhost:10009');
    console.log('LND_TLS_CERT=votre_certificat_tls');
    console.log('LND_ADMIN_MACAROON=votre_macaroon_admin');
    console.log('```');

    console.log('\n✅ Correction rapide terminée !');
  }

  async testConfiguration(): Promise<void> {
    console.log('\n🧪 TEST DE CONFIGURATION');
    console.log('========================');

    const envContent = this.readEnvFile();
    const lines = envContent.split('\n');
    
    let configuredCount = 0;
    let requiredCount = 0;

    for (const fix of this.fixes) {
      if (lines.some(line => line.startsWith(`${fix.key}=`))) {
        configuredCount++;
        console.log(`✅ ${fix.key} - Configuré`);
      } else {
        console.log(`❌ ${fix.key} - Manquant`);
      }
      if (fix.required) requiredCount++;
    }

    console.log(`\n📊 Résumé: ${configuredCount}/${this.fixes.length} variables configurées`);
    
    if (configuredCount === this.fixes.length) {
      console.log('🎉 Configuration complète !');
    } else {
      console.log('⚠️  Configuration partielle - vérifiez les variables manquantes');
    }
  }
}

// Exécution de la correction rapide
async function main() {
  const fixer = new QuickLightningFix();
  await fixer.runQuickFix();
  await fixer.testConfiguration();
  process.exit(0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur lors de la correction rapide:', error);
    process.exit(1);
  });
} 