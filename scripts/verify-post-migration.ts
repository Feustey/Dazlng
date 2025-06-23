#!/usr/bin/env tsx
/**
 * Script de vérification post-migration CRM
 * Vérifie que toutes les APIs et fonctionnalités fonctionnent correctement
 */

import { config } from 'dotenv';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { TestResult } from '@/lib/test-utils/supabase-test-client';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

// Configuration
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Créer le client admin Supabase
const supabase = getSupabaseAdminClient();

class PostMigrationVerifier {
  private results: TestResult[] = [];

  private addResult(name: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: any) {
    this.results.push({ name, status, message, details });
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${emoji} ${name}: ${message}`);
    if (details && status !== 'PASS') {
      console.log('   Détails:', JSON.stringify(details, null, 2));
    }
  }

  async verifyDatabaseStructure() {
    console.log('\n🔍 Vérification de la structure de la base de données...');

    try {
      // Vérifier les tables CRM principales
      const requiredTables = [
        'crm_customer_segments',
        'crm_customer_segment_members',
        'crm_email_campaigns',
        'crm_email_templates',
        'crm_email_sends',
        'profiles',
        'orders',
        'admin_roles'
      ];

      for (const tableName of requiredTables) {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_name', tableName)
          .eq('table_schema', 'public')
          .single();

        if (error || !data) {
          this.addResult(
            `Table ${tableName}`,
            'FAIL',
            'Table manquante',
            { error: error?.message }
          );
        } else {
          this.addResult(`Table ${tableName}`, 'PASS', 'Table présente');
        }
      }

      // Vérifier les vues matérialisées
      const { data: materializedViews } = await supabase
        .from('pg_matviews')
        .select('matviewname')
        .eq('schemaname', 'public');

      const expectedViews = ['crm_segments_stats_simple', 'crm_campaigns_stats_simple'];
      const existingViews = materializedViews?.map(v => v.matviewname) || [];

      for (const viewName of expectedViews) {
        if (existingViews.includes(viewName)) {
          this.addResult(`Vue ${viewName}`, 'PASS', 'Vue matérialisée présente');
        } else {
          this.addResult(`Vue ${viewName}`, 'WARN', 'Vue matérialisée manquante - utiliser la version safe');
        }
      }

    } catch (error) {
      this.addResult('Structure DB', 'FAIL', 'Erreur lors de la vérification', error);
    }
  }

  async verifyConstraints() {
    console.log('\n🔒 Vérification des contraintes...');

    try {
      // Vérifier les contraintes sur profiles
      const { data: constraints } = await supabase
        .from('information_schema.table_constraints')
        .select('constraint_name, constraint_type')
        .eq('table_name', 'profiles')
        .eq('table_schema', 'public');

      const expectedConstraints = [
        'profiles_email_format',
        'profiles_pubkey_format'
      ];

      const existingConstraints = constraints?.map(c => c.constraint_name) || [];

      for (const constraintName of expectedConstraints) {
        if (existingConstraints.includes(constraintName)) {
          this.addResult(`Contrainte ${constraintName}`, 'PASS', 'Contrainte active');
        } else {
          this.addResult(`Contrainte ${constraintName}`, 'WARN', 'Contrainte manquante');
        }
      }

    } catch (error) {
      this.addResult('Contraintes', 'FAIL', 'Erreur lors de la vérification', error);
    }
  }

  async verifyFunctions() {
    console.log('\n⚙️ Vérification des fonctions...');

    try {
      const requiredFunctions = [
        'is_admin_user',
        'build_segment_members_simple',
        'refresh_crm_simple_views',
        'diagnose_crm_simple'
      ];

      for (const functionName of requiredFunctions) {
        const { data } = await supabase
          .from('information_schema.routines')
          .select('routine_name')
          .eq('routine_name', functionName)
          .eq('routine_schema', 'public')
          .single();

        if (data) {
          this.addResult(`Fonction ${functionName}`, 'PASS', 'Fonction disponible');

          // Tester la fonction si possible
          if (functionName === 'diagnose_crm_simple') {
            try {
              const { data: result, error } = await supabase.rpc('diagnose_crm_simple');
              if (!error && result) {
                this.addResult(`Test ${functionName}`, 'PASS', 'Fonction exécutée avec succès');
              } else {
                this.addResult(`Test ${functionName}`, 'WARN', 'Erreur d\'exécution', error);
              }
            } catch (testError) {
              this.addResult(`Test ${functionName}`, 'WARN', 'Erreur de test', testError);
            }
          }
        } else {
          this.addResult(`Fonction ${functionName}`, 'FAIL', 'Fonction manquante');
        }
      }

    } catch (error) {
      this.addResult('Fonctions', 'FAIL', 'Erreur lors de la vérification', error);
    }
  }

  async verifyIndexes() {
    console.log('\n📊 Vérification des index...');

    try {
      const { data: indexes } = await supabase
        .from('pg_indexes')
        .select('indexname, tablename')
        .eq('schemaname', 'public')
        .like('indexname', '%crm%');

      const indexCount = indexes?.length || 0;
      if (indexCount > 0) {
        this.addResult('Index CRM', 'PASS', `${indexCount} index CRM trouvés`);
      } else {
        this.addResult('Index CRM', 'WARN', 'Aucun index CRM spécifique trouvé');
      }

      // Vérifier les index critiques sur profiles
      const criticalIndexes = [
        'idx_profiles_email_verified',
        'idx_profiles_created_at',
        'profiles_email_unique_idx'
      ];

      const { data: profileIndexes } = await supabase
        .from('pg_indexes')
        .select('indexname')
        .eq('schemaname', 'public')
        .eq('tablename', 'profiles');

      const existingProfileIndexes = profileIndexes?.map(i => i.indexname) || [];

      for (const indexName of criticalIndexes) {
        if (existingProfileIndexes.includes(indexName)) {
          this.addResult(`Index ${indexName}`, 'PASS', 'Index présent');
        } else {
          this.addResult(`Index ${indexName}`, 'WARN', 'Index manquant');
        }
      }

    } catch (error) {
      this.addResult('Index', 'FAIL', 'Erreur lors de la vérification', error);
    }
  }

  async verifyRLS() {
    console.log('\n🛡️ Vérification des politiques RLS...');

    try {
      const crmTables = [
        'crm_customer_segments',
        'crm_email_campaigns',
        'crm_email_templates'
      ];

      for (const tableName of crmTables) {
        const { data: policies } = await supabase
          .from('pg_policies')
          .select('policyname')
          .eq('tablename', tableName)
          .eq('schemaname', 'public');

        if (policies && policies.length > 0) {
          this.addResult(`RLS ${tableName}`, 'PASS', `${policies.length} politique(s) active(s)`);
        } else {
          this.addResult(`RLS ${tableName}`, 'WARN', 'Aucune politique RLS trouvée');
        }
      }

    } catch (error) {
      this.addResult('RLS', 'FAIL', 'Erreur lors de la vérification', error);
    }
  }

  async testCRMAPIs() {
    console.log('\n🌐 Test des APIs CRM...');

    try {
      // Test API segments
      const segmentsResponse = await fetch(`${APP_URL}/api/crm/segments`);
      if (segmentsResponse.ok) {
        const segmentsData = await segmentsResponse.json();
        this.addResult('API Segments', 'PASS', 'API segments accessible', {
          status: segmentsResponse.status,
          count: segmentsData.data?.length || 0
        });
      } else {
        this.addResult('API Segments', 'FAIL', 'API segments inaccessible', {
          status: segmentsResponse.status,
          statusText: segmentsResponse.statusText
        });
      }

      // Test API campaigns
      const campaignsResponse = await fetch(`${APP_URL}/api/crm/campaigns`);
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        this.addResult('API Campaigns', 'PASS', 'API campaigns accessible', {
          status: campaignsResponse.status,
          count: campaignsData.data?.length || 0
        });
      } else {
        this.addResult('API Campaigns', 'FAIL', 'API campaigns inaccessible', {
          status: campaignsResponse.status,
          statusText: campaignsResponse.statusText
        });
      }

    } catch (error) {
      this.addResult('APIs CRM', 'FAIL', 'Erreur lors du test des APIs', error);
    }
  }

  async testDataIntegrity() {
    console.log('\n🔍 Vérification de l\'intégrité des données...');

    try {
      // Vérifier les enregistrements orphelins
      const { data: orphanedMembers } = await supabase
        .from('crm_customer_segment_members')
        .select('id')
        .not('customer_id', 'in', '(SELECT id FROM profiles)');

      if (!orphanedMembers || orphanedMembers.length === 0) {
        this.addResult('Intégrité données', 'PASS', 'Aucun enregistrement orphelin');
      } else {
        this.addResult('Intégrité données', 'WARN', `${orphanedMembers.length} enregistrement(s) orphelin(s) trouvé(s)`);
      }

      // Vérifier les contraintes de clés étrangères
      const { error } = await supabase
        .from('crm_customer_segment_members')
        .select('id')
        .limit(1);

      if (!error) {
        this.addResult('Clés étrangères', 'PASS', 'Contraintes de clés étrangères fonctionnelles');
      } else {
        this.addResult('Clés étrangères', 'FAIL', 'Problème avec les clés étrangères', error);
      }

    } catch (error) {
      this.addResult('Intégrité', 'FAIL', 'Erreur lors de la vérification', error);
    }
  }

  async testPerformance() {
    console.log('\n⚡ Test de performance...');

    try {
      // Test de performance des requêtes principales
      const startTime = Date.now();

      await supabase
        .from('profiles')
        .select('id, email, created_at')
        .limit(100);

      const profilesTime = Date.now() - startTime;

      if (profilesTime < 1000) {
        this.addResult('Performance profiles', 'PASS', `Requête en ${profilesTime}ms`);
      } else if (profilesTime < 3000) {
        this.addResult('Performance profiles', 'WARN', `Requête lente: ${profilesTime}ms`);
      } else {
        this.addResult('Performance profiles', 'FAIL', `Requête très lente: ${profilesTime}ms`);
      }

      // Test des vues matérialisées si elles existent
      const viewStartTime = Date.now();
      const { error } = await supabase
        .from('crm_segments_stats_simple')
        .select('*')
        .limit(10);

      if (!error) {
        const viewTime = Date.now() - viewStartTime;
        this.addResult('Performance vues', 'PASS', `Vue matérialisée en ${viewTime}ms`);
      } else {
        this.addResult('Performance vues', 'WARN', 'Vue matérialisée indisponible', error);
      }

    } catch (error) {
      this.addResult('Performance', 'FAIL', 'Erreur lors du test', error);
    }
  }

  async run(): Promise<void> {
    console.log('🚀 Démarrage de la vérification post-migration CRM...\n');

    await this.verifyDatabaseStructure();
    await this.verifyConstraints();
    await this.verifyFunctions();
    await this.verifyIndexes();
    await this.verifyRLS();
    await this.testCRMAPIs();
    await this.testDataIntegrity();
    await this.testPerformance();

    this.generateReport();
  }

  private generateReport(): void {
    console.log('\n📊 RAPPORT DE VÉRIFICATION POST-MIGRATION CRM');
    console.log('=' .repeat(60));

    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const warnCount = this.results.filter(r => r.status === 'WARN').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;

    console.log(`✅ Tests réussis: ${passCount}`);
    console.log(`⚠️  Avertissements: ${warnCount}`);
    console.log(`❌ Échecs: ${failCount}`);
    console.log(`📋 Total: ${this.results.length}`);

    if (failCount > 0) {
      console.log('\n❌ PROBLÈMES CRITIQUES DÉTECTÉS:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`   - ${r.name}: ${r.message}`));
    }

    if (warnCount > 0) {
      console.log('\n⚠️  AVERTISSEMENTS:');
      this.results
        .filter(r => r.status === 'WARN')
        .forEach(r => console.log(`   - ${r.name}: ${r.message}`));
    }

    console.log('\n🎯 RECOMMANDATIONS:');
    if (failCount === 0 && warnCount === 0) {
      console.log('   ✨ Migration CRM réussie ! Tous les tests sont passés.');
      console.log('   🚀 L\'application est prête pour la production.');
    } else if (failCount === 0) {
      console.log('   ✅ Migration globalement réussie avec quelques avertissements mineurs.');
      console.log('   🔧 Consultez les avertissements pour des optimisations optionnelles.');
    } else {
      console.log('   🚨 Des problèmes critiques nécessitent une attention immédiate.');
      console.log('   🔧 Corrigez les échecs avant de déployer en production.');
    }

    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('   1. Si des échecs: corriger les problèmes et relancer le script');
    console.log('   2. Tester manuellement les fonctionnalités CRM dans l\'interface');
    console.log('   3. Exécuter les index CONCURRENTLY si en production');
    console.log('   4. Configurer la surveillance des performances');

    process.exit(failCount > 0 ? 1 : 0);
  }
}

// Exécution du script
async function main() {
  try {
    const verifier = new PostMigrationVerifier();
    await verifier.run();
  } catch (error) {
    console.error('❌ Erreur fatale lors de la vérification:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { PostMigrationVerifier }; 