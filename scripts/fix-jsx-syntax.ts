#!/usr/bin/env ts-node

import fs from 'fs';
import { glob } from 'glob';

/**
 * Script pour corriger spécifiquement les erreurs de syntaxe JSX
 * - Corrige les balises mal fermées
 * - Corrige les expressions JSX mal formatées
 * - Corrige les props mal formatées
 */

const JSX_FIXES = [
  // Corrections de balises JSX mal fermées
  { pattern: /<([a-zA-Z][a-zA-Z0-9]*)\s*>\s*<\/\1>/g, replacement: '<$1></$1>' },
  { pattern: /<([a-zA-Z][a-zA-Z0-9]*)\s*\/\s*>/g, replacement: '<$1 />' },
  
  // Corrections de props mal formatées
  { pattern: /onChange\s*=\s*{\s*\(e\)\s*=>\s*set([A-Z][a-zA-Z]*)\s*\(\s*e\.target\.value\s*\)\s*,?\s*}/g, replacement: 'onChange={(e) => set$1(e.target.value)}' },
  { pattern: /onChange\s*=\s*{\s*\(e\)\s*=>\s*set([A-Z][a-zA-Z]*)\s*\(\s*e\.target\.value\.replace\s*\(\s*\/[^\/]+\/g\s*,\s*""\s*\)\.slice\s*\(\s*0\s*,\s*6\s*\)\s*\)\s*,?\s*}/g, replacement: 'onChange={(e) => set$1(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}' },
  
  // Corrections de virgules mal placées dans les objets
  { pattern: /,\s*}/g, replacement: '}' },
  { pattern: /,\s*]/g, replacement: ']' },
  { pattern: /,\s*\)/g, replacement: ')' },
  
  // Corrections de chaînes de caractères mal fermées
  { pattern: /"([^"]*),"/g, replacement: '"$1"' },
  { pattern: /'([^']*),'/g, replacement: "'$1'" },
  
  // Corrections de nombres mal formatés
  { pattern: /(\d+),(\d+)/g, replacement: '$1.$2' },
  
  // Corrections de types mal formatés
  { pattern: /:\s*React\.ComponentType<React>>/g, replacement: ': React.ComponentType<React.SVGProps<SVGSVGElement>>' },
  { pattern: /:\s*([a-zA-Z][a-zA-Z0-9]*),/g, replacement: ': $1' },
  
  // Corrections de expressions conditionnelles mal formatées
  { pattern: /{\s*([^}]+)\s*>\s*=\s*0\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"\s*}/g, replacement: '{$1 >= 0 ? "$2" : "$3"}' },
  
  // Corrections de fragments JSX mal formatés
  { pattern: /<>\s*<\/>/g, replacement: '<></>' },
  
  // Corrections de commentaires mal formatés
  { pattern: /{\s*\/\*\s*([^*]+)\s*\*\/\s*}/g, replacement: '{/* $1 */}' },
  
  // Corrections de props mal formatées
  { pattern: /className\s*=\s*"([^"]*),"/g, replacement: 'className="$1"' },
  { pattern: /href\s*=\s*"([^"]*),"/g, replacement: 'href="$1"' },
  
  // Corrections de variables mal formatées
  { pattern: /{\s*([a-zA-Z][a-zA-Z0-9]*)\s*,/g, replacement: '{$1' },
  { pattern: /,\s*([a-zA-Z][a-zA-Z0-9]*)\s*}/g, replacement: ', $1}' },
  
  // Corrections de fonctions mal formatées
  { pattern: /\(\s*\)\s*=>\s*{\s*return\s*\(\s*</g, replacement: '() => (<' },
  { pattern: />\s*\)\s*;\s*}/g, replacement: '>);' },
  
  // Corrections de map mal formatés
  { pattern: /\.map\s*\(\s*\(([^)]+)\)\s*=>\s*\(\s*</g, replacement: '.map(($1) => (<' },
  { pattern: />\s*\)\s*\)\s*\)/g, replacement: '>))' },
  
  // Corrections de ternaires mal formatés
  { pattern: /\?\s*\(\s*</g, replacement: '? (<' },
  { pattern: />\s*\)\s*:\s*\(\s*</g, replacement: '>) : (<' },
  { pattern: />\s*\)\s*\)/g, replacement: '>)' },
];

async function fixJSXFile(filePath: string): Promise<boolean> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fixedContent = content;
    let hasChanges = false;
    
    for (const fix of JSX_FIXES) {
      const newContent = fixedContent.replace(fix.pattern, fix.replacement);
      if (newContent !== fixedContent) {
        fixedContent = newContent;
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ JSX corrigé: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur lors de la correction JSX de ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔧 Correction automatique des erreurs de syntaxe JSX...');
  
  // Chercher tous les fichiers JSX/TSX
  const files = await glob('*/*.{tsx,jsx}', {
    ignore: [
      \node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.d.ts'
    ]
  });
  
  let totalFixed = 0;
  let totalFiles = 0;
  
  for (const file of files) {
    totalFiles++;
    const wasFixed = await fixJSXFile(file);
    if (wasFixed) {
      totalFixed++;
    }
  }
  
  console.log(`\n📊 Résumé JSX:`);
  console.log(`   - Fichiers traités: ${totalFiles}`);
  console.log(`   - Fichiers corrigés: ${totalFixed}`);
  console.log(`   - Fichiers inchangés: ${totalFiles - totalFixed}`);
  
  if (totalFixed > 0) {
    console.log(`\n✅ Correction JSX terminée avec succès!`);
  } else {
    console.log(`\nℹ️  Aucune correction JSX nécessaire.`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { fixJSXFile, JSX_FIXES }; 