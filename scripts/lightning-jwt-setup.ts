#!/usr/bin/env tsx

/**
 * Script de configuration JWT pour les factures Lightning
 * Génère et configure automatiquement les jetons JWT pour l'API Lightning
 */

import { generateJWT } from './generate-jwt';
import * as fs from 'fs';
import * as path from 'path';
import jwt from 'jsonwebtoken';

interface JWTConfig {
  tenant_id: string;
  permissions: string[];
  expires_in: number;
  description: string;
}

class LightningJWTSetup {
  private envFile: string;
  private jwtConfigs: JWTConfig[] = [];

  constructor() {
    this.envFile = path.resolve(process.cwd(), '.env.local');
    this.initializeJWTConfigs();
  }

  private initializeJWTConfigs(): void {
    this.jwtConfigs = [
      {
        tenant_id: 'daznode-lightning',
        permissions: ['read', 'write', 'invoice', 'payment'],
        expires_in: 24 * 60 * 60, // 24 heures
        description: 'Token JWT pour les factures Lightning DazNode'
      },
      {
        tenant_id: 'dazno-api',
        permissions: ['read', 'write', 'admin'],
        expires_in: 24 * 60 * 60, // 24 heures
        description: 'Token JWT pour l\'API DazNo'
      },
      {
        tenant_id: 'lightning-fallback',
        permissions: ['read', 'write'],
        expires_in: 12 * 60 * 60, // 12 heures
        description: 'Token JWT pour le service de fallback'
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

  private addJWTToEnv(token: string, config: JWTConfig): void {
    const envContent = this.readEnvFile();
    const key = `JWT_TOKEN_${config.tenant_id.toUpperCase().replace('-', '_')}`;
    
    // Supprimer l'ancienne valeur si elle existe
    const lines = envContent.split('\n').filter(line => !line.startsWith(`${key}=`));
    const newContent = lines.join('\n');
    
    // Ajouter la nouvelle valeur
    const jwtLine = `# ${config.description}\n${key}=${token}\n`;
    this.writeEnvFile(newContent + jwtLine);
    
    console.log(`✅ JWT configuré: ${key}`);
  }

  async generateAndConfigureJWT(): Promise<void> {
    console.log('🔑 CONFIGURATION JWT LIGHTNING');
    console.log('==============================');
    console.log(`Fichier: ${this.envFile}\n`);

    // Vérifier que JWT_SECRET est configuré
    if (!process.env.JWT_SECRET) {
      console.log('⚠️  JWT_SECRET non configuré, utilisation de la valeur par défaut');
      const envContent = this.readEnvFile();
      if (!envContent.includes('JWT_SECRET=')) {
        const secretLine = '# Secret JWT pour Lightning\nJWT_SECRET=daznode-lightning-secret-2024\n';
        this.writeEnvFile(envContent + secretLine);
        console.log('✅ JWT_SECRET ajouté au fichier .env.local');
      }
    }

    // Générer et configurer chaque token JWT
    console.log('\n🔧 Génération des tokens JWT:');
    for (const config of this.jwtConfigs) {
      try {
        const token = generateJWT(config.tenant_id, config.permissions);
        this.addJWTToEnv(token, config);
        
        console.log(`   ✅ ${config.tenant_id}:`);
        console.log(`      Permissions: ${config.permissions.join(', ')}`);
        console.log(`      Expiration: ${config.expires_in / 3600}h`);
        console.log(`      Description: ${config.description}`);
      } catch (error) {
        console.error(`   ❌ Erreur pour ${config.tenant_id}:`, error);
      }
    }

    // Ajouter les variables d'environnement pour les services Lightning
    this.addLightningEnvVars();
  }

  private addLightningEnvVars(): void {
    const envContent = this.readEnvFile();
    const lightningVars = [
      {
        key: 'LIGHTNING_JWT_ENABLED',
        value: 'true',
        description: 'Activer l\'authentification JWT pour Lightning'
      },
      {
        key: 'LIGHTNING_JWT_TENANT',
        value: 'daznode-lightning',
        description: 'Tenant ID pour les factures Lightning'
      },
      {
        key: 'LIGHTNING_JWT_REQUIRED',
        value: 'true',
        description: 'JWT requis pour les opérations Lightning'
      }
    ];

    console.log('\n⚙️  Configuration Lightning JWT:');
    for (const envVar of lightningVars) {
      if (!envContent.includes(`${envVar.key}=`)) {
        const newLine = `# ${envVar.description}\n${envVar.key}=${envVar.value}\n`;
        this.writeEnvFile(envContent + newLine);
        console.log(`   ✅ ${envVar.key}=${envVar.value}`);
      } else {
        console.log(`   ⏭️  ${envVar.key} - Déjà configuré`);
      }
    }
  }

  async testJWTTokens(): Promise<void> {
    console.log('\n🧪 TEST DES TOKENS JWT');
    console.log('======================');

    const envContent = this.readEnvFile();
    const jwtTokens = [
      'JWT_TOKEN_DAZNODE_LIGHTNING',
      'JWT_TOKEN_DAZNO_API',
      'JWT_TOKEN_LIGHTNING_FALLBACK'
    ];

    for (const tokenKey of jwtTokens) {
      const tokenMatch = envContent.match(new RegExp(`${tokenKey}=(.+)`));
      if (tokenMatch) {
        const token = tokenMatch[1];
        console.log(`✅ ${tokenKey}: Token présent (${token.length} caractères)`);
        
        // Test de décodage basique
        try {
          const decoded = jwt.decode(token) as any;
          if (decoded && typeof decoded === 'object') {
            console.log(`   Tenant: ${decoded.tenant_id || 'N/A'}`);
            console.log(`   Permissions: ${decoded.permissions?.join(', ') || 'N/A'}`);
            console.log(`   Expiration: ${decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'N/A'}`);
          }
        } catch (error) {
          console.log(`   ⚠️  Erreur décodage: ${error}`);
        }
      } else {
        console.log(`❌ ${tokenKey}: Token manquant`);
      }
    }
  }

  generateUsageExamples(): void {
    console.log('\n📝 EXEMPLES D\'UTILISATION');
    console.log('==========================');

    console.log('\n1. Utilisation dans les headers HTTP:');
    console.log('```bash');
    console.log('curl -X POST https://api.dazno.de/api/v1/lightning/invoice/create \\');
    console.log('  -H "Authorization: Bearer $JWT_TOKEN_DAZNODE_LIGHTNING" \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"amount": 1000, "description": "Test"}\'');
    console.log('```');

    console.log('\n2. Utilisation dans le code TypeScript:');
    console.log('```typescript');
    console.log('import { MCPLightAPI } from \'./lib/services/mcp-light-api\';');
    console.log('');
    console.log('const api = new MCPLightAPI();');
    console.log('await api.initialize(); // Utilise automatiquement le JWT');
    console.log('');
    console.log('// Créer une facture');
    console.log('const invoice = await api.createInvoice({');
    console.log('  amount: 1000,');
    console.log('  description: "Test invoice"');
    console.log('});');
    console.log('```');

    console.log('\n3. Vérification du token:');
    console.log('```bash');
    console.log('npm run test:jwt');
    console.log('```');
  }

  async runFullSetup(): Promise<void> {
    await this.generateAndConfigureJWT();
    await this.testJWTTokens();
    this.generateUsageExamples();

    console.log('\n🎉 CONFIGURATION JWT LIGHTNING TERMINÉE !');
    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. Redémarrer le serveur: npm run dev');
    console.log('2. Tester les factures: npm run test:lightning:prod');
    console.log('3. Vérifier l\'authentification: npm run diagnostic:lightning:simple');
  }
}

// Exécution de la configuration JWT
async function main() {
  const setup = new LightningJWTSetup();
  await setup.runFullSetup();
  process.exit(0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur lors de la configuration JWT:', error);
    process.exit(1);
  });
} 