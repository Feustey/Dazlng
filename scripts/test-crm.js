#!/usr/bin/env node

/**
 * Script de test pour le CRM DazNode
 * Teste les fonctionnalités principales du système CRM
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testDatabaseTables() {
  console.log('\n🗄️  Test des tables de base de données...');
  
  const tables = [
    'crm_customer_segments',
    'crm_customer_segment_members', 
    'crm_email_campaigns',
    'crm_email_templates',
    'crm_email_sends'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.error(`❌ Erreur table ${table}:`, error.message);
      } else {
        console.log(`✅ Table ${table} accessible`);
      }
    } catch (err) {
      console.error(`❌ Exception table ${table}:`, err.message);
    }
  }
}

async function testViews() {
  console.log('\n👁️  Test des vues de base de données...');
  
  const views = [
    'crm_segment_stats',
    'crm_campaign_stats'
  ];

  for (const view of views) {
    try {
      const { data, error } = await supabase.from(view).select('*').limit(1);
      if (error) {
        console.error(`❌ Erreur vue ${view}:`, error.message);
      } else {
        console.log(`✅ Vue ${view} accessible`);
      }
    } catch (err) {
      console.error(`❌ Exception vue ${view}:`, err.message);
    }
  }
}

async function testSegmentCreation() {
  console.log('\n🎯 Test de création de segment...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/crm/segments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Segment CRM',
        description: 'Segment de test créé automatiquement',
        criteria: {
          profile: {
            email_verified: true
          }
        },
        auto_update: true
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Segment créé avec succès:', result.data?.name);
      return result.data?.id;
    } else {
      const error = await response.text();
      console.error('❌ Erreur création segment:', error);
    }
  } catch (err) {
    console.error('❌ Exception création segment:', err.message);
  }
  
  return null;
}

async function testCampaignCreation() {
  console.log('\n📧 Test de création de campagne...');
  
  try {
    // D'abord, récupérer un segment existant
    const { data: segments } = await supabase
      .from('crm_customer_segments')
      .select('id')
      .limit(1);

    if (!segments || segments.length === 0) {
      console.error('❌ Aucun segment disponible pour la campagne');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/crm/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Campagne CRM',
        subject: 'Email de test CRM',
        content: '<h1>Bonjour {{prenom}} !</h1><p>Ceci est un test du CRM DazNode.</p>',
        segment_ids: [segments[0].id]
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Campagne créée avec succès:', result.data?.name);
      return result.data?.id;
    } else {
      const error = await response.text();
      console.error('❌ Erreur création campagne:', error);
    }
  } catch (err) {
    console.error('❌ Exception création campagne:', err.message);
  }
  
  return null;
}

async function testDefaultData() {
  console.log('\n📋 Test des données par défaut...');
  
  // Vérifier les segments par défaut
  const { data: segments, error: segmentError } = await supabase
    .from('crm_customer_segments')
    .select('name');

  if (segmentError) {
    console.error('❌ Erreur lecture segments:', segmentError.message);
  } else {
    console.log(`✅ ${segments.length} segments trouvés:`, segments.map(s => s.name).join(', '));
  }

  // Vérifier les templates par défaut
  const { data: templates, error: templateError } = await supabase
    .from('crm_email_templates')
    .select('name, category');

  if (templateError) {
    console.error('❌ Erreur lecture templates:', templateError.message);
  } else {
    console.log(`✅ ${templates.length} templates trouvés:`, templates.map(t => `${t.name} (${t.category})`).join(', '));
  }
}

async function runTests() {
  console.log('🚀 Début des tests CRM DazNode\n');
  console.log('Configuration:');
  console.log(`- Supabase URL: ${SUPABASE_URL}`);
  console.log(`- API Base URL: ${API_BASE_URL}`);
  
  await testDatabaseTables();
  await testViews();
  await testDefaultData();
  await testSegmentCreation();
  await testCampaignCreation();
  
  console.log('\n✅ Tests CRM terminés');
  console.log('\n📖 Pour accéder au CRM:');
  console.log(`   Naviguez vers: ${API_BASE_URL}/admin/crm`);
  console.log('\n📚 Documentation complète:');
  console.log('   Consultez: app/admin/crm/README.md');
}

// Exécution
runTests().catch(console.error); 