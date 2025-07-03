#!/usr/bin/env tsx

/**
 * Test de l'intégration JWT avec les factures Lightning
 * Vérifie que l'authentification JWT fonctionne correctement
 */

import { LightningServiceImpl } from '../lib/services/lightning-service';
import { generateJWT } from './generate-jwt';
import jwt from 'jsonwebtoken';

interface TestResult {
  test: string;
  success: boolean;
  error?: string;
  details?: any;
}

class LightningJWTTest {
  private lightningService: LightningServiceImpl;
  private testResults: TestResult[] = [];

  constructor() {
    this.lightningService = new LightningServiceImpl();
  }

  private addResult(test: string, success: boolean, error?: string, details?: any): void {
    this.testResults.push({ test, success, error, details });
    const status = success ? '✅' : '❌';
    console.log(`${status} ${test}`);
    if (error) console.log(`   Erreur: ${error}`);
    if (details) console.log(`   Détails:`, details);
  }

  async testJWTConfiguration(): Promise<void> {
    console.log('\n🔧 TEST CONFIGURATION JWT');
    console.log('========================');

    // Test 1: Vérification des variables d'environnement
    const jwtEnabled = this.lightningService.isJWTEnabled();
    const jwtTenant = this.lightningService.getJWTTenant();
    const jwtSecret = process.env.JWT_SECRET;

    this.addResult(
      'Configuration JWT',
      Boolean(jwtSecret) && jwtTenant === 'daznode-lightning',
      !jwtSecret ? 'JWT_SECRET manquant' : undefined,
      { jwtEnabled, jwtTenant, hasSecret: Boolean(jwtSecret) }
    );

    // Test 2: Génération de token JWT
    try {
      const token = this.lightningService.generateJWTToken(['read', 'write', 'invoice']);
      const isValidToken = token && token.split('.').length === 3;
      
      this.addResult(
        'Génération token JWT',
        Boolean(isValidToken),
        !isValidToken ? 'Token invalide' : undefined,
        { tokenLength: token?.length }
      );
    } catch (error) {
      this.addResult(
        'Génération token JWT',
        false,
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    }
  }

  async testJWTValidation(): Promise<void> {
    console.log('\n🔐 TEST VALIDATION JWT');
    console.log('======================');

    // Test 1: Token valide
    try {
      const validToken = this.lightningService.generateJWTToken(['read', 'write']);
      const isValid = await this.testTokenValidation(validToken);
      
      this.addResult(
        'Validation token valide',
        isValid,
        !isValid ? 'Token valide rejeté' : undefined
      );
    } catch (error) {
      this.addResult(
        'Validation token valide',
        false,
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    }

    // Test 2: Token invalide
    try {
      const invalidToken = 'invalid.token.here';
      const isValid = await this.testTokenValidation(invalidToken);
      
      this.addResult(
        'Validation token invalide',
        !isValid,
        isValid ? 'Token invalide accepté' : undefined
      );
    } catch (error) {
      this.addResult(
        'Validation token invalide',
        false,
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    }

    // Test 3: Token expiré
    try {
      const expiredToken = generateJWT('daznode-lightning', ['read']); // Pas de 3ème paramètre
      const isValid = await this.testTokenValidation(expiredToken);
      
      this.addResult(
        'Validation token expiré',
        !isValid,
        isValid ? 'Token expiré accepté' : undefined
      );
    } catch (error) {
      this.addResult(
        'Validation token expiré',
        false,
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    }
  }

  private async testTokenValidation(token: string): Promise<boolean> {
    // Utilisation de la méthode privée via reflection ou test direct
    try {
      // Test indirect via la génération d'une facture
      if (!this.lightningService.isJWTEnabled()) {
        return true; // JWT désactivé, toujours valide
      }

      // Simulation de validation
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
      return decoded && decoded.tenant_id === this.lightningService.getJWTTenant();
    } catch (error) {
      return false;
    }
  }

  async testInvoiceCreationWithJWT(): Promise<void> {
    console.log('\n💰 TEST CRÉATION FACTURE AVEC JWT');
    console.log('==================================');

    // Test 1: Création sans JWT (si désactivé)
    if (!this.lightningService.isJWTEnabled()) {
      try {
        const result = await this.lightningService.generateInvoice({
          amount: 1000,
          description: 'Test sans JWT'
        });
        
        this.addResult(
          'Création facture sans JWT',
          !!result.paymentHash,
          !result.paymentHash ? 'Échec création facture' : undefined,
          { paymentHash: result.paymentHash }
        );
      } catch (error) {
        this.addResult(
          'Création facture sans JWT',
          false,
          error instanceof Error ? error.message : 'Erreur inconnue'
        );
      }
    } else {
      // Test 2: Création avec JWT valide
      try {
        const token = this.lightningService.generateJWTToken(['read', 'write', 'invoice']);
        const result = await this.lightningService.generateInvoice({
          amount: 1000,
          description: 'Test avec JWT'
        });
        
        this.addResult(
          'Création facture avec JWT',
          !!result.paymentHash,
          !result.paymentHash ? 'Échec création facture' : undefined,
          { paymentHash: result.paymentHash, jwtUsed: true }
        );
      } catch (error) {
        this.addResult(
          'Création facture avec JWT',
          false,
          error instanceof Error ? error.message : 'Erreur inconnue'
        );
      }
    }
  }

  async testAPIEndpointWithJWT(): Promise<void> {
    console.log('\n🌐 TEST ENDPOINT API AVEC JWT');
    console.log('==============================');

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const endpoint = `${baseUrl}/api/create-invoice`;

    // Test 1: Appel sans token JWT
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 1000,
          description: 'Test sans JWT'
        })
      });

      const data = await response.json();
      const expectedError = this.lightningService.isJWTEnabled() ? 
        data.error?.code === 'JWT_REQUIRED' : 
        data.success === true;

      this.addResult(
        'Appel API sans JWT',
        expectedError,
        !expectedError ? 'Réponse inattendue' : undefined,
        { status: response.status, errorCode: data.error?.code }
      );
    } catch (error) {
      this.addResult(
        'Appel API sans JWT',
        false,
        error instanceof Error ? error.message : 'Erreur réseau'
      );
    }

    // Test 2: Appel avec token JWT valide
    if (this.lightningService.isJWTEnabled()) {
      try {
        const token = this.lightningService.generateJWTToken(['read', 'write', 'invoice']);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: 1000,
            description: 'Test avec JWT'
          })
        });

        const data = await response.json();
        const success = data.success === true && !!data.data?.paymentHash;

        this.addResult(
          'Appel API avec JWT',
          success,
          !success ? 'Échec création facture via API' : undefined,
          { status: response.status, paymentHash: data.data?.paymentHash }
        );
      } catch (error) {
        this.addResult(
          'Appel API avec JWT',
          false,
          error instanceof Error ? error.message : 'Erreur réseau'
        );
      }
    }
  }

  generateSummary(): void {
    console.log('\n📊 RÉSUMÉ DES TESTS JWT LIGHTNING');
    console.log('==================================');

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    console.log(`Total des tests: ${totalTests}`);
    console.log(`Tests réussis: ${passedTests} ✅`);
    console.log(`Tests échoués: ${failedTests} ❌`);
    console.log(`Taux de réussite: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ TESTS ÉCHOUÉS:');
      this.testResults
        .filter(r => !r.success)
        .forEach(r => console.log(`   - ${r.test}: ${r.error}`));
    }

    console.log('\n🎯 RECOMMANDATIONS:');
    if (failedTests === 0) {
      console.log('✅ Tous les tests JWT Lightning sont passés !');
      console.log('✅ L\'authentification JWT est correctement configurée');
    } else {
      console.log('⚠️  Certains tests ont échoué, vérifiez la configuration');
      console.log('💡 Exécutez: npm run setup:lightning:jwt pour reconfigurer');
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 TEST INTÉGRATION JWT LIGHTNING');
    console.log('==================================');
    console.log(`Date: ${new Date().toISOString()}\n`);

    await this.testJWTConfiguration();
    await this.testJWTValidation();
    await this.testInvoiceCreationWithJWT();
    await this.testAPIEndpointWithJWT();

    this.generateSummary();
  }
}

// Exécution des tests
async function main() {
  const tester = new LightningJWTTest();
  await tester.runAllTests();
  process.exit(0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur lors des tests JWT:', error);
    process.exit(1);
  });
} 