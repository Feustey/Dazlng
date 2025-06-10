const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyse du bundle DazNode...\n');

// 1. Build avec analyse
console.log('📦 Construction du projet...');
try {
  process.env.ANALYZE = 'true';
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build terminé\n');
} catch (error) {
  console.error('❌ Erreur build:', error.message);
  process.exit(1);
}

// 2. Analyse des tailles de chunks
const buildDir = path.join(process.cwd(), '.next');
const staticDir = path.join(buildDir, 'static', 'chunks');

if (fs.existsSync(staticDir)) {
  console.log('📊 Tailles des chunks JavaScript:\n');
  
  const files = fs.readdirSync(staticDir)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(staticDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
        sizeMB: (stats.size / 1024 / 1024).toFixed(2)
      };
    })
    .sort((a, b) => b.size - a.size);

  // Affichage des gros fichiers
  console.log('🔴 Chunks volumineux (> 100KB):');
  const heavyFiles = files.filter(file => file.size > 100 * 1024);
  if (heavyFiles.length === 0) {
    console.log('   ✅ Aucun chunk > 100KB trouvé!');
  } else {
    heavyFiles.forEach(file => {
      console.log(`   📁 ${file.name}: ${file.sizeKB} KB`);
    });
  }

  console.log('\n🟡 Chunks moyens (50-100KB):');
  const mediumFiles = files.filter(file => file.size >= 50 * 1024 && file.size <= 100 * 1024);
  if (mediumFiles.length === 0) {
    console.log('   ✅ Aucun chunk moyen trouvé!');
  } else {
    mediumFiles.forEach(file => {
      console.log(`   📁 ${file.name}: ${file.sizeKB} KB`);
    });
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  
  console.log(`\n📦 Taille totale des chunks JS: ${totalSizeMB} MB`);

  // Alertes de performance
  if (totalSize > 3 * 1024 * 1024) { // > 3MB
    console.log('⚠️  ALERTE: Taille totale > 3MB - Optimisation recommandée');
  } else if (totalSize > 2 * 1024 * 1024) { // > 2MB
    console.log('🔶 ATTENTION: Taille totale > 2MB - Surveillance recommandée');
  } else {
    console.log('✅ Taille totale optimale');
  }
}

// 3. Analyse des CSS
const cssDir = path.join(buildDir, 'static', 'css');
if (fs.existsSync(cssDir)) {
  console.log('\n🎨 Tailles des fichiers CSS:\n');
  
  const cssFiles = fs.readdirSync(cssDir)
    .filter(file => file.endsWith('.css'))
    .map(file => {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2)
      };
    })
    .sort((a, b) => b.size - a.size);

  cssFiles.forEach(file => {
    const color = file.size > 100 * 1024 ? '🔴' : 
                  file.size > 50 * 1024 ? '🟡' : '🟢';
    console.log(`${color} ${file.name}: ${file.sizeKB} KB`);
  });

  const totalCSSSize = cssFiles.reduce((acc, file) => acc + file.size, 0);
  console.log(`\n🎨 Taille totale CSS: ${(totalCSSSize / 1024).toFixed(2)} KB`);
}

// 4. Analyse des dépendances lourdes
console.log('\n📚 Analyse des dépendances...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  // Dépendances potentiellement lourdes
  const heavyDeps = [
    '@mui/material',
    '@emotion/react',
    '@emotion/styled',
    'framer-motion',
    'recharts',
    'react-admin',
    'aos'
  ];

  const foundHeavyDeps = heavyDeps.filter(dep => dependencies[dep]);
  
  if (foundHeavyDeps.length > 0) {
    console.log('⚠️  Dépendances lourdes détectées:');
    foundHeavyDeps.forEach(dep => {
      console.log(`   📦 ${dep}: ${dependencies[dep]}`);
    });
  } else {
    console.log('✅ Aucune dépendance lourde détectée');
  }

  // Vérification des dépendances redondantes
  const redundantChecks = [
    { deps: ['@mui/material', '@emotion/react', '@emotion/styled'], name: 'Material-UI/Emotion' },
    { deps: ['aos', 'framer-motion'], name: 'Animations' },
    { deps: ['recharts', 'chart.js'], name: 'Charts' }
  ];

  redundantChecks.forEach(check => {
    const found = check.deps.filter(dep => dependencies[dep]);
    if (found.length > 1) {
      console.log(`🔶 Redondance potentielle - ${check.name}: ${found.join(', ')}`);
    }
  });

} catch (error) {
  console.log('❌ Impossible de lire package.json');
}

// 5. Recommandations
console.log('\n💡 Recommandations d\'optimisation:\n');

const recommendations = [
  {
    category: '🚀 JavaScript',
    items: [
      'Code splitting avec React.lazy() pour les composants > 50KB',
      'Utiliser dynamic imports pour les bibliothèques tierces',
      'Minimiser les re-renders avec useMemo/useCallback',
      'Lazy loading pour les composants non-critiques'
    ]
  },
  {
    category: '🖼️  Images',
    items: [
      'Utiliser OptimizedImage pour toutes les images',
      'Formats WebP/AVIF pour réduire la taille',
      'Lazy loading avec priority={true} pour above-the-fold',
      'Optimiser les tailles avec deviceSizes appropriés'
    ]
  },
  {
    category: '🗄️  Cache',
    items: [
      'Service Worker activé pour les assets statiques',
      'useOptimizedData pour les données API',
      'Headers de cache optimisés (31536000s pour les assets)',
      'Stale-while-revalidate pour les données non-critiques'
    ]
  },
  {
    category: '🎨 CSS',
    items: [
      'Purge CSS inutilisé avec Tailwind',
      'Minification avancée en production',
      'Combinaison des fichiers CSS similaires',
      'Animations CSS au lieu de JavaScript quand possible'
    ]
  },
  {
    category: '📦 Dependencies',
    items: [
      'Supprimer les dépendances inutilisées',
      'Utiliser des alternatives plus légères',
      'Tree-shaking avec imports spécifiques',
      'Bundle analyzer régulier pour monitoring'
    ]
  }
];

recommendations.forEach(rec => {
  console.log(`${rec.category}:`);
  rec.items.forEach(item => {
    console.log(`  ✓ ${item}`);
  });
  console.log('');
});

// 6. Score de performance
const calculatePerformanceScore = () => {
  let score = 100;
  
  // Pénalités
  if (totalSize > 3 * 1024 * 1024) score -= 30;
  else if (totalSize > 2 * 1024 * 1024) score -= 15;
  
  if (heavyFiles && heavyFiles.length > 0) score -= heavyFiles.length * 10;
  if (foundHeavyDeps && foundHeavyDeps.length > 0) score -= foundHeavyDeps.length * 5;
  
  return Math.max(0, score);
};

try {
  const score = calculatePerformanceScore();
  console.log(`📊 Score de performance du bundle: ${score}/100`);
  
  if (score >= 80) {
    console.log('🎉 Excellent! Votre bundle est bien optimisé');
  } else if (score >= 60) {
    console.log('👍 Bon! Quelques optimisations possibles');
  } else {
    console.log('⚠️  Attention! Optimisations recommandées');
  }
} catch (error) {
  console.log('❌ Impossible de calculer le score');
}

console.log('\n🔗 Commandes utiles:');
console.log('  npm run build:analyze  - Analyser le bundle');
console.log('  npm run test:vitals    - Tester les Web Vitals');
console.log('  npx lighthouse http://localhost:3000 --view');

console.log('\n✨ Analyse terminée!'); 