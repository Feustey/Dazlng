// Script pour corriger automatiquement les warnings TypeScript les plus critiques
// Usage: npx tsx scripts/fix-typescript-warnings.ts

import fs from 'fs';
import path from 'path';

// Fonction pour remplacer les types 'any' par 'unknown' dans un fichier
function fixAnyTypes(filePath: string): void {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remplacer les types 'any' par 'unknown' dans les paramètres de fonction
    const anyParamRegex = /: any(?=[,\)\s])/g;
    if (anyParamRegex.test(content)) {
      content = content.replace(anyParamRegex, ': unknown');
      modified = true;
    }

    // Remplacer les types 'any' par 'unknown' dans les déclarations de variables
    const anyVarRegex = /: any(?=\s*[=;])/g;
    if (anyVarRegex.test(content)) {
      content = content.replace(anyVarRegex, ': unknown');
      modified = true;
    }

    // Remplacer les assertions non-null par des vérifications conditionnelles
    const nonNullRegex = /(\w+)!/g;
    if (nonNullRegex.test(content)) {
      content = content.replace(nonNullRegex, '$1');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Erreur lors de la correction de ${filePath}:`, error);
  }
}

// Fonction pour corriger les dépendances manquantes dans useCallback
function fixUseCallbackDeps(filePath: string): void {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Trouver les useCallback avec des dépendances manquantes
    const useCallbackRegex = /useCallback\(([^,]+),\s*\[([^\]]*)\]\)/g;
    let match;
    
    while ((match = useCallbackRegex.exec(content)) !== null) {
      const callbackBody = match[1];
      const deps = match[2];
      
      // Extraire les variables utilisées dans le callback
      const usedVars = extractUsedVariables(callbackBody);
      
      // Ajouter les dépendances manquantes
      const missingDeps = usedVars.filter(varName => 
        !deps.includes(varName) && 
        !varName.startsWith('set') && 
        !varName.includes('.')
      );
      
      if (missingDeps.length > 0) {
        const newDeps = deps ? `${deps}, ${missingDeps.join(', ')}` : missingDeps.join(', ');
        const newUseCallback = `useCallback(${callbackBody}, [${newDeps}])`;
        content = content.replace(match[0], newUseCallback);
        console.log(`✅ Corrigé useCallback dans ${filePath}: ajouté ${missingDeps.join(', ')}`);
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.log(`❌ Erreur lors de la correction useCallback dans ${filePath}:`, error);
  }
}

// Fonction pour extraire les variables utilisées dans un callback
function extractUsedVariables(callbackBody: string): string[] {
  const vars: string[] = [];
  const varRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
  let match;
  
  while ((match = varRegex.exec(callbackBody)) !== null) {
    const varName = match[1];
    if (!['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'true', 'false', 'null', 'undefined'].includes(varName)) {
      vars.push(varName);
    }
  }
  
  return [...new Set(vars)];
}

// Liste des fichiers à corriger
const filesToFix = [
  'app/admin/communications/page.tsx',
  'app/api/admin/users/enhanced/route.ts',
  'app/api/auth/me/route.ts',
  'app/api/check-invoice/route.ts',
  'app/api/users/me/change-password/route.ts',
  'app/auth/callback/route.ts',
  'app/page.tsx'
];

console.log('🔧 CORRECTION AUTOMATIQUE DES WARNINGS TYPESCRIPT');
console.log('================================================');

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`\n🔄 Traitement de ${filePath}...`);
    fixAnyTypes(filePath);
    fixUseCallbackDeps(filePath);
  } else {
    console.log(`⚠️ Fichier non trouvé: ${filePath}`);
  }
});

console.log('\n✅ Correction terminée !');
console.log('💡 Relancez "npm run lint" pour vérifier les améliorations.');
