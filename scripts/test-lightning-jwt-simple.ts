#!/usr/bin/env tsx

/**
 * Test simplifié de l'intégration JWT avec les factures Lightning
 * Version sans dépendances Supabase pour tests rapides
 */

import jwt from 'jsonwebtoken';
import { generateJWT } from './generate-jwt';

interface TestResult {
  test: string;
  success: boolean;
  error?: string;
  details?: any;
}

class SimpleLightningJWTTest {
  private testResults: TestResult[] = [];
  private jwtEnabled: boolean;
  private jwtSecret: string;
  private jwtTenant: string;

  constructor() {
    this.jwtEnabled = process.env.LIGHTNING_JWT_ENABLED === 'true';
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.jwtTenant = process.env.LIGHTNING_JWT_TENANT || 'daznode-lightning';
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
    const hasSecret = Boolean(this.jwtSecret);
    const correctTenant = this.jwtTenant === 'daznode-lightning';

    this.addResult(
      'Configuration JWT',
      hasSecret && correctTenant,
      !hasSecret ? 'JWT_SECRET manquant' : !correctTenant ? 'Tenant incorrect' : undefined,
      { jwtEnabled: this.jwtEnabled, jwtTenant: this.jwtTenant, hasSecret }
    );

    // Test 2: Génération de token JWT
    try {
      const token = generateJWT(this.jwtTenant, ['read', 'write', 'invoice']);
      const isValidToken = token && token.split('.').length === 3;
      
      this.addResult(
        'Génération token JWT',
        isValidToken,
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
      const validToken = generateJWT(this.jwtTenant, ['read', 'write']);
      const isValid = this.validateToken(validToken);
      
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
      const isValid = this.validateToken(invalidToken);
      
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

    // Test 3: Token avec mauvais tenant
    try {
      const wrongTenantToken = generateJWT('wrong-tenant', ['read']);
      const isValid = this.validateToken(wrongTenantToken);
      
      this.addResult(
        'Validation token mauvais tenant',
        !isValid,
        isValid ? 'Token mauvais tenant accepté' : undefined
      );
    } catch (error) {
      this.addResult(
        'Validation token mauvais tenant',
        false,
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    }
  }

  private validateToken(token: string): boolean {
    try {
      if (!this.jwtEnabled) {
        return true; // JWT désactivé, toujours valide
      }

      const decoded = jwt.verify(token, this.jwtSecret) as any;
      return decoded && decoded.tenant_id === this.jwtTenant;
    } catch (error) {
      return false;
    }
  }

  async testEnvironmentVariables(): Promise<void> {
    console.log('\n⚙️  TEST VARIABLES D\'ENVIRONNEMENT');
    console.log('==================================');

    const requiredVars = [
      'JWT_SECRET',
      'LIGHTNING_JWT_ENABLED',
      'LIGHTNING_JWT_TENANT',
      'JWT_TOKEN_DAZNODE_LIGHTNING'
    ];

    for (const varName of requiredVars) {
      const value = process.env[varName];
      const hasValue = Boolean(value);
      
      this.addResult(
        `Variable ${varName}`,
        hasValue,
        !hasValue ? 'Variable manquante' : undefined,
        { value: hasValue ? `${value?.substring(0, 20)}...` : 'undefined' }
      );
    }
  }

  async testTokenPermissions(): Promise<void> {
    console.log('\n🔑 TEST PERMISSIONS JWT');
    console.log('=======================');

    try {
      const token = generateJWT(this.jwtTenant, ['read', 'write', 'invoice', 'payment']);
      const decoded = jwt.decode(token) as any;
      
      const hasRead = decoded.permissions?.includes('read');
      const hasWrite = decoded.permissions?.includes('write');
      const hasInvoice = decoded.permissions?.includes('invoice');
      const hasPayment = decoded.permissions?.includes('payment');

      this.addResult(
        'Permissions complètes',
        hasRead && hasWrite && hasInvoice && hasPayment,
        !hasRead || !hasWrite || !hasInvoice || !hasPayment ? 'Permissions manquantes' : undefined,
        { permissions: decoded.permissions }
      );
    } catch (error) {
      this.addResult(
        'Permissions complètes',
        false,
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
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
      console.log('✅ Prêt pour l\'utilisation en production');
    } else {
      console.log('⚠️  Certains tests ont échoué, vérifiez la configuration');
      console.log('💡 Exécutez: npm run setup:lightning:jwt pour reconfigurer');
    }

    console.log('\n📝 EXEMPLES D\'UTILISATION:');
    console.log('1. Headers HTTP: Authorization: Bearer $JWT_TOKEN_DAZNODE_LIGHTNING');
    console.log('2. Code TypeScript: lightningService.generateJWTToken()');
    console.log('3. Test complet: npm run test:lightning:jwt');
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 TEST INTÉGRATION JWT LIGHTNING (SIMPLE)');
    console.log('==========================================');
    console.log(`Date: ${new Date().toISOString()}\n`);

    await this.testJWTConfiguration();
    await this.testJWTValidation();
    await this.testEnvironmentVariables();
    await this.testTokenPermissions();

    this.generateSummary();
  }
}

// Exécution des tests
async function main() {
  const tester = new SimpleLightningJWTTest();
  await tester.runAllTests();
  process.exit(0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur lors des tests JWT:', error);
    process.exit(1);
  });
} 