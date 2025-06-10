#!/usr/bin/env node

/**
 * Script de test pour l'API Priorities Enhanced
 * Teste l'endpoint /api/dazno/priorities-enhanced/{pubkey}
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Clé publique de test (remplacez par une vraie clé publique)
const TEST_PUBKEY = '03a5b467e1c13bbf6c423d3b1f997236f08b53136c039d7b76ae335016dc8a2249'

// Configuration des différents tests
const TEST_SCENARIOS = [
  {
    name: 'Optimisation des revenus',
    context: 'Je veux maximiser mes revenus de routage sur les 3 prochains mois',
    goals: ['increase_revenue', 'optimize_channels']
  },
  {
    name: 'Amélioration de la centralité',
    context: 'Je veux devenir un hub central dans le réseau Lightning',
    goals: ['improve_centrality', 'increase_revenue']
  },
  {
    name: 'Réduction des coûts',
    context: 'Je veux réduire mes coûts tout en maintenant la performance',
    goals: ['reduce_costs', 'improve_reliability']
  }
]

// Fonction utilitaire pour afficher les résultats
function displayResults(scenario, data) {
  console.log('\n' + '='.repeat(80))
  console.log(`SCÉNARIO: ${scenario.name}`)
  console.log('='.repeat(80))
  
  // Résumé du nœud
  console.log('\n📊 RÉSUMÉ DU NŒUD:')
  console.log(`   Alias: ${data.node_summary.alias}`)
  console.log(`   Capacité: ${data.node_summary.capacity_btc} BTC`)
  console.log(`   Canaux: ${data.node_summary.channel_count}`)
  console.log(`   Rang de centralité: ${data.node_summary.centrality_rank}`)
  console.log(`   Score de santé: ${data.node_summary.health_score}/100`)
  
  if (data.node_summary.routing_performance) {
    console.log(`   Taux de succès: ${data.node_summary.routing_performance.success_rate}%`)
    console.log(`   Revenus 7j: ${data.node_summary.routing_performance.revenue_7d} sats`)
  }
  
  // Analyse AI
  console.log('\n🤖 ANALYSE AI:')
  console.log(`   Score d'opportunité: ${data.ai_analysis.opportunity_score}/100`)
  console.log(`   Résumé: ${data.ai_analysis.summary}`)
  
  if (data.ai_analysis.key_insights.length > 0) {
    console.log('\n   Points clés:')
    data.ai_analysis.key_insights.forEach(insight => {
      console.log(`   • ${insight}`)
    })
  }
  
  console.log(`\n   Évaluation des risques: ${data.ai_analysis.risk_assessment}`)
  
  // Plan d'action
  console.log('\n📋 PLAN D\'ACTION:')
  
  if (data.action_plan.immediate_actions.length > 0) {
    console.log('\n   🚨 Actions immédiates:')
    data.action_plan.immediate_actions.forEach((action, i) => {
      console.log(`   ${i + 1}. ${action}`)
    })
  }
  
  if (data.action_plan.short_term_goals.length > 0) {
    console.log('\n   🎯 Objectifs court terme:')
    data.action_plan.short_term_goals.forEach((goal, i) => {
      console.log(`   ${i + 1}. ${goal}`)
    })
  }
  
  console.log(`\n   🔮 Vision long terme: ${data.action_plan.long_term_vision}`)
  
  // Top 3 actions prioritaires détaillées
  console.log('\n🎯 TOP 3 ACTIONS PRIORITAIRES:')
  data.priority_actions.slice(0, 3).forEach((action, i) => {
    console.log(`\n   ${i + 1}. ${action.action}`)
    console.log(`      Priorité: ${action.priority} | Difficulté: ${action.difficulty} | Urgence: ${action.urgency || 'normale'}`)
    console.log(`      Timeline: ${action.timeline}`)
    console.log(`      Impact attendu: ${action.expected_impact}`)
    
    if (action.implementation_details) {
      console.log(`      Temps estimé: ${action.implementation_details.estimated_hours || 'N/A'} heures`)
      
      if (action.implementation_details.steps.length > 0) {
        console.log('      Étapes:')
        action.implementation_details.steps.forEach((step, j) => {
          console.log(`        ${j + 1}. ${step}`)
        })
      }
      
      if (action.implementation_details.tools_needed && action.implementation_details.tools_needed.length > 0) {
        console.log(`      Outils: ${action.implementation_details.tools_needed.join(', ')}`)
      }
    }
    
    if (action.metrics_to_track && action.metrics_to_track.length > 0) {
      console.log(`      Métriques: ${action.metrics_to_track.join(', ')}`)
    }
  })
}

// Fonction principale pour tester l'API
async function testPrioritiesEnhanced(pubkey, scenario) {
  try {
    console.log(`\n🔄 Test du scénario: ${scenario.name}...`)
    
    const response = await fetch(`${BASE_URL}/api/dazno/priorities-enhanced/${pubkey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: scenario.context,
        goals: scenario.goals,
        depth: 'detailed',
        logActivity: false // Désactivé pour les tests
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Erreur inconnue')
    }
    
    displayResults(scenario, result.data)
    
    // Statistiques
    console.log('\n📈 STATISTIQUES:')
    console.log(`   Nombre total d'actions: ${result.data.priority_actions.length}`)
    console.log(`   Actions faciles: ${result.data.priority_actions.filter(a => a.difficulty === 'low').length}`)
    console.log(`   Actions moyennes: ${result.data.priority_actions.filter(a => a.difficulty === 'medium').length}`)
    console.log(`   Actions difficiles: ${result.data.priority_actions.filter(a => a.difficulty === 'high').length}`)
    
    return result.data
    
  } catch (error) {
    console.error(`\n❌ Erreur pour le scénario "${scenario.name}":`, error.message)
    return null
  }
}

// Fonction pour tester tous les scénarios
async function runAllTests() {
  console.log('🚀 Démarrage des tests de l\'API Priorities Enhanced')
  console.log(`📍 URL de base: ${BASE_URL}`)
  console.log(`🔑 Pubkey de test: ${TEST_PUBKEY}`)
  
  for (const scenario of TEST_SCENARIOS) {
    await testPrioritiesEnhanced(TEST_PUBKEY, scenario)
    
    // Pause entre les tests pour éviter le rate limiting
    if (TEST_SCENARIOS.indexOf(scenario) < TEST_SCENARIOS.length - 1) {
      console.log('\n⏳ Pause de 2 secondes...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  console.log('\n✅ Tests terminés!')
}

// Test unique avec une pubkey personnalisée
async function testSinglePubkey(pubkey) {
  console.log(`\n🔍 Test avec la pubkey: ${pubkey}`)
  
  const scenario = {
    name: 'Analyse complète personnalisée',
    context: 'Analyse complète pour optimisation globale du nœud',
    goals: ['increase_revenue', 'improve_centrality', 'optimize_channels']
  }
  
  await testPrioritiesEnhanced(pubkey, scenario)
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2)

if (args.length > 0) {
  // Si une pubkey est fournie en argument, tester uniquement celle-ci
  const pubkey = args[0]
  if (!/^[0-9a-fA-F]{66}$/.test(pubkey)) {
    console.error('❌ Erreur: La pubkey doit faire 66 caractères hexadécimaux')
    process.exit(1)
  }
  testSinglePubkey(pubkey)
} else {
  // Sinon, exécuter tous les tests
  runAllTests()
}

// Export pour utilisation dans d'autres scripts
module.exports = {
  testPrioritiesEnhanced,
  TEST_SCENARIOS,
  displayResults
}