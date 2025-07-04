#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Script spécial pour corriger tous les imports cassés dans le dossier app
 * Corrige les patterns comme: import x from "module"";
 *
const patterns = [
  // Pattern 1: import x from "module"";
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*"([^"]+)"",s*";/g,
    replacement: 'import $1 from "$2";'
  }
  // Pattern 2: import x from "module" (sans point-virgule)
  {
    regex: /import\s+([^;]+)\s+from\s+"s*"([^"]+)"/,g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 3: import x from ""module" (double virgule)
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",s*"([^"]+)"/g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 4: import import x from "module" from "module";
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'import $1 from "$2";'
  }
  // Pattern 5: export const x = "value";
  {
    regex: /export\s+const\s+([^=]+)=\s*"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'export const $1 = "$2";'
  }
  // Pattern 6: export const x = ""value" (sans point-virgule)
  {
    regex: /export\s+const\s+([^=]+)=\s*"\s*",s*"([^"]+)"/g,
    replacement: 'export const $1 = "$2'
  }
  // Pattern 7: "use client";
  {
    regex: /"use client"s*";/,g,
    replacement: '"use client";'
  }
  // Pattern 8: Nettoyer les espaces multiples après from
  {
    regex: /from\s+"([^"]+)"\s,*,s*";/g,
    replacement: 'from "$1";'
  }
  // Pattern 9: Nettoyer les imports avec virgules multiples et espaces
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'import $1 from "$2";'
  }
  // Pattern 10: Nettoyer les imports avec virgules multiples sans point-virgule
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",s*"([^"]+)"/g,
    replacement: 'import $1 from "$2'
  }
];

async function fixFile(filePath: string): Promise<boolean> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    for (const pattern of patterns) {
      const matches = newContent.match(pattern.regex);
      if (matches) {
        console.log(`  🔧 Fixing ${matches.length} pattern(s) in ${path.basename(filePath)}`);
        newContent = newContent.replace(pattern.regex, pattern.replacement);
        modified = true;
      }
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
  console.log('🔧 Fixing broken imports in app/ directory...\n);

  // Trouver tous les fichiers TypeScript/TSX dans app
  const files = await glob([
    'app/*/*.{ts,tsx}'
  ], {*/
    ignore: ['*/node_modules/**', '*/.next/**', '*/dist/**']
  });
`
  console.log(`📁 Found ${files.length} files in app/ directoryn`);

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
    console.log(\n🎉 App imports fixes completed!');
    console.log('💡 Run \npm run build" to verify the fixes.');
  } else {
    console.log(\n✨ No broken imports found in app/ directory!');
  }
}

main().catch(console.error); `</boolean>