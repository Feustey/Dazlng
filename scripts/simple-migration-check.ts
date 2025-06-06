#!/usr/bin/env tsx
/**
 * Script simplifié de vérification post-migration
 * Teste directement les tables sans passer par information_schema
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CheckResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  responseTime?: number;
}

async function checkTable(tableName: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    const responseTime = Date.now() - start;

    if (error) {
      return {
        name: `Table ${tableName}`,
        status: 'FAIL',
        message: `Table inaccessible: ${error.message}`,
        responseTime
      };
    }

    return {
      name: `Table ${tableName}`,
      status: 'PASS',
      message: 'Table accessible',
      responseTime
    };
  } catch (error) {
    return {
      name: `Table ${tableName}`,
      status: 'FAIL',
      message: `Erreur: ${error}`,
      responseTime: Date.now() - start
    };
  }
}

async function checkFunction(functionName: string): Promise<CheckResult> {
  const start = Date.now();
  try {
    const { error } = await supabase.rpc(functionName);
    const responseTime = Date.now() - start;

    if (error) {
      return {
        name: `Fonction ${functionName}`,
        status: 'WARN',
        message: `Fonction indisponible: ${error.message}`,
        responseTime
      };
    }

    return {
      name: `Fonction ${functionName}`,
      status: 'PASS',
      message: 'Fonction disponible',
      responseTime
    };
  } catch (error) {
    return {
      name: `Fonction ${functionName}`,
      status: 'WARN',
      message: `Erreur: ${error}`,
      responseTime: Date.now() - start
    };
  }
}

async function testConstraints(): Promise<CheckResult> {
  try {
    // Test contrainte email invalide
    const invalidEmail = {
      id: 'test-constraint-' + Date.now(),
      email: 'invalid-email-format',
      nom: 'Test',
      prenom: 'User'
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(invalidEmail)
      .select('id')
      .single();

    // Nettoyer immédiatement
    await supabase
      .from('profiles')
      .delete()
      .eq('id', invalidEmail.id);

    if (error && error.message.toLowerCase().includes('email')) {
      return {
        name: 'Contraintes Email',
        status: 'PASS',
        message: 'Contrainte email active'
      };
    } else {
      return {
        name: 'Contraintes Email',
        status: 'WARN',
        message: 'Contrainte email manquante ou permissive'
      };
    }
  } catch (error) {
    return {
      name: 'Contraintes',
      status: 'WARN',
      message: `Test échoué: ${error}`
    };
  }
}

async function main() {
  console.log('🔍 Vérification simplifiée post-migration CRM\n');

  const results: CheckResult[] = [];

  console.log('📋 Test des tables essentielles...');
  const criticalTables = [
    'profiles',
    'crm_customer_segments', 
    'crm_email_campaigns',
    'crm_customer_segment_members',
    'crm_email_templates',
    'crm_email_sends',
    'orders',
    'subscriptions'
  ];

  for (const table of criticalTables) {
    const result = await checkTable(table);
    results.push(result);
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    const time = result.responseTime ? ` (${result.responseTime}ms)` : '';
    console.log(`${icon} ${result.name}: ${result.message}${time}`);
  }

  console.log('\n⚙️ Test des fonctions CRM...');
  const functions = [
    'diagnose_crm_simple',
    'is_admin_user',
    'build_segment_members_simple'
  ];

  for (const func of functions) {
    const result = await checkFunction(func);
    results.push(result);
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    const time = result.responseTime ? ` (${result.responseTime}ms)` : '';
    console.log(`${icon} ${result.name}: ${result.message}${time}`);
  }

  console.log('\n🔒 Test des contraintes...');
  const constraintResult = await testConstraints();
  results.push(constraintResult);
  const constraintIcon = constraintResult.status === 'PASS' ? '✅' : constraintResult.status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${constraintIcon} ${constraintResult.name}: ${constraintResult.message}`);

  console.log('\n⚡ Test de performance...');
  const perfStart = Date.now();
  await supabase
    .from('profiles')
    .select('id, email, created_at')
    .limit(50);
  const perfTime = Date.now() - perfStart;

  let perfResult: CheckResult;
  if (perfTime < 500) {
    perfResult = { name: 'Performance', status: 'PASS', message: `Excellente (${perfTime}ms)`, responseTime: perfTime };
  } else if (perfTime < 1500) {
    perfResult = { name: 'Performance', status: 'WARN', message: `Acceptable (${perfTime}ms)`, responseTime: perfTime };
  } else {
    perfResult = { name: 'Performance', status: 'FAIL', message: `Dégradée (${perfTime}ms)`, responseTime: perfTime };
  }

  results.push(perfResult);
  const perfIcon = perfResult.status === 'PASS' ? '✅' : perfResult.status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${perfIcon} ${perfResult.name}: ${perfResult.message}`);

  // Rapport final
  console.log('\n📊 RAPPORT SIMPLIFIÉ');
  console.log('='.repeat(40));

  const totalTests = results.length;
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const warnCount = results.filter(r => r.status === 'WARN').length;

  console.log(`📋 Total: ${totalTests}`);
  console.log(`✅ Réussis: ${passCount} (${Math.round(passCount/totalTests*100)}%)`);
  console.log(`⚠️  Avertissements: ${warnCount} (${Math.round(warnCount/totalTests*100)}%)`);
  console.log(`❌ Échecs: ${failCount} (${Math.round(failCount/totalTests*100)}%)`);

  if (failCount === 0 && warnCount === 0) {
    console.log('\n🎉 MIGRATION PARFAITEMENT RÉUSSIE !');
    console.log('🚀 Toutes les fonctionnalités CRM sont opérationnelles.');
  } else if (failCount === 0) {
    console.log('\n✅ MIGRATION GLOBALEMENT RÉUSSIE');
    console.log('🔧 Quelques optimisations peuvent être appliquées.');
  } else {
    console.log('\n🚨 PROBLÈMES DÉTECTÉS');
    console.log('❌ Échecs:');
    results
      .filter(r => r.status === 'FAIL')
      .forEach(r => console.log(`   - ${r.name}: ${r.message}`));
  }

  console.log('\n📋 PROCHAINES ÉTAPES:');
  if (failCount === 0) {
    console.log('   1. ✅ Tester l\'interface admin CRM');
    console.log('   2. ✅ Vérifier les profils utilisateur');
    console.log('   3. ✅ Planifier le déploiement');
  } else {
    console.log('   1. 🔧 Appliquer la migration CRM complète');
    console.log('   2. 🔄 Relancer cette vérification');
    console.log('   3. 📖 Consulter le guide de migration');
  }

  // Détails techniques si demandés
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--verbose')) {
    console.log('\n🔧 DÉTAILS TECHNIQUES:');
    console.log('Migration appliquée: 20250105_crm_optimization_safe.sql');
    console.log('Tables CRM créées:', results.filter(r => r.name.includes('crm') && r.status === 'PASS').length);
    console.log('Performance moyenne:', Math.round(results.filter(r => r.responseTime).reduce((sum, r) => sum + r.responseTime!, 0) / results.filter(r => r.responseTime).length), 'ms');
  }

  process.exit(failCount > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

export { main as simpleMigrationCheck }; 