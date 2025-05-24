// Script de test pour les APIs d'authentification
// Usage: node test-auth.js

const BASE_URL = 'http://localhost:3000';

async function testSendCode() {
  console.log('🧪 Test envoi de code...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    if (response.ok) {
      console.log('✅ Envoi de code réussi');
    } else {
      console.log('❌ Erreur envoi de code:', response.status);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

async function testVerifyCode() {
  console.log('🧪 Test vérification de code...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', code: '123456' })
    });
    
    const result = await response.text();
    console.log('📝 Réponse vérification:', response.status, result);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

async function testCreateInvoice() {
  console.log('🧪 Test création de facture...');
  try {
    const response = await fetch(`${BASE_URL}/api/create-invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000, description: 'Test facture' })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Facture créée:', result.invoice.id);
      return result.invoice.id;
    } else {
      console.log('❌ Erreur création facture:', response.status);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

async function testCheckInvoice(invoiceId) {
  console.log('🧪 Test vérification de facture...');
  try {
    const response = await fetch(`${BASE_URL}/api/check-invoice?id=${invoiceId}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Statut facture:', result.status, result.isTest ? '(test)' : '');
    } else {
      console.log('❌ Erreur vérification facture:', response.status);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests d\'authentification\n');
  
  await testSendCode();
  console.log('');
  
  await testVerifyCode();
  console.log('');
  
  const invoiceId = await testCreateInvoice();
  console.log('');
  
  if (invoiceId) {
    await testCheckInvoice(invoiceId);
  }
  
  console.log('\n✨ Tests terminés');
}

// Vérifier si fetch est disponible (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ Ce script nécessite Node.js 18+ avec fetch intégré');
  console.log('💡 Ou installez node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests().catch(console.error); 