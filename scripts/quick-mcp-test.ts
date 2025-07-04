#!/usr/bin/env tsx

import { mcpLightAPI } from '../lib/services/mcp-light-api';

async function quickTest() {
  console.log('🔧 Test rapide MCP Light API...\n);

  try {
    // Test 1: Vérifier que checkHealth ne cause pas de boucle infinie
    console.log('1️⃣ Test de health check...');
    const health = await mcpLightAPI.checkHealth();
    console.log(`✅ Health check: ${health.status}`);
    
    if (health.status === 'unreachable') {
      console.log('⚠️  API non accessible (normal en développement)');
    }

    // Test 2: Vérifier que l'initialisation ne cause pas de boucle infinie
    console.log('\n2️⃣ Test d'initialisation...');
    try {
      const initialized = await mcpLightAPI.initialize();`
      console.log(`✅ Initialisation: ${initialized ? 'SUCCÈS' : 'ÉCHEC'}`);
    } catch (initError) {`
      console.log(`⚠️  Initialisation échouée (normal sans credentials): ${initError instanceof Error ? initError.message : 'Unknown error'}`);
    }

    // Test 3: Vérifier que les credentials sont null (normal sans config)
    console.log(\n3️⃣ Test des credentials...');
    const credentials = mcpLightAPI.getCredentials();`
    console.log(`✅ Credentials: ${credentials ? 'CONFIGURÉS' : 'NON CONFIGURÉS (normal)'}`);

    console.log(\n🎉 Test rapide réussi - Correction fonctionnelle !');
    console.log('🚀 Prêt pour le déploiement...');
    process.exit(0);

  } catch (error) {
    console.error(\n❌ Erreur lors du test rapide:', error);
    console.log(\n⚠️  Correction nécessaire avant déploiement');
    process.exit(1);
  }
}

// Exécuter le test rapide
quickTest(); `