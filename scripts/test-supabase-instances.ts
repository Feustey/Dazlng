#!/usr/bin/env ts-node

/**
 * Script de diagnostic pour les problèmes Supabase et API
 */

import { getSupabaseBrowserClient, getSupabaseAdminClient } from '@/lib/supabase';

async function runDiagnostics() {
  console.log('🔍 DIAGNOSTIC SUPABASE ET API');
  console.log('==============================');

  // Test 1: Instances Supabase
  console.log('\n1️⃣ Test instances Supabase...');
  try {
    const supabase = getSupabaseBrowserClient();
    const supabaseAdmin = getSupabaseAdminClient();
    
    console.log('✅ Client principal:', !!supabase);
    console.log('✅ Client admin:', !!supabaseAdmin);
    
    // Test de création multiple
    const supabase1 = getSupabaseBrowserClient();
    const supabase2 = getSupabaseBrowserClient();
    
    console.log('🔍 Même instance client?', supabase1 === supabase2);
    
  } catch (error) {
    console.error('❌ Erreur instances Supabase:', error);
  }

// Test 2: API create-invoice
console.log('\n2️⃣ Test endpoint create-invoice...');
try {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Test GET pour vérifier la disponibilité
  console.log('Testing GET method...');
  const getResponse = await fetch(`${BASE_URL}/api/create-invoice`, {
    method: 'GET'
  });
  
  console.log('GET Response status:', getResponse.status);
  if (getResponse.ok) {
    const getData = await getResponse.json();
    console.log('GET Response:', getData);
  } else {
    console.log('GET Error:', await getResponse.text());
  }
  
  // Test POST avec données valides
  console.log('\nTesting POST method...');
  const postResponse = await fetch(`${BASE_URL}/api/create-invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 1000,
      description: 'Test facture diagnostic'
    })
  });
  
  console.log('POST Response status:', postResponse.status);
  if (postResponse.ok) {
    const postData = await postResponse.json();
    console.log('POST Response:', postData);
  } else {
    console.log('POST Error:', await postResponse.text());
  }
  
} catch (error) {
  console.error('❌ Erreur test API:', error);
}

// Test 3: Reset et re-test
console.log('\n3️⃣ Test reset instances...');
try {
  // Test de création de nouvelles instances
  const newSupabase = getSupabaseBrowserClient();
  const newSupabaseAdmin = getSupabaseAdminClient();
  
  console.log('✅ Nouvelle instance client créée:', !!newSupabase);
  console.log('✅ Nouvelle instance admin créée:', !!newSupabaseAdmin);
  
} catch (error) {
  console.error('❌ Erreur reset:', error);
}

  console.log('\n✅ Diagnostic terminé');
}

// Exécuter le diagnostic
runDiagnostics().catch(console.error); 