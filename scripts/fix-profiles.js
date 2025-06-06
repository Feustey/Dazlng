#!/usr/bin/env node

/**
 * Script pour corriger les problèmes de la table profiles
 * Usage: node scripts/fix-profiles.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Script de correction des profils');
console.log('=====================================\n');

// Lire le script SQL (version simplifiée)
const sqlFilePath = path.join(__dirname, '..', 'fix-profiles-simple.sql');

if (!fs.existsSync(sqlFilePath)) {
  console.error('❌ Fichier SQL non trouvé:', sqlFilePath);
  process.exit(1);
}

const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

console.log('📋 Instructions pour appliquer la migration:');
console.log('');
console.log('1. 📁 Connectez-vous à votre console Supabase');
console.log('2. 🗄️  Allez dans "SQL Editor"');
console.log('3. 📝 Copiez et collez le contenu suivant:');
console.log('');
console.log('─'.repeat(60));
console.log(sqlScript);
console.log('─'.repeat(60));
console.log('');
console.log('4. ▶️  Exécutez le script');
console.log('5. ✅ Vérifiez que "Migration terminée" s\'affiche');
console.log('');

// Vérifier si l'API peut maintenant fonctionner
console.log('🧪 Test de l\'API après migration:');
console.log('');
console.log('curl -X GET http://localhost:3000/api/user/profile \\');
console.log('  -H "Authorization: Bearer YOUR_TOKEN"');
console.log('');

console.log('🎯 Ce que cette migration corrige:');
console.log('• ✅ Ajoute les champs manquants: phone, phone_verified, profile_score');
console.log('• ✅ Corrige la fonction ensure_profile_exists()');
console.log('• ✅ Ajoute les contraintes de validation');
console.log('• ✅ Crée les index de performance');
console.log('• ✅ Met en place le calcul automatique du score de profil');
console.log('');

console.log('📊 Après la migration, redémarrez votre serveur de dev:');
console.log('npm run dev'); 