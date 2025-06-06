#!/usr/bin/env tsx
/**
 * Script de test spécifique des APIs post-migration
 * Teste toutes les routes API qui utilisent les données CRM
 */

import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

// Configuration
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface ApiTestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  statusCode?: number;
  responseTime: number;
  message: string;
  data?: any;
}

class ApiTester {
  private results: ApiTestResult[] = [];

  private async testEndpoint(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    headers: Record<string, string> = {}
  ): Promise<ApiTestResult> {
    const startTime = Date.now();
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${APP_URL}${endpoint}`, options);
      const responseTime = Date.now() - startTime;
      
      let data;
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }

      const result: ApiTestResult = {
        endpoint,
        method,
        status: response.ok ? 'PASS' : 'FAIL',
        statusCode: response.status,
        responseTime,
        message: response.ok 
          ? `Succès en ${responseTime}ms` 
          : `Erreur HTTP ${response.status}: ${response.statusText}`,
        data: response.ok ? data : { error: data }
      };

      this.results.push(result);
      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: ApiTestResult = {
        endpoint,
        method,
        status: 'FAIL',
        responseTime,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        data: { error }
      };

      this.results.push(result);
      return result;
    }
  }

  async testCRMSegments() {
    console.log('\n🎯 Test des APIs CRM Segments...');

    // GET /api/crm/segments
    await this.testEndpoint('/api/crm/segments');
    
    // GET /api/crm/segments avec stats
    await this.testEndpoint('/api/crm/segments?includeStats=true');

    // Test de création d'un segment (si admin)
    const testSegment = {
      name: `Test Segment ${Date.now()}`,
      description: 'Segment de test automatique',
      criteria: {
        profile: {
          email_verified: true,
          created_days_ago: { min: 0, max: 365 }
        }
      },
      auto_update: false
    };

    await this.testEndpoint('/api/crm/segments', 'POST', testSegment);
  }

  async testCRMCampaigns() {
    console.log('\n📧 Test des APIs CRM Campaigns...');

    // GET /api/crm/campaigns
    await this.testEndpoint('/api/crm/campaigns');
    
    // GET /api/crm/campaigns avec stats
    await this.testEndpoint('/api/crm/campaigns?includeStats=true');
    
    // GET /api/crm/campaigns avec filtre de statut
    await this.testEndpoint('/api/crm/campaigns?status=draft');
  }

  async testAdminAPIs() {
    console.log('\n👑 Test des APIs Admin...');

    // Test des utilisateurs admin
    await this.testEndpoint('/api/admin/users');
    await this.testEndpoint('/api/admin/users/enhanced');
    
    // Test des statistiques admin
    await this.testEndpoint('/api/admin/stats');
    await this.testEndpoint('/api/admin/stats/enhanced');
    
    // Test des commandes admin
    await this.testEndpoint('/api/admin/orders');
    
    // Test des paiements admin
    await this.testEndpoint('/api/admin/payments');
    
    // Test des abonnements admin
    await this.testEndpoint('/api/admin/subscriptions');
  }

  async testUserAPIs() {
    console.log('\n👤 Test des APIs Utilisateur...');

    // Test du profil utilisateur
    await this.testEndpoint('/api/user/profile');
    
    // Test des commandes utilisateur
    await this.testEndpoint('/api/orders');
    
    // Test des abonnements utilisateur
    await this.testEndpoint('/api/subscriptions/current');
    await this.testEndpoint('/api/subscriptions/plans');
  }

  async testAuthAPIs() {
    console.log('\n🔐 Test des APIs d\'authentification...');

    // Test de vérification du statut d'auth
    await this.testEndpoint('/api/auth/me');
    
    // Test de vérification de l'auth (sans token)
    await this.testEndpoint('/api/auth/check');
  }

  async testDebugAPIs() {
    console.log('\n🔧 Test des APIs de debug...');

    // Test du diagnostic des colonnes profiles
    await this.testEndpoint('/api/debug/profile-columns');
    
    // Test du statut Supabase
    await this.testEndpoint('/api/debug/supabase-status');
    
    // Test de la configuration
    await this.testEndpoint('/api/debug/config');
  }

  async testEmailAPIs() {
    console.log('\n📮 Test des APIs Email...');

    // Test contact
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message automatique'
    };
    
    await this.testEndpoint('/api/contact', 'POST', contactData);
  }

  async testPerformance() {
    console.log('\n⚡ Test de performance des APIs critiques...');

    const criticalEndpoints = [
      '/api/admin/users',
      '/api/orders',
      '/api/crm/segments'
    ];

    for (const endpoint of criticalEndpoints) {
      const result = await this.testEndpoint(endpoint);
      
      if (result.responseTime > 3000) {
        console.log(`⚠️  ${endpoint}: Performance dégradée (${result.responseTime}ms)`);
      } else if (result.responseTime > 1000) {
        console.log(`⚠️  ${endpoint}: Performance acceptable (${result.responseTime}ms)`);
      } else {
        console.log(`✅ ${endpoint}: Bonne performance (${result.responseTime}ms)`);
      }
    }
  }

  async run(): Promise<void> {
    console.log('🚀 Démarrage des tests API post-migration...\n');

    try {
      await this.testCRMSegments();
      await this.testCRMCampaigns();
      await this.testAdminAPIs();
      await this.testUserAPIs();
      await this.testAuthAPIs();
      await this.testDebugAPIs();
      await this.testEmailAPIs();
      await this.testPerformance();

      this.generateReport();
    } catch (error) {
      console.error('❌ Erreur fatale lors des tests:', error);
      process.exit(1);
    }
  }

  private generateReport(): void {
    console.log('\n📊 RAPPORT DES TESTS API POST-MIGRATION');
    console.log('='.repeat(60));

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = this.results.filter(r => r.status === 'FAIL').length;
    const warningTests = this.results.filter(r => r.status === 'WARN').length;

    console.log(`📋 Total des tests: ${totalTests}`);
    console.log(`✅ Tests réussis: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`);
    console.log(`❌ Tests échoués: ${failedTests} (${Math.round(failedTests/totalTests*100)}%)`);
    console.log(`⚠️  Avertissements: ${warningTests} (${Math.round(warningTests/totalTests*100)}%)`);

    // Performance moyenne
    const avgResponseTime = this.results
      .filter(r => r.status === 'PASS')
      .reduce((sum, r) => sum + r.responseTime, 0) / passedTests;
    
    console.log(`⚡ Temps de réponse moyen: ${Math.round(avgResponseTime)}ms`);

    // Détails des échecs
    if (failedTests > 0) {
      console.log('\n❌ ÉCHECS DÉTECTÉS:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          console.log(`   - ${r.method} ${r.endpoint}: ${r.message}`);
          if (r.statusCode) {
            console.log(`     Code: ${r.statusCode}`);
          }
        });
    }

    // APIs les plus lentes
    const slowAPIs = this.results
      .filter(r => r.status === 'PASS')
      .sort((a, b) => b.responseTime - a.responseTime)
      .slice(0, 5);

    if (slowAPIs.length > 0) {
      console.log('\n🐌 APIs LES PLUS LENTES:');
      slowAPIs.forEach(api => {
        console.log(`   - ${api.method} ${api.endpoint}: ${api.responseTime}ms`);
      });
    }

    // Recommandations
    console.log('\n🎯 RECOMMANDATIONS:');
    
    if (failedTests === 0) {
      console.log('   ✨ Tous les tests API sont passés avec succès !');
      console.log('   🚀 Les APIs sont prêtes pour la production.');
    } else {
      console.log('   🚨 Certaines APIs présentent des problèmes.');
      console.log('   🔧 Vérifiez les permissions et la configuration.');
    }

    if (avgResponseTime > 2000) {
      console.log('   ⚡ Performance générale dégradée - optimisation recommandée.');
    } else if (avgResponseTime > 1000) {
      console.log('   ⚡ Performance acceptable - surveillance recommandée.');
    } else {
      console.log('   ⚡ Excellente performance des APIs.');
    }

    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('   1. Corriger les APIs en échec si nécessaire');
    console.log('   2. Optimiser les APIs lentes (>2s)');
    console.log('   3. Configurer la surveillance en production');
    console.log('   4. Documenter les changements pour l\'équipe');

    // Détails JSON pour l'analyse
    if (process.env.NODE_ENV === 'development') {
      console.log('\n📄 DÉTAILS JSON (développement):');
      console.log(JSON.stringify(this.results, null, 2));
    }

    process.exit(failedTests > 0 ? 1 : 0);
  }
}

// Exécution du script
async function main() {
  try {
    const tester = new ApiTester();
    await tester.run();
  } catch (error) {
    console.error('❌ Erreur fatale lors des tests API:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { ApiTester }; 