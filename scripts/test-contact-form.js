#!/usr/bin/env node

/**
 * Script de test pour l'API de contact
 * Usage: node scripts/test-contact-form.js
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testContactForm() {
  console.log('🔧 Test du formulaire de contact...\n');
  
  const testData = {
    firstName: 'Test',
    lastName: 'Contact',
    email: 'test@example.com',
    interest: 'support',
    message: 'Ceci est un message de test pour vérifier que le formulaire de contact fonctionne correctement.'
  };

  console.log('📤 Envoi des données:', testData);
  
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    
    console.log('\n📥 Réponse du serveur:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('\n✅ Test réussi ! Le formulaire de contact fonctionne correctement.');
      console.log(`ID du contact créé: ${data.data?.id}`);
    } else {
      console.error('\n❌ Test échoué !');
      console.error('Erreur:', data.error);
    }
  } catch (error) {
    console.error('\n❌ Erreur lors du test:');
    console.error(error.message);
    console.error('\nAssurez-vous que le serveur est démarré sur', API_URL);
  }
}

// Exécuter le test
testContactForm();