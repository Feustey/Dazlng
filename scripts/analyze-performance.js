#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Analyse des performances DazNode\\n);

// 1. Build de production
console.log('📦 Build de production...');
try {
  execSync(\npm run build', { stdio: 'inherit' });
  console.log('✅ Build terminé\\n);
} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}

// 2. Analyse des bundles
console.log('📊 Analyse des bundles...');
try {
  const buildDir = path.join(process.cwd(), '.next');
  
  // Lire les stats des bundles
  if (fs.existsSync(buildDir)) {
    console.log('📈 Tailles des bundles :');
    
    // Analyser les fichiers statiques
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      const analyzeDir = (dir, prefix = '') => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            analyzeDir(filePath, `${prefix}${file}/`);
          } else {
            const sizeKB = (stat.size / 1024).toFixed(2);
            if (stat.size > 50 * 1024) { // Fichiers > 50KB
              console.log(`  📁 ${prefix}${file}: ${sizeKB} KB`);
            }
          }
        });
      };
      
      analyzeDir(staticDir);
    }
  }
  console.log('');
} catch (error) {
  console.warn('⚠️  Impossible d\'analyser les bundles:', error.message);
}

// 3. Recommandations
console.log('💡 Recommandations de performance :\\n);

const recommendations = [
  {
    category: '🖼️  Images',
    items: [
      'Utiliser OptimizedImage pour toutes les images',
      'Définir priority={true} pour les images above-the-fold',
      'Utiliser des formats WebP/AVIF quand possible',
      'Optimiser les tailles avec les deviceSizes appropriés'
    ]
  },
  {
    category: '📱 JavaScript',
    items: [
      'Code splitting avec React.lazy() pour les gros composants',
      'Utiliser dynamic imports pour les bibliothèques tierces',
      'Minimiser les re-renders avec useMemo/useCallback',
      'Lazy loading pour les listes avec LazyList'
    ]
  },
  {
    category: '🗄️  Cache',
    items: [
      'Utiliser useCache pour les données API',
      'Service Worker activé en productio\n,
      'Headers de cache optimisés (31536000s pour les assets)',
      'Cache-Control approprié pour les API responses'
    ]
  },
  {
    category: '🌐 Réseau',
    items: [
      'DNS prefetch pour les domaines externes',
      'Preconnect pour les APIs critiques',
      'Resource hints pour les assets importants',
      'HTTP/2 Server Push si disponible'
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

// 4. Tests recommandés
console.log('🧪 Tests de performance recommandés :\\n);
console.log('  🔍 Lighthouse CLI :');
console.log('     npx lighthouse http://localhost:3000 --view\\n);
console.log('  📊 Bundle Analyzer :');
console.log('     ANALYZE=true npm run build\\n);
console.log('  ⚡ Web Vitals :');
console.log('     Ouvrir DevTools > Lighthouse > Performance\\n);

console.log('✨ Analyse terminée ! Consultez PERFORMANCE_OPTIMIZATIONS.md pour plus de détails.'); 