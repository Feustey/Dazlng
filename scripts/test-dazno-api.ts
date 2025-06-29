import { config } from 'dotenv'
import { mcpLightAPI } from '../lib/services/mcp-light-api'

config()

const TEST_PUBKEY = '03eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619'

async function testEndpoints() {
  try {
    console.log('🔄 Initialisation de MCPLightAPI...')
    await mcpLightAPI.initialize()
    console.log('✅ MCPLightAPI initialisé avec succès')

    // Test des recommandations
    console.log('\n🔄 Test des recommandations...')
    const recommendations = await mcpLightAPI.getRecommendations(TEST_PUBKEY)
    console.log('✅ Recommandations récupérées:', {
      pubkey: recommendations.pubkey,
      count: recommendations.recommendations.length,
      timestamp: recommendations.timestamp
    })

    // Test des priorités
    console.log('\n🔄 Test des priorités...')
    const priorities = await mcpLightAPI.getPriorityActions(TEST_PUBKEY)
    console.log('✅ Priorités récupérées:', {
      pubkey: priorities.pubkey,
      count: priorities.priority_actions.length,
      timestamp: priorities.timestamp
    })

    // Test de l'analyse complète
    console.log('\n🔄 Test de l\'analyse complète...')
    const analysis = await mcpLightAPI.analyzeNode(TEST_PUBKEY)
    console.log('✅ Analyse complète récupérée:', {
      pubkey: analysis.pubkey,
      timestamp: analysis.timestamp,
      health_score: analysis.summary.health_score
    })

    console.log('\n✅ Tous les tests ont réussi !')

  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error)
    process.exit(1)
  }
}

testEndpoints().catch(console.error) 