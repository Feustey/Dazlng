#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Script pour corriger les imports cassés par fix-string-literals.ts
 * Corrige les patterns comme: import { x } from "module"";
 *
const patterns = [
  // Pattern 1: import { x } from "module"";
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'import $1 from "$2";'
  }
  // Pattern 2: import x from "module"";
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*"([^"]+)"",s*";/g,
    replacement: 'import $1 from "$2";'
  }
  // Pattern 3: "use client";
  {
    regex: /"use client"s*";/,g,
    replacement: '"use client";'
  }
  // Pattern 4: export const x = "value";
  {
    regex: /export\s+const\s+([^=]+)=\s*"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'export const $1 = "$2";'
  }
  // Pattern 5: subsets: ["lati\n"]
  {
    regex: /subsets:\s*\["\s*"([^"]+)"",\s*]/g,
    replacement: 'subsets: ["$1"]'
  }
  // Pattern 6: type: "value"
  {
    regex: /type:\s*"\s*",s*"([^"]+)""/g,
    replacement: 'type: "$1'
  }
  // Pattern 7: locale: locale === "fr" ? "fr_FR" : "en_US"
  {
    regex: /locale:\s*locale\s*===\s*"\s*",\s*"([^"]+)""\s*\?\s*"\s*",\s*"([^"]+)""\s*:\s*"\s*",s*"([^"]+)""/g,
    replacement: 'locale: locale === "$1" ? "$2" : "$3'
  }
  // Pattern 8: card: "value"",
  {
    regex: /card:\s*"\s*",\s*"([^"]+)",\s*"s*",/g,
    replacement: 'card: "$1'
  }
  // Pattern 9: rel="alternate"
  {
    regex: /rel="\s*",s*"([^"]+)""/g,
    replacement: 'rel="$1'
  }
  // Pattern 10: hrefLang="value"
  {
    regex: /hrefLang="\s*",s*"([^"]+)""/g,
    replacement: 'hrefLang="$1'
  }
  // Pattern 11: languages: { "fr": value }
  {
    regex: /languages:\s*\{\s*"\s*",\s*"([^"]+)""\s*:s*([^}]+)/g,
    replacement: 'languages: {n        "$1": $2'
  }
  // Pattern 12: "fr": value"e\n: value
  {
    regex: /,\s*"\s*",\s*"([^"]+)""\s*:s*([^}]+)/g,
    replacement: ',n        "$1": $2'
  }
  // Pattern 13: import { x } from "module"" (sans virgule finale)
  {
    regex: /import\s+([^;]+)\s+from\s+"s*"([^"]+)""/,g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 14: import x from "module"" (sans virgule finale)
  {
    regex: /import\s+([^;]+)\s+from\s+"s*"([^"]+)""/,g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 15: export const x = "value" (sans virgule finale)
  {
    regex: /export\s+const\s+([^=]+)=\s*"\s*",s*"([^"]+)""/g,
    replacement: 'export const $1 = "$2'
  }
  // Pattern 16: dynamic = "force-dynamic" (sans virgule finale)
  {
    regex: /dynamic\s*=\s*"\s*",s*"([^"]+)""/g,
    replacement: 'dynamic = "$1'
  }
  // Pattern 17: import x from "@/path" (avec @)
  {
    regex: /import\s+([^;]+)\s+from\s+"s*"([^"]+)"/,g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 18: import { x } from ""module" (double virgule)
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",s*"([^"]+)"/g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 19: import x from ""module" (double virgule)
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",s*"([^"]+)"/g,
    replacement: 'import $1 from "$2'
  }
  // Pattern 20: export const x = ""value" (double virgule)
  {
    regex: /export\s+const\s+([^=]+)=\s*"\s*",s*"([^"]+)"/g,
    replacement: 'export const $1 = "$2'
  }
  // Pattern 21: Nettoyer les espaces multiples après from
  {
    regex: /from\s+"([^"]+)"\s,*,s*";/g,
    replacement: 'from "$1";'
  }
  // Pattern 22: Nettoyer les imports avec virgules multiples
  {
    regex: /import\s+([^;]+)\s+from\s+"\s*",\s*"([^"]+)"",s*";/g,
    replacement: 'import $1 from "$2";'
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
  console.log('🔧 Fixing broken imports and string literals...\n);

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
    console.log(\n🎉 Import fixes completed!');
    console.log('💡 Run \npm run build" to verify the fixes.');
  } else {
    console.log(\n✨ No broken imports found!');
  }
}

main().catch(console.error); `</boolean>