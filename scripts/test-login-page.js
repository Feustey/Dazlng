#!/usr/bin/env node

/**
 * Script de test de la nouvelle page de connexion
 * Vérifie que la nouvelle interface est bien déployée
 */

const https = require('https');

const DOMAIN = 'https://www.dazno.de';
const VERCEL_DOMAIN = 'https://nextjs-boilerplate-rbfib1m5m-feusteys-projects.vercel.app';

console.log('🔍 Test de la nouvelle page de connexion...\n');

// Textes caractéristiques de la nouvelle page
const expectedTexts = [
  'Connexion à Daz3',
  'Choisissez votre méthode de connexion',
  'Email OTP',
  'Lightning Network',
  'Wallet / Node'
];

function testPage(url, label) {
  return new Promise((resolve) => {
    console.log(`Testing ${label}...`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const foundTexts = expectedTexts.filter(text => data.includes(text));
        const cacheHeader = res.headers['x-vercel-cache'] || 'N/A';
        const age = res.headers['age'] || '0';
        
        console.log(`  Status: ${res.statusCode}`);
        console.log(`  Cache: ${cacheHeader}`);
        console.log(`  Age: ${age}s`);
        console.log(`  Found texts: ${foundTexts.length}/${expectedTexts.length}`);
        
        if (foundTexts.length >= 3) {
          console.log(`  ✅ ${label} - Nouvelle page détectée !`);
          console.log(`  Textes trouvés: ${foundTexts.join(', ')}`);
          resolve(true);
        } else {
          console.log(`  ❌ ${label} - Ancienne page encore présente`);
          console.log(`  Textes trouvés: ${foundTexts.join(', ')}`);
          resolve(false);
        }
        console.log('');
      });
    }).on('error', (err) => {
      console.log(`  ❌ ${label} - Erreur: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  // Test avec différents cache-busters
  const timestamp = Date.now();
  
  const tests = [
    { url: `${VERCEL_DOMAIN}/auth/login`, label: 'Direct Vercel' },
    { url: `${DOMAIN}/auth/login?v=${timestamp}`, label: 'Main domain avec cache-buster' },
    { url: `${DOMAIN}/auth/login?t=${timestamp}&r=${Math.random()}`, label: 'Main domain avec double cache-buster' }
  ];
  
  let successCount = 0;
  
  for (const test of tests) {
    const success = await testPage(test.url, test.label);
    if (success) successCount++;
    
    // Petit délai entre les tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('='.repeat(60));
  console.log(`📊 Résultats: ${successCount}/${tests.length} tests réussis`);
  
  if (successCount > 0) {
    console.log('🎉 La nouvelle page de connexion est déployée !');
    console.log('');
    console.log('✨ Nouvelles fonctionnalités :');
    console.log('• Interface de sélection de méthode de connexion');
    console.log('• Composant OTP Login dédié');
    console.log('• Composant Lightning Login avec Alby');
    console.log('• Composant Wallet/Node Login');
    console.log('• UX améliorée avec navigation entre méthodes');
    console.log('');
    
    if (successCount === tests.length) {
      console.log('✅ Toutes les URLs affichent la nouvelle page');
    } else {
      console.log('⚠️ Propagation en cours - le cache CDN se met à jour progressivement');
      console.log('💡 Utilisez Ctrl+F5 ou navigation privée pour voir la nouvelle version');
    }
    
    console.log('');
    console.log('🔗 Testez sur : https://www.dazno.de/auth/login');
    
  } else {
    console.log('❌ La nouvelle page n\'est pas encore accessible');
    console.log('⏱️ Le déploiement peut prendre quelques minutes supplémentaires');
  }
}

main(); 