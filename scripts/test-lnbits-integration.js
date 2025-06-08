#!/usr/bin/env node

/**
 * Script de test pour l'intégration LNbits avec api.dazno.de
 * 
 * Usage: node scripts/test-lnbits-integration.js
 */

const LNBITS_ENDPOINT = 'https://api.dazno.de';
const LNBITS_INVOICE_KEY = 'fddac5fb8bf64eec944c89255b98dac4'; // Note: à déplacer en env
const LNBITS_ADMIN_KEY = '3fbbe7e0c2a24b43aa2c6ad6627f44eb';   // Note: à déplacer en env

async function testLNbitsConnectivity() {
  console.log('🧪 Test de Connectivité LNbits - api.dazno.de');
  console.log('='.repeat(50));

  // Test 1: Health Check via Balance
  console.log('\n1️⃣ Test Health Check (Balance)');
  try {
    const response = await fetch(`${LNBITS_ENDPOINT}/wallet/balance`, {
      method: 'GET',
      headers: {
        'X-Api-Key': LNBITS_INVOICE_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Balance récupéré:', data);
    } else {
      console.log('❌ Erreur balance:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Détails:', errorText);
    }
  } catch (error) {
    console.log('❌ Erreur de connectivité:', error.message);
  }

  // Test 2: Health Check via API Native
  console.log('\n2️⃣ Test API Native LNbits');
  try {
    const response = await fetch(`${LNBITS_ENDPOINT}/api/v1/wallet`, {
      method: 'GET',
      headers: {
        'X-Api-Key': LNBITS_INVOICE_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Wallet info récupéré:', data);
    } else {
      console.log('❌ Erreur wallet info:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Erreur API native:', error.message);
  }

  // Test 3: Création de Facture (Endpoint Simplifié)
  console.log('\n3️⃣ Test Création Facture (Endpoint Simplifié)');
  try {
    const invoiceData = {
      amount: 1000, // 1000 sats
      memo: 'Test facture dazno.de - ' + new Date().toLocaleString('fr-FR'),
      expiry: 3600
    };

    const response = await fetch(`${LNBITS_ENDPOINT}/wallet/invoice`, {
      method: 'POST',
      headers: {
        'X-Api-Key': LNBITS_INVOICE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoiceData)
    });

    if (response.ok) {
      const invoice = await response.json();
      console.log('✅ Facture créée via endpoint simplifié:', {
        id: invoice.id || invoice.payment_hash,
        amount: invoiceData.amount,
        bolt11: invoice.payment_request || invoice.bolt11,
        expires: invoice.expires_at || 'non spécifié'
      });
    } else {
      console.log('❌ Erreur création facture simplifiée:', response.status);
      const errorText = await response.text();
      console.log('Détails:', errorText);
    }
  } catch (error) {
    console.log('❌ Erreur création facture:', error.message);
  }

  // Test 4: Création de Facture (API Native)
  console.log('\n4️⃣ Test Création Facture (API Native LNbits)');
  try {
    const nativeInvoiceData = {
      out: false,
      amount: 1000 * 1000, // 1000 sats en millisats
      memo: 'Test facture native LNbits - ' + new Date().toLocaleString('fr-FR'),
      expiry: 3600
    };

    const response = await fetch(`${LNBITS_ENDPOINT}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'X-Api-Key': LNBITS_INVOICE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nativeInvoiceData)
    });

    if (response.ok) {
      const invoice = await response.json();
      console.log('✅ Facture créée via API native:', {
        hash: invoice.payment_hash,
        request: invoice.payment_request,
        amount: nativeInvoiceData.amount / 1000 + ' sats'
      });
    } else {
      console.log('❌ Erreur création facture native:', response.status);
      const errorText = await response.text();
      console.log('Détails:', errorText);
    }
  } catch (error) {
    console.log('❌ Erreur API native:', error.message);
  }

  // Test 5: Liste des Transactions
  console.log('\n5️⃣ Test Liste Transactions');
  try {
    const response = await fetch(`${LNBITS_ENDPOINT}/wallet/transactions`, {
      method: 'GET',
      headers: {
        'X-Api-Key': LNBITS_INVOICE_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const transactions = await response.json();
      console.log('✅ Transactions récupérées:', {
        count: Array.isArray(transactions) ? transactions.length : 'format inconnu',
        sample: Array.isArray(transactions) && transactions.length > 0 ? transactions[0] : 'aucune'
      });
    } else {
      console.log('❌ Erreur transactions:', response.status);
    }
  } catch (error) {
    console.log('❌ Erreur récupération transactions:', error.message);
  }

  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log('📊 Résumé des Tests');
  console.log('='.repeat(50));
  console.log('API Endpoint:', LNBITS_ENDPOINT);
  console.log('Clé API:', LNBITS_INVOICE_KEY.substring(0, 8) + '...');
  console.log('Date/Heure:', new Date().toLocaleString('fr-FR'));
}

// Auto-exécution si appelé directement
if (require.main === module) {
  testLNbitsConnectivity().catch(console.error);
}

module.exports = { testLNbitsConnectivity }; 