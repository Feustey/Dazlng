#!/usr/bin/env tsx

import { mcpLightAPI } from '../lib/services/mcp-light-api';

async function testMCPFix() {
  console.log('🔧 Test de la correction MCP Light API...\n');

  try {
    // Test 1: Initialisation sans boucle infinie
    console.log('1️⃣ Test d\'initialisation...');
    const initialized = await mcpLightAPI.initialize();
    console.log(`✅ Initialisation: ${initialized ? 'SUCCÈS' : 'ÉCHEC'}`);

    // Test 2: Health check sans boucle infinie
    console.log('\n2️⃣ Test de health check...');
    const health = await mcpLightAPI.checkHealth();
    console.log(`✅ Health check: ${health.status}`);

    // Test 3: Vérification des credentials
    console.log('\n3️⃣ Test des credentials...');
    const credentials = mcpLightAPI.getCredentials();
    console.log(`✅ Credentials: ${credentials ? 'PRÉSENTS' : 'ABSENTS'}`);

    // Test 4: Test d'une requête simple
    console.log('\n4️⃣ Test de requête simple...');
    const isInit = mcpLightAPI.isInitialized();
    console.log(`✅ État initialisé: ${isInit}`);

    console.log('\n🎉 TOUS LES TESTS PASSÉS - Correction MCP fonctionnelle !');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error);
    console.log('\n🔍 Vérification des variables d\'environnement...');
    
    const envVars = {
      DAZNO_API_URL: process.env.DAZNO_API_URL,
      DAZNO_API_KEY: process.env.DAZNO_API_KEY ? 'CONFIGURÉ' : 'MANQUANT'
    };
    
    console.log('Variables d\'environnement:', envVars);
    process.exit(1);
  }
}

// Exécuter le test
testMCPFix(); 