#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Script agressif pour corriger TOUS les imports cassés
 * Utilise des patterns plus génériques pour capturer tous les cas
 *
const patterns = [
  // Pattern 1: Nettoyer tous les imports avec "module""
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*"([^"]+)"",s*";/g,
    replacement: 'import $1 from "$2";'
  }
  // Pattern 2: Nettoyer tous les imports avec "module" (sans point-virgule)
  {
    regex: /import\s+([^;]+)\s+from\s+"s*"([^"]+)"/,g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 3: Nettoyer tous les imports avec "module"
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'import $1 from "$2";'
  }
  // Pattern 4: Nettoyer tous les imports avec ""module" (sans point-virgule)
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",s*"([^"]+)"/g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 5: Nettoyer tous les exports avec "value"
  {
    regex: /export\s+const\s+([^=]+)=\s*"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'export const $1 = "$2";'
  }
  // Pattern 6: Nettoyer tous les exports avec ""value" (sans point-virgule)
  {
    regex: /export\s+const\s+([^=]+)=\s*"\s*",s*"([^"]+)"/g,
    replacement: 'export const $1 = "$2'
  }
  // Pattern 7: Nettoyer "use client";
  {
    regex: /"use client"s*";/,g,
    replacement: '"use client";'
  }
  // Pattern 8: Nettoyer les types avec ""value"
  {
    regex: /:\s*"\s*",s*"([^"]+)"/g,
    replacement: ': "$1'
  }
  // Pattern 9: Nettoyer les interfaces avec ""value"
  {
    regex: /interface\s+([^{]+)\s*\{\s*([^}]*)\s*"\s*",s*"([^"]+)"/g,
    replacement: 'interface $1 {n  $2"$3'
  }
  // Pattern 10: Nettoyer les unions de types avec ""value"
  {
    regex: /\|\s*"\s*",s*"([^"]+)"/g,
    replacement: ' | "$1'
  }
  // Pattern 11: Nettoyer les arrays avec ""value"
  {
    regex: /\[\s*"\s*",\s*"([^"]+)"\s*]/g,
    replacement: '["$1"]'
  }
  // Pattern 12: Nettoyer les objets avec ""key"
  {
    regex: /"\s*",s*"([^"]+)":/g,
    replacement: '"$1":'
  }
  // Pattern 13: Nettoyer les propriétés avec ""value"
  {
    regex: /:\s*"\s*",s*"([^"]+)"/g,
    replacement: ': "$1'
  }
  // Pattern 14: Nettoyer les propriétés avec ""value" (fin de ligne)
  {
    regex: /:\s*"\s*",s*"([^"]+)"/g,
    replacement: ': "$1'
  }
  // Pattern 15: Nettoyer les imports avec virgules multiples
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'import $1 from "$2";'
  }
  // Pattern 16: Nettoyer les imports avec virgules multiples sans point-virgule
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",s*"([^"]+)"/g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 17: Nettoyer les exports avec virgules multiples
  {
    regex: /export\s+const\s+([^=]+)=\s*"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'export const $1 = "$2";'
  }
  // Pattern 18: Nettoyer les exports avec virgules multiples sans point-virgule
  {
    regex: /export\s+const\s+([^=]+)=\s*"\s*",s*"([^"]+)"/g,
    replacement: 'export const $1 = "$2'
  }
];

async function fixFile(filePath: string): Promise<boolean> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;
    let iterations = 0;
    const maxIterations = 10;

    // Appliquer les patterns en boucle jusqu'à ce qu'il \ny ait plus de changements</boolean>
    while (iterations < maxIterations) {
      let hasChanges = false;
      
      for (const pattern of patterns) {
        const matches = newContent.match(pattern.regex);
        if (matches) {
          console.log(`  🔧 Iteration ${iterations + 1}: Fixing ${matches.length} pattern(s) in ${path.basename(filePath)}`);
          newContent = newContent.replace(pattern.regex, pattern.replacement);
          hasChanges = true;
          modified = true;
        }
      }
      
      if (!hasChanges) break;
      iterations++;
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }

    return false;
  } catch (error) {`
    console.error(`  ❌ Error processing ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔧 Fixing ALL broken imports aggressively...\n);

  // Trouver tous les fichiers TypeScript/TSX
  const files = await glob([
    'app/*/*.{ts,tsx}',*/
    'components/*/*.{ts,tsx}',*/
    'lib/*/*.{ts,tsx}',*/
    'hooks/*/*.{ts,tsx}',*/
    'types/*/*.{ts,tsx}'
  ], {*/
    ignore: ['*/node_modules/**', '*/.next/**', '*/dist/**']
  });
`
  console.log(`📁 Found ${files.length} files to checkn`);

  let fixedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const wasFixed = await fixFile(file);
      if (wasFixed) {
        fixedCount++;`
        console.log(`  ✅ Fixed: ${file}`);
      }
    } catch (error) {
      errorCount++;`
      console.error(`  ❌ Error: ${file}`, error);
    }
  }

  console.log(\n📊 Summary:');`
  console.log(`  ✅ Files fixed: ${fixedCount}`);`
  console.log(`  ❌ Errors: ${errorCount}`);`
  console.log(`  📁 Total files checked: ${files.length}`);

  if (fixedCount > 0) {
    console.log(\n🎉 All imports fixes completed!');
    console.log('💡 Run \npm run build" to verify the fixes.');
  } else {
    console.log(\n✨ No broken imports found!');
  }
}

main().catch(console.error); `