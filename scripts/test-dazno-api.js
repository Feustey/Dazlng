#!/usr/bin/env node

/**
 * Script utilitaire pour tester l'intégration API Dazno
 * Usage: node scripts/test-dazno-api.js [pubkey]
 */

const { daznoApi } = require('../lib/dazno-api.ts');

async function testDaznoAPI(pubkey) {
  console.log('🧪 Test de l\'intégration API Dazno\n');

  try {
    // Test 1: Health check
    console.log('1️⃣  Test du health check...');
    const health = await daznoApi.checkHealth();
    console.log('   ✅ Health:', JSON.stringify(health, null, 2));

    if (pubkey) {
      console.log(`\n2️⃣  Test avec la pubkey: ${pubkey}`);
      
      // Test 2: Node info
      console.log('   📊 Récupération des infos du nœud...');
      const nodeInfo = await daznoApi.getNodeInfo(pubkey);
      console.log('   ✅ Node info:', {
        pubkey: nodeInfo.pubkey,
        alias: nodeInfo.alias,
        capacity: nodeInfo.capacity,
        channels: nodeInfo.channels,
        health_score: nodeInfo.health_score
      });

      // Test 3: Recommendations
      console.log('   💡 Récupération des recommandations...');
      const recommendations = await daznoApi.getRecommendations(pubkey);
      console.log(`   ✅ ${recommendations.length} recommandations trouvées`);
      recommendations.forEach((rec, i) => {
        console.log(`      ${i + 1}. ${rec.title} (${rec.impact}/${rec.difficulty})`);
      });

      // Test 4: Priority actions
      console.log('   🎯 Récupération des actions prioritaires...');
      const priorities = await daznoApi.getPriorityActions(pubkey, ['optimize', 'rebalance']);
      console.log(`   ✅ ${priorities.length} actions prioritaires trouvées`);
      priorities.forEach((action, i) => {
        console.log(`      ${i + 1}. ${action.action} (Impact: ${action.estimated_impact})`);
      });
    }

    console.log('\n🎉 Tests terminés avec succès !');

  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
    process.exit(1);
  }
}

// Récupérer la pubkey depuis les arguments de ligne de commande
const pubkey = process.argv[2];

if (pubkey && pubkey.length !== 66) {
  console.error('❌ Format de pubkey invalide. Elle doit contenir 66 caractères hexadécimaux.');
  process.exit(1);
}

// Lancer les tests
testDaznoAPI(pubkey).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
}); 