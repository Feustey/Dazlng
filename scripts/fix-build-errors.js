const fs = require('fs');
const path = require('path');

// Pages qui échouent lors du build et nécessitent dynamic = 'force-dynamic'
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
  'app/test-supabase/page.tsx',
  'app/token-for-good/page.tsx'
];

function addDynamicExport(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Vérifier si dynamic export existe déjà
  if (content.includes("export const dynamic = 'force-dynamic'")) {
    console.log(`✅ Déjà corrigé: ${filePath}`);
    return true;
  }

  // Ajouter l'export dynamic au début du fichier
  const lines = content.split('\n');
  let insertIndex = 0;

  // Trouver la première ligne non-vide après les imports
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('import') && !line.startsWith('"use client"') && !line.startsWith("'use client'")) {
      insertIndex = i;
      break;
    }
  }

  // Insérer l'export dynamic
  lines.splice(insertIndex, 0, "export const dynamic = 'force-dynamic';");
  
  const newContent = lines.join('\n');
  fs.writeFileSync(filePath, newContent);
  
  console.log(`✅ Corrigé: ${filePath}`);
  return true;
}

function main() {
  console.log('🔧 Correction des erreurs de build...\n');
  
  let successCount = 0;
  let totalCount = 0;

  problematicPages.forEach(pagePath => {
    totalCount++;
    if (addDynamicExport(pagePath)) {
      successCount++;
    }
  });

  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ Corrigés: ${successCount}/${totalCount}`);
  console.log(`   ❌ Échecs: ${totalCount - successCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 Toutes les pages ont été corrigées avec succès !');
  } else {
    console.log('\n⚠️  Certaines pages n\'ont pas pu être corrigées.');
  }
}

main(); 