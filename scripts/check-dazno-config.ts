import { mcpLightAPI } from '../lib/services/mcp-light-api'
import { logger } from '../lib/logger'

async function checkConfig() {
  logger.info('🔍 Vérification de la configuration Dazno API...')

  // Vérifier les variables d'environnement
  const requiredEnvVars = ['DAZNO_API_URL', 'DAZNO_API_KEY']
  const missingEnvVars = requiredEnvVars.filter(v => !process.env[v])
  
  if (missingEnvVars.length > 0) {
    logger.error('❌ Variables d'environnement manquantes:', missingEnvVars.join(', '))
    process.exit(1)
  }

  try {
    // Tester l'initialisation de l'API
    await mcpLightAPI.initialize()
    logger.info('✅ API initialisée avec succès')

    // Tester la connexion
    const health = await mcpLightAPI.checkHealth()
    logger.info('✅ API accessible:', health)

    // Tester les credentials
    const credentials = mcpLightAPI.getCredentials()
    if (!credentials) {
      throw new Error('Credentials non disponibles')
    }
    logger.info('✅ Credentials valides')

    logger.info('✅ Configuration Dazno API validée avec succès !')
    process.exit(0)
  } catch (error) {
    logger.error('❌ Erreur lors de la vérification:', error)
    process.exit(1)
  }
}

checkConfig().catch(error => {
  logger.error('❌ Erreur inattendue:', error)
  process.exit(1)
}) 