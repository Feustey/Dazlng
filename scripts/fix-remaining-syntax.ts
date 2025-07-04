#!/usr/bin/env ts-node

import fs from 'fs';
import { glob } from 'glob';

/**
 * Script pour corriger les erreurs de syntaxe restantes
 * - Corrige les virgules manquantes
 * - Corrige les accolades mal fermées
 * - Corrige les parenthèses mal fermées
 */

const REMAINING_FIXES = [
  // Corrections de virgules manquantes dans les objets
  { pattern: /(\w+):\s*([^}\n]+)\s*(\n\s*)(\w+):/g, replacement: '$1: $2,\n$3$4:' },
  { pattern: /(\w+):\s*([^}\n]+)\s*(\n\s*)(\w+):/g, replacement: '$1: $2,\n$3$4:' },
  
  // Corrections de virgules manquantes dans les tableaux
  { pattern: /(\w+)\s*(\n\s*)(\w+)/g, replacement: '$1,\n$2$3' },
  
  // Corrections d'accolades mal fermées
  { pattern: /{\s*([^}]*)\s*$/gm, replacement: '{\n$1\n}' },
  
  // Corrections de parenthèses mal fermées
  { pattern: /\(\s*([^)]*)\s*$/gm, replacement: '(\n$1\n)' },
  
  // Corrections de crochets mal fermés
  { pattern: /\[\s*([^\]]*)\s*$/gm, replacement: '[\n$1\n]' },
  
  // Corrections de chaînes de caractères mal fermées
  { pattern: /"([^"]*)\s*$/gm, replacement: '"$1"' },
  { pattern: /'([^']*)\s*$/gm, replacement: "'$1'" },
  
  // Corrections de types mal formatés
  { pattern: /:\s*([a-zA-Z][a-zA-Z0-9]*)\s*(\n\s*)([a-zA-Z][a-zA-Z0-9]*):/g, replacement: ': $1,\n$2$3:' },
  
  // Corrections de propriétés d'objet mal formatées
  { pattern: /(\w+):\s*([^}\n]+)\s*(\n\s*)(\w+):/g, replacement: '$1: $2,\n$3$4:' },
  
  // Corrections de déclarations de variables mal formatées
  { pattern: /const\s+(\w+)\s*=\s*([^;]+)\s*$/gm, replacement: 'const $1 = $2;' },
  { pattern: /let\s+(\w+)\s*=\s*([^;]+)\s*$/gm, replacement: 'let $1 = $2;' },
  { pattern: /var\s+(\w+)\s*=\s*([^;]+)\s*$/gm, replacement: 'var $1 = $2;' },
  
  // Corrections de fonctions mal formatées
  { pattern: /function\s+(\w+)\s*\(\s*([^)]*)\s*\)\s*{\s*$/gm, replacement: 'function $1($2) {\\n },
  { pattern: /const\s+(\w+)\s*=\s*\(\s*([^)]*)\s*\)\s*=>\s*{\s*$/gm, replacement: 'const $1 = ($2) => {\\n },
  
  // Corrections de imports mal formatés
  { pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*"([^"]+)"\s*$/gm, replacement: 'import { $1 } from "$2";' },
  { pattern: /import\s+(\w+)\s*from\s*"([^"]+)"\s*$/gm, replacement: 'import $1 from "$2";' },
  
  // Corrections d'exports mal formatés
  { pattern: /export\s+(\w+)\s*([^;]+)\s*$/gm, replacement: 'export $1 $2;' },
  { pattern: /export\s*{\s*([^}]+)\s*}\s*$/gm, replacement: 'export { $1 };' },
  
  // Corrections de JSX mal formaté
  { pattern: /<(\w+)\s*([^>]*)\s*>\s*$/gm, replacement: '<$1 $2>' },
  { pattern: /<\/(\w+)\s*>\s*$/gm, replacement: '</$1>' },
  
  // Corrections de props JSX mal formatées
  { pattern: /(\w+)=\s*"([^"]*)\s*$/gm, replacement: '$1="$2"' },
  { pattern: /(\w+)=\s*{([^}]*)\s*$/gm, replacement: '$1={$2}' },
  
  // Corrections de ternaires mal formatés
  { pattern: /\?\s*([^:]+)\s*:\s*([^;]+)\s*$/gm, replacement: '? $1 : $2' },
  
  // Corrections de conditions mal formatées
  { pattern: /if\s*\(\s*([^)]*)\s*\)\s*{\s*$/gm, replacement: 'if ($1) {\\n },
  { pattern: /else\s*{\s*$/gm, replacement: 'else {\\n },
  
  // Corrections de boucles mal formatées
  { pattern: /for\s*\(\s*([^)]*)\s*\)\s*{\s*$/gm, replacement: 'for ($1) {\\n },
  { pattern: /while\s*\(\s*([^)]*)\s*\)\s*{\s*$/gm, replacement: 'while ($1) {\\n },
  
  // Corrections de try/catch mal formatés
  { pattern: /try\s*{\s*$/gm, replacement: 'try {\\n },
  { pattern: /catch\s*\(\s*([^)]*)\s*\)\s*{\s*$/gm, replacement: 'catch ($1) {\\n },
  
  // Corrections de classes mal formatées
  { pattern: /class\s+(\w+)\s*{\s*$/gm, replacement: 'class $1 {\\n },
  { pattern: /constructor\s*\(\s*([^)]*)\s*\)\s*{\s*$/gm, replacement: 'constructor($1) {\\n },
  
  // Corrections d'interfaces mal formatées
  { pattern: /interface\s+(\w+)\s*{\s*$/gm, replacement: 'interface $1 {\\n },
  { pattern: /type\s+(\w+)\s*=\s*([^;]+)\s*$/gm, replacement: 'type $1 = $2;' },
  
  // Corrections de modules mal formatés
  { pattern: /module\s+(\w+)\s*{\s*$/gm, replacement: 'module $1 {\\n },
  { pattern: /namespace\s+(\w+)\s*{\s*$/gm, replacement: \namespace $1 {\\n },
];

async function fixRemainingFile(filePath: string): Promise<boolean> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fixedContent = content;
    let hasChanges = false;
    
    for (const fix of REMAINING_FIXES) {
      const newContent = fixedContent.replace(fix.pattern, fix.replacement);
      if (newContent !== fixedContent) {
        fixedContent = newContent;
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Reste corrigé: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur lors de la correction restante de ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔧 Correction des erreurs de syntaxe restantes...');
  
  // Chercher tous les fichiers TypeScript et JavaScript
  const files = await glob('*/*.{ts,tsx,js,jsx}', {
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
    const wasFixed = await fixRemainingFile(file);
    if (wasFixed) {
      totalFixed++;
    }
  }
  
  console.log(`\n📊 Résumé restant:`);
  console.log(`   - Fichiers traités: ${totalFiles}`);
  console.log(`   - Fichiers corrigés: ${totalFixed}`);
  console.log(`   - Fichiers inchangés: ${totalFiles - totalFixed}`);
  
  if (totalFixed > 0) {
    console.log(`\n✅ Correction restante terminée avec succès!`);
  } else {
    console.log(`\nℹ️  Aucune correction restante nécessaire.`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { fixRemainingFile, REMAINING_FIXES }; 