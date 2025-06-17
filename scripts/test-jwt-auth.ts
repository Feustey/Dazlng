import { generateJWT } from './generate-jwt';
import fetch from 'node-fetch';

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testJWT() {
  console.log('🔍 Test de l\'authentification JWT pour dazno.de\n');

  // 1. Générer un token JWT
  console.log('1. Génération du token JWT...');
  const token = generateJWT('dazno-de', ['read', 'write']);
  console.log('✅ Token généré:', token.substring(0, 20) + '...\n');

  // 2. Tester une requête sans token
  console.log('2. Test sans token...');
  try {
    const _response = await fetch(`${API_URL}/api/v1/health`);
    console.log('❌ La requête aurait dû échouer sans token');
  } catch (error) {
    console.log('✅ La requête a été rejetée comme prévu\n');
  }

  // 3. Tester avec un token valide
  console.log('3. Test avec token valide...');
  try {
    const response = await fetch(`${API_URL}/api/v1/health`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://dazno.de'
      }
    });
    
    if (response.ok) {
      console.log('✅ Requête réussie avec token valide\n');
    } else {
      console.log('❌ Erreur:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Erreur lors de la requête:', error);
  }

  // 4. Tester avec une origine invalide
  console.log('4. Test avec origine invalide...');
  try {
    const response = await fetch(`${API_URL}/api/v1/health`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://evil.com'
      }
    });
    
    if (response.status === 403) {
      console.log('✅ Origine invalide rejetée comme prévu\n');
    } else {
      console.log('❌ La requête aurait dû être rejetée');
    }
  } catch (error) {
    console.log('❌ Erreur lors de la requête:', error);
  }

  // 5. Tester le rate limiting
  console.log('5. Test du rate limiting...');
  const requests = Array(15).fill(null).map(() => 
    fetch(`${API_URL}/api/v1/health`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://dazno.de'
      }
    })
  );

  try {
    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.status === 429);
    
    if (rateLimited) {
      console.log('✅ Rate limiting fonctionne comme prévu\n');
    } else {
      console.log('❌ Le rate limiting n\'a pas été déclenché');
    }
  } catch (error) {
    console.log('❌ Erreur lors des requêtes:', error);
  }

  console.log('🎯 Tests terminés !');
}

// Exécuter les tests
testJWT().catch(console.error); 