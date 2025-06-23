#!/usr/bin/env tsx
/**
 * Script de vérification rapide de santé post-migration
 * Vérifie seulement les fonctionnalités critiques en 30 secondes
 */

import { config } from 'dotenv';
import { getSupabaseAdminClient } from '../lib/supabase';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabase = getSupabaseAdminClient();

interface HealthCheck {
  name: string;
  status: 'OK' | 'ERROR' | 'WARNING';
  message: string;
  responseTime?: number;
}

class QuickHealthChecker {
  private results: HealthCheck[] = [];

  private addResult(name: string, status: 'OK' | 'ERROR' | 'WARNING', message: string, responseTime?: number) {
    this.results.push({ name, status, message, responseTime });
    const icon = status === 'OK' ? '✅' : status === 'ERROR' ? '❌' : '⚠️';
    const time = responseTime ? ` (${responseTime}ms)` : '';
    console.log(`${icon} ${name}: ${message}${time}`);
  }

  async checkDatabase() {
    console.log('\n🔍 Vérification base de données...');

    try {
      const start = Date.now();
      
      // Test basique de connectivité
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      const responseTime = Date.now() - start;

      if (error) {
        this.addResult('Connectivité DB', 'ERROR', `Erreur: ${error.message}`, responseTime);
        return;
      }

      this.addResult('Connectivité DB', 'OK', 'Base de données accessible', responseTime);

      // Vérifier les tables CRM essentielles
      const tables = ['crm_customer_segments', 'crm_email_campaigns'];
      for (const table of tables) {
        const { error: tableError } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (tableError) {
          this.addResult(`Table ${table}`, 'ERROR', `Table inaccessible: ${tableError.message}`);
        } else {
          this.addResult(`Table ${table}`, 'OK', 'Table accessible');
        }
      }

    } catch (error) {
      this.addResult('Base de données', 'ERROR', `Erreur critique: ${error}`);
    }
  }

  async checkCriticalAPIs() {
    console.log('\n🌐 Test des APIs critiques...');

    const criticalEndpoints = [
      { path: '/api/auth/me', name: 'Auth' },
      { path: '/api/user/profile', name: 'Profile' },
      { path: '/api/admin/users', name: 'Admin Users' }
    ];

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    for (const endpoint of criticalEndpoints) {
      try {
        const start = Date.now();
        const response = await fetch(`${APP_URL}${endpoint.path}`);
        const responseTime = Date.now() - start;

        if (response.ok || response.status === 401) { // 401 est normal sans auth
          this.addResult(`API ${endpoint.name}`, 'OK', `Endpoint accessible`, responseTime);
        } else {
          this.addResult(`API ${endpoint.name}`, 'WARNING', `HTTP ${response.status}`, responseTime);
        }
      } catch (error) {
        this.addResult(`API ${endpoint.name}`, 'ERROR', `Erreur de connexion`);
      }
    }
  }

  async checkProfileConstraints() {
    console.log('\n🔒 Vérification contraintes profiles...');

    try {
      // Test format email invalide
      const invalidEmail = {
        id: 'test-constraint-' + Date.now(),
        email: 'invalid-email',
        nom: 'Test',
        prenom: 'User'
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(invalidEmail)
        .select('id')
        .single();

      if (error && error.message.includes('email')) {
        this.addResult('Contrainte Email', 'OK', 'Validation email fonctionne');
      } else {
        this.addResult('Contrainte Email', 'WARNING', 'Validation email manquante');
      }

      // Nettoyer le test
      await supabase
        .from('profiles')
        .delete()
        .eq('id', invalidEmail.id);

    } catch (error) {
      this.addResult('Contraintes', 'WARNING', 'Test de contrainte échoué');
    }
  }

  async checkPerformance() {
    console.log('\n⚡ Test de performance...');

    try {
      // Test performance requête profiles
      const start = Date.now();
      await supabase
        .from('profiles')
        .select('id, email, created_at')
        .limit(50);

      const responseTime = Date.now() - start;

      if (responseTime < 500) {
        this.addResult('Performance Profiles', 'OK', `Excellente performance`, responseTime);
      } else if (responseTime < 1500) {
        this.addResult('Performance Profiles', 'WARNING', `Performance acceptable`, responseTime);
      } else {
        this.addResult('Performance Profiles', 'ERROR', `Performance dégradée`, responseTime);
      }

      // Test fonction de diagnostic si disponible
      try {
        const diagStart = Date.now();
        const { data: diagResult } = await supabase.rpc('diagnose_crm_simple');
        const diagTime = Date.now() - diagStart;

        if (diagResult) {
          this.addResult('Fonction Diagnostic', 'OK', `Fonction disponible`, diagTime);
        } else {
          this.addResult('Fonction Diagnostic', 'WARNING', 'Fonction indisponible');
        }
      } catch {
        this.addResult('Fonction Diagnostic', 'WARNING', 'Fonction non trouvée');
      }

    } catch (error) {
      this.addResult('Performance', 'ERROR', `Erreur de test: ${error}`);
    }
  }

  async run() {
    console.log('🚀 Vérification rapide de santé post-migration CRM...');
    console.log('⏱️  Durée estimée: 30 secondes\n');

    const totalStart = Date.now();

    await this.checkDatabase();
    await this.checkCriticalAPIs();
    await this.checkProfileConstraints();
    await this.checkPerformance();

    const totalTime = Date.now() - totalStart;
    this.generateQuickReport(totalTime);
  }

  private generateQuickReport(totalTime: number) {
    console.log('\n📊 RAPPORT RAPIDE DE SANTÉ');
    console.log('='.repeat(40));

    const okCount = this.results.filter(r => r.status === 'OK').length;
    const errorCount = this.results.filter(r => r.status === 'ERROR').length;
    const warningCount = this.results.filter(r => r.status === 'WARNING').length;

    console.log(`⏱️  Temps total: ${totalTime}ms`);
    console.log(`✅ OK: ${okCount}`);
    console.log(`⚠️  Warnings: ${warningCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);

    if (errorCount === 0 && warningCount === 0) {
      console.log('\n🎉 SANTÉ EXCELLENTE - Migration réussie !');
      console.log('🚀 Application prête pour la production.');
    } else if (errorCount === 0) {
      console.log('\n✅ SANTÉ CORRECTE - Quelques avertissements mineurs.');
      console.log('🔧 Surveillance recommandée.');
    } else {
      console.log('\n🚨 PROBLÈMES DÉTECTÉS - Action requise !');
      console.log('🛠️  Consultez le guide de résolution des problèmes.');
    }

    if (errorCount > 0) {
      console.log('\n❌ ERREURS CRITIQUES:');
      this.results
        .filter(r => r.status === 'ERROR')
        .forEach(r => console.log(`   - ${r.name}: ${r.message}`));
    }

    console.log('\n📋 PROCHAINES ÉTAPES:');
    if (errorCount === 0) {
      console.log('   1. ✅ Exécuter tests complets: npm run verify-all');
      console.log('   2. ✅ Tester manuellement les interfaces');
      console.log('   3. ✅ Planifier le déploiement');
    } else {
      console.log('   1. 🔧 Corriger les erreurs critiques');
      console.log('   2. 🔍 Consulter GUIDE_VERIFICATION_POST_MIGRATION.md');
      console.log('   3. 🔄 Relancer cette vérification');
    }

    process.exit(errorCount > 0 ? 1 : 0);
  }
}

// Exécution
async function main() {
  try {
    const checker = new QuickHealthChecker();
    await checker.run();
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { QuickHealthChecker }; 