import { fetchAndStoreNodeData, getNodeData } from '../src/lib/sparkseerService';
import type { INode } from '../models/Node';

async function testAPI() {
  try {
    console.log('🚀 Démarrage des tests...');

    // Test avec un pubkey de test (à remplacer par un vrai pubkey)
    const testPubkey = '02c16cca44562b590dd279a942765bc517485aba1298dc6046a5c3918fb724c24';
    
    console.log('📥 Test de récupération et stockage des données...');
    const storedData = await fetchAndStoreNodeData(testPubkey);
    console.log('✅ Données stockées avec succès:', storedData);

    console.log('📤 Test de récupération des données...');
    const retrievedData = await getNodeData(testPubkey);
    console.log('✅ Données récupérées avec succès:', retrievedData);

    console.log('✨ Tous les tests ont réussi !');
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

testAPI(); 