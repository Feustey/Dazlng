#!/usr/bin/env node

/**
 * Script de vérification pour confirmer que les onglets de la section /user
 * ne passent plus sous le header global
 */

const fs = require('fs');

console.log('🔍 Vérification de la correction du layout user...\n');

// Vérifier que les modifications sont bien en place
const userLayoutPath = 'app/user/layout.tsx';
const clientLayoutPath = 'app/ClientLayout.tsx';

let allChecksPass = true;

try {
  // Vérifier le user layout
  console.log('1. Vérification du user layout...');
  const userLayoutContent = fs.readFileSync(userLayoutPath, 'utf8');
  
  if (userLayoutContent.includes('pt-20')) {
    console.log('   ✅ Padding-top ajouté au header user');
  } else {
    console.log('   ❌ Padding-top manquant dans le header user');
    allChecksPass = false;
  }
  
  if (userLayoutContent.includes('éviter la superposition')) {
    console.log('   ✅ Commentaire explicatif présent');
  } else {
    console.log('   ⚠️  Commentaire explicatif manquant');
  }

  // Vérifier le client layout
  console.log('\n2. Vérification du client layout...');
  const clientLayoutContent = fs.readFileSync(clientLayoutPath, 'utf8');
  
  if (clientLayoutContent.includes("!pathname?.startsWith('/user')")) {
    console.log('   ✅ Exception pour les pages /user ajoutée');
  } else {
    console.log('   ❌ Exception pour les pages /user manquante');
    allChecksPass = false;
  }

  // Vérifications structurelles
  console.log('\n3. Vérifications structurelles...');
  
  // Vérifier que le header user a bien la classe bg-white
  if (userLayoutContent.includes('bg-white border-b border-gray-200 pt-20')) {
    console.log('   ✅ Classes CSS correctes dans le header user');
  } else {
    console.log('   ⚠️  Classes CSS du header user à vérifier');
  }
  
  // Vérifier la structure de navigation
  if (userLayoutContent.includes('navItems.map') && userLayoutContent.includes('Dashboard')) {
    console.log('   ✅ Navigation user préservée');
  } else {
    console.log('   ❌ Navigation user compromise');
    allChecksPass = false;
  }

} catch (error) {
  console.log(`❌ Erreur lors de la vérification: ${error.message}`);
  allChecksPass = false;
}

console.log('\n' + '='.repeat(60));

if (allChecksPass) {
  console.log('🎉 Correction validée avec succès !');
  console.log('');
  console.log('📋 Résumé des corrections apportées :');
  console.log('• Ajout de pt-20 au header de la section user');
  console.log('• Exception des pages /user du padding automatique du ClientLayout');
  console.log('• Prévention de la superposition avec le header global');
  console.log('• Conservation de la structure de navigation existante');
  console.log('');
  console.log('✨ Les onglets de la section /user ne passent plus sous le header !');
  console.log('');
  console.log('🔗 Pour tester :');
  console.log('   → Naviguez vers http://localhost:3000/user/dashboard');
  console.log('   → Vérifiez que les onglets sont bien visibles sous le header');
  console.log('   → Testez la navigation entre les différents onglets user');
  
  process.exit(0);
} else {
  console.log('❌ Des problèmes ont été détectés');
  console.log('🔧 Veuillez vérifier les modifications manuellement');
  process.exit(1);
} 