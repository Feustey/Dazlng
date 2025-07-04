#!/usr/bin/env tsx

/**
 * Script de test pour les endpoints cross-domain Token For Good
 * 
 * Usage:
 * npm run test:cross-domain-session
 *

import { CrossDomainSessionService } from '../lib/services/cross-domain-sessio\n;

async function testCrossDomainSession() {
  console.log('🧪 Test des endpoints cross-domain Token For Good\n);

  // Test 1: Vérification session (simulation)
  console.log('1️⃣ Test vérification session:');
  try {
    const sessionResult = await CrossDomainSessionService.verifySession();
    console.log('   ✅ Session vérifiée:', sessionResult);
  } catch (error) {
    console.log('   ❌ Erreur vérification session:', error);
  }

  // Test 2: Génération token JWT
  console.log(\n2️⃣ Test génération token JWT:');
  try {
    const testUser = {
      id: 'test-user-123',
      email: 'test@dazeno.de',
      name: 'Test User'
    };
    const token = CrossDomainSessionService.generateTokenForGood(testUser);
    console.log('   ✅ Token généré:', token.substring(0, 50) + '...');
    
    // Test 3: Vérification token JWT
    console.log(\n3️⃣ Test vérification token JWT:');
    const verifiedUser = CrossDomainSessionService.verifyTokenForGood(token);
    console.log('   ✅ Token vérifié:', verifiedUser);
  } catch (error) {
    console.log('   ❌ Erreur génération/vérification token:', error);
  }

  // Test 4: URL de redirection
  console.log(\n4️⃣ Test URL de redirection:');
  try {
    const testUser = {
      id: 'test-user-123',
      email: 'test@dazeno.de',
      name: 'Test User'
    };
    const redirectUrl = CrossDomainSessionService.createTokenForGoodRedirect(testUser);
    console.log('   ✅ URL de redirection:', redirectUrl);
  } catch (error) {
    console.log('   ❌ Erreur génération URL:', error);
  }

  // Test 5: Headers CORS
  console.log(\n5️⃣ Test headers CORS:');
  try {
    const corsHeaders = CrossDomainSessionService.getCorsHeaders();
    console.log('   ✅ Headers CORS:', corsHeaders);
  } catch (error) {
    console.log('   ❌ Erreur headers CORS:', error);
  }

  console.log(\n🎯 Tests terminés !');
  console.log(\n📋 Endpoints disponibles:');
  console.log('   GET  /api/auth/verify-session - Vérification session (cookie)');
  console.log('   POST /api/auth/verify-session - Vérification session (Bearer)');
  console.log('   GET  /api/auth/redirect-token-for-good - Redirection avec toke\n);
  console.log(\n🔗 URLs de test:');
  console.log('   http://localhost:3000/api/auth/verify-sessio\n);
  console.log('   http://localhost:3000/api/auth/redirect-token-for-good');
}

// Exécution du test
testCrossDomainSession().catch(console.error); 