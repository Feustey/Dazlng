#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Dépendances à supprimer (redondantes ou inutiles)
const dependenciesToRemove = [
  'react-icons', // Remplacé par lucide-react
  '@heroicons/react', // Remplacé par lucide-react
  'aos', // Remplacé par nos animations CSS optimisées
  'critters', // Déprécié, Next.js gère déjà l'optimisation CSS
];

// Dépendances de développement à supprimer
const devDependenciesToRemove = [
  // Aucune pour l'instant
];

function cleanupPackageJson() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    let hasChanges = false;
    
    // Nettoyer les dépendances
    dependenciesToRemove.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        delete packageJson.dependencies[dep];
        console.log(`🗑️  Supprimé: ${dep} (dependencies)`);
        hasChanges = true;
      }
    });
    
    // Nettoyer les devDependencies
    devDependenciesToRemove.forEach(dep => {
      if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        delete packageJson.devDependencies[dep];
        console.log(`🗑️  Supprimé: ${dep} (devDependencies)`);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      // Réécrire le package.json avec une indentation propre
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log('\n✅ package.json nettoyé avec succès!');
      console.log('💡 Exécutez "npm install" pour mettre à jour node_modules');
    } else {
      console.log('ℹ️  Aucune dépendance à supprimer trouvée.');
    }
    
    return hasChanges;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage du package.json:', error.message);
    return false;
  }
}

function analyzeBundleSize() {
  console.log('\n📊 Analyse des dépendances:');
  console.log('========================');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  // Dépendances problématiques connues
  const problematicDeps = [
    { name: 'react-icons', size: '~150KB', issue: 'Remplacé par lucide-react' },
    { name: '@heroicons/react', size: '~50KB', issue: 'Remplacé par lucide-react' },
    { name: 'aos', size: '~30KB', issue: 'Remplacé par animations CSS optimisées' },
    { name: 'framer-motion', size: '~200KB', issue: 'Considérer pour les animations complexes uniquement' },
    { name: 'chart.js', size: '~100KB', issue: 'Utilisé uniquement si nécessaire' },
    { name: 'recharts', size: '~150KB', issue: 'Utilisé uniquement si nécessaire' },
  ];
  
  problematicDeps.forEach(dep => {
    if (allDeps[dep.name]) {
      console.log(`⚠️  ${dep.name}: ${dep.size} - ${dep.issue}`);
    }
  });
  
  console.log('\n💡 Recommandations:');
  console.log('1. Utilisez lucide-react pour toutes les icônes');
  console.log('2. Remplacez AOS par des animations CSS optimisées');
  console.log('3. Chargez les bibliothèques de graphiques en lazy loading');
  console.log('4. Utilisez Framer Motion uniquement pour les animations complexes');
}

function main() {
  console.log('🧹 Début du nettoyage des dépendances...\n');
  
  const cleaned = cleanupPackageJson();
  analyzeBundleSize();
  
  if (cleaned) {
    console.log('\n🎉 Nettoyage terminé!');
    console.log('📝 Prochaines étapes:');
    console.log('   1. npm install');
    console.log('   2. npm run build');
    console.log('   3. npm run analyze:bundle');
    console.log('   4. Vérifier que tout fonctionne');
  }
}

main(); 