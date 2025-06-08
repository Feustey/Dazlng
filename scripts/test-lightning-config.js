#!/usr/bin/env node

/**
 * Script pour tester différentes configurations Lightning
 * et identifier la meilleure approche pour DazNode
 */

const configs = [
  {
    name: 'LNbits Demo (legend.lnbits.com)',
    endpoint: 'https://legend.lnbits.com',
    description: 'Instance publique LNbits pour tests',
    testKey: null // Nécessite une vraie clé
  },
  {
    name: 'API dazno.de (MCP-Light)',
    endpoint: 'https://api.dazno.de',
    description: 'API MCP-Light existante',
    testEndpoints: ['/health', '/api/v1/node/info']
  },
  {
    name: 'Configuration actuelle DazNode',
    endpoint: 'https://api.dazno.de',
    description: 'Configuration avec clés fournies',
    apiKey: '3fbbe7e0c2a24b43aa2c6ad6627f44eb'
  }
];

async function testConfiguration(config) {
  console.log(`\n🧪 Test: ${config.name}`);
  console.log(`📍 Endpoint: ${config.endpoint}`);
  console.log(`📝 Description: ${config.description}`);
  console.log('-'.repeat(60));

  const results = {
    accessible: false,
    apiType: 'unknown',
    endpoints: [],
    errors: []
  };

  try {
    // Test de base - accessibilité
    const response = await fetch(config.endpoint);
    results.accessible = response.ok;
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Endpoint accessible');
      console.log('📊 Réponse:', data);
      
      // Identifier le type d'API
      if (data.message && data.message.includes('MCP-Light')) {
        results.apiType = 'mcp-light';
        console.log('🔍 Type détecté: MCP-Light API');
      } else if (data.name && data.name.includes('LNbits')) {
        results.apiType = 'lnbits';
        console.log('🔍 Type détecté: LNbits');
      }
    }

    // Test des endpoints spécifiques si configurés
    if (config.testEndpoints) {
      console.log('\n📋 Test des endpoints spécifiques:');
      for (const endpoint of config.testEndpoints) {
        try {
          const testResponse = await fetch(`${config.endpoint}${endpoint}`);
          if (testResponse.ok) {
            console.log(`  ✅ ${endpoint}`);
            results.endpoints.push(endpoint);
          } else {
            console.log(`  ❌ ${endpoint} (${testResponse.status})`);
          }
        } catch (error) {
          console.log(`  ❌ ${endpoint} (erreur: ${error.message})`);
        }
      }
    }

    // Test avec clé API si fournie
    if (config.apiKey) {
      console.log('\n🔑 Test avec clé API:');
      
      const testEndpoints = [
        '/api/v1/wallet',
        '/api/v1/payments',
        '/wallet/balance',
        '/wallet/invoice'
      ];

      for (const endpoint of testEndpoints) {
        try {
          const apiResponse = await fetch(`${config.endpoint}${endpoint}`, {
            headers: {
              'X-Api-Key': config.apiKey,
              'Content-Type': 'application/json'
            }
          });
          
          if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            console.log(`  ✅ ${endpoint}:`, apiData);
          } else {
            const errorText = await apiResponse.text();
            console.log(`  ❌ ${endpoint} (${apiResponse.status}):`, errorText.substring(0, 100));
          }
        } catch (error) {
          console.log(`  ❌ ${endpoint} (erreur: ${error.message})`);
        }
      }
    }

  } catch (error) {
    results.errors.push(error.message);
    console.log(`❌ Erreur de connectivité: ${error.message}`);
  }

  return results;
}

async function generateRecommendations(testResults) {
  console.log('\n' + '='.repeat(80));
  console.log('📋 RECOMMANDATIONS POUR DAZNODE');
  console.log('='.repeat(80));

  const accessibleConfigs = testResults.filter(result => result.config.accessible);
  
  if (accessibleConfigs.length === 0) {
    console.log('❌ Aucune configuration accessible trouvée');
    console.log('\n💡 Actions recommandées:');
    console.log('1. Vérifier la connectivité réseau');
    console.log('2. Confirmer les URLs et clés API');
    console.log('3. Considérer l\'utilisation de NWC comme solution temporaire');
    return;
  }

  console.log(`✅ ${accessibleConfigs.length} configuration(s) accessible(s)\n`);

  // Analyse des résultats
  const mcpLightConfigs = testResults.filter(r => r.results.apiType === 'mcp-light');
  const lnbitsConfigs = testResults.filter(r => r.results.apiType === 'lnbits');

  if (mcpLightConfigs.length > 0) {
    console.log('🔍 MCP-Light API détectée sur api.dazno.de');
    console.log('   → Cette API est pour l\'analyse de nœuds Lightning');
    console.log('   → Ne peut pas être utilisée pour les paiements directs\n');
  }

  if (lnbitsConfigs.length > 0) {
    console.log('⚡ Instance LNbits détectée');
    console.log('   → Recommandée pour les paiements Lightning');
    console.log('   → Intégration native possible\n');
  }

  // Recommandations finales
  console.log('🎯 STRATÉGIE RECOMMANDÉE:');
  console.log('1. Système hybride multi-provider');
  console.log('2. MCP-Light pour l\'analyse de nœuds (api.dazno.de)');
  console.log('3. NWC/Alby comme provider principal pour les paiements');
  console.log('4. LNbits comme provider secondaire (quand disponible)');
  console.log('5. Mode test comme fallback ultime');

  console.log('\n📝 VARIABLES D\'ENVIRONNEMENT RECOMMANDÉES:');
  console.log('```env');
  console.log('# Provider principal (NWC/Alby)');
  console.log('NWC_URL=nostr+walletconnect://...');
  console.log('');
  console.log('# Provider secondaire (LNbits - futur)');
  console.log('LNBITS_ENDPOINT=https://lnbits.dazno.de  # Quand disponible');
  console.log('LNBITS_API_KEY=your_key_here');
  console.log('');
  console.log('# API d\'analyse (MCP-Light)');
  console.log('DAZNO_API_ENDPOINT=https://api.dazno.de');
  console.log('```');
}

async function main() {
  console.log('🚀 Test des Configurations Lightning - DazNode');
  console.log('='.repeat(80));

  const testResults = [];

  for (const config of configs) {
    const results = await testConfiguration(config);
    testResults.push({ config, results });
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await generateRecommendations(testResults);
  
  console.log('\n📊 Résumé des tests terminé:', new Date().toLocaleString('fr-FR'));
}

// Exécution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testConfiguration, generateRecommendations }; 