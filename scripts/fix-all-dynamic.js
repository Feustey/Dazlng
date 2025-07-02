const fs = require('fs');
const path = require('path');

// Toutes les pages qui échouent lors du build
const problematicPages = [
  'app/[locale]/page.tsx',
  'app/page.tsx',
  'app/about/page.tsx',
  'app/account/page.tsx',
  'app/auth/error/page.tsx',
  'app/auth/verify-code/page.tsx',
  'app/auth/verify-request/page.tsx',
  'app/contact/page.tsx',
  'app/dazbox/page.tsx',
  'app/dazflow/page.tsx',
  'app/daznode/demo/page.tsx',
  'app/daznode/page.tsx',
  'app/dazpay/page.tsx',
  'app/demo/page.tsx',
  'app/help/page.tsx',
  'app/instruments/page.tsx',
  'app/network/explorer/page.tsx',
  'app/network/mcp-analysis/page.tsx',
  'app/optimized-demo/page.tsx',
  'app/register/page.tsx',
  'app/terms/page.tsx',
  'app/test-header/page.tsx',
  'app/token-for-good/page.tsx'
];

function addDynamicExport(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Vérifier si l'export dynamic existe déjà
  if (content.includes('export const dynamic = \'force-dynamic\'')) {
    console.log(`✅ Déjà configuré: ${filePath}`);
    return;
  }

  // Ajouter l'export dynamic après les imports
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Trouver la fin des imports
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ') || lines[i].startsWith('"use client"')) {
      insertIndex = i + 1;
    } else if (lines[i].trim() === '' && insertIndex > 0) {
      // Continuer jusqu'à la première ligne non-vide après les imports
      continue;
    } else if (insertIndex > 0 && lines[i].trim() !== '') {
      break;
    }
  }

  // Insérer l'export dynamic
  lines.splice(insertIndex, 0, 'export const dynamic = \'force-dynamic\';');
  
  const newContent = lines.join('\n');
  fs.writeFileSync(filePath, newContent);
  console.log(`✅ Configuré: ${filePath}`);
}

console.log('🚀 Configuration de dynamic = \'force-dynamic\' pour toutes les pages...\n');

problematicPages.forEach(filePath => {
  addDynamicExport(filePath);
});

console.log('\n✅ Configuration terminée !');
console.log('📝 Toutes les pages utilisent maintenant dynamic = \'force-dynamic\'');
console.log('🔄 Relancez le build avec: npm run build'); 