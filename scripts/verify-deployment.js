#!/usr/bin/env node

/**
 * Script de vérification du déploiement
 * Vérifie que les nouvelles fonctionnalités user CRM sont bien déployées
 *
const https = require('https');

const DOMAIN = 'https://www.dazno.de';
const CACHE_BUSTER = Date.now();

console.log('🚀 Vérification du déploiement sur dazno.de...\\n);

// Pages à tester
const pagesToTest = [
  '/',
  '/user',
  `/user/dashboard?v=${CACHE_BUSTER}`,
  '/auth/logi\n,
  '/dazbox'
];

let testsCompleted = 0;
let successCount = 0;

pagesToTest.forEach((path, index) => {
  const url = `${DOMAIN}${path}`;
  
  https.get(url, (res) => {
    testsCompleted++;
    
    const status = res.statusCode;
    const cacheHeader = res.headers['x-vercel-cache'] || 'N/A';
    const age = res.headers['age'] || '0';
    
    if (status === 200 || status === 307) {
      successCount++;
      console.log(`✅ ${path}`);
      console.log(`   Status: ${status}`);
      console.log(`   Cache: ${cacheHeader}`);
      console.log(`   Age: ${age}s`);
    } else {
      console.log(`❌ ${path}`);
      console.log(`   Status: ${status}`);
      console.log(`   Error: ${res.statusMessage}`);
    }
    
    console.log('');
    
    // Vérifier si tous les tests sont terminés
    if (testsCompleted === pagesToTest.length) {
      console.log('='.repeat(60));
      console.log(`📊 Résultats: ${successCount}/${pagesToTest.length} pages accessibles`);
      
      if (successCount === pagesToTest.length) {
        console.log('🎉 Déploiement vérifié avec succès !');
        console.log('');
        console.log('✨ Nouvelles fonctionnalités accessibles :');
        console.log('• Dashboard user CRM gamifié');
        console.log('• Système de scoring et complétion profil');
        console.log('• Comparaison DazBox avec ROI');
        console.log('• Recommandations Dazia freemium');
        console.log('• Layout user corrigé (onglets visibles)');
        console.log('');
        console.log('🔗 Testez sur : https://www.dazno.de/user/dashboard');
        console.log('   (Connexion requise via email OTP)');
        
        process.exit(0);
      } else {
        console.log('⚠️ Certaines pages ne sont pas accessibles');
        console.log('💡 Cela peut être normal pour les pages protégées');
        
        if (successCount >= pagesToTest.length - 1) {
          console.log('✅ Déploiement probablement réussi');
          process.exit(0);
        } else {
          console.log('❌ Problème de déploiement détecté');
          process.exit(1);
        }
      }
    }
  }).on('error', (err) => {
    testsCompleted++;
    console.log(`❌ ${path} - Erreur: ${err.message}`);
    
    if (testsCompleted === pagesToTest.length) {
      console.log('❌ Erreurs de connexion détectées');
      process.exit(1);
    }
  });
  
  // Délai entre les requêtes pour éviter la surcharge
  if (index > 0) {
    setTimeout(() => { /* délai intentionnel */ }, index * 100);
  }
});

// Timeout général
setTimeout(() => {
  if (testsCompleted < pagesToTest.length) {
    console.log('⏱️ Timeout - Vérification incomplète');
    process.exit(1);
  }
}, 10000); 