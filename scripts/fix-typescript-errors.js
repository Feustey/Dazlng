#!/usr/bin/env node

const fs = require('fs');

// Fonction pour corriger les types de retour incorrects
function fixIncorrectReturnTypes(content) {
  // Corriger les fonctions async qui ne devraient pas retourner React.ReactElement
  content = content.replace(
    /async function (\w+)\(\): React\.ReactElement \{/g,
    'async function $1(): Promise<void> {'
  );
  
  // Corriger les fonctions qui retournent void ou null
  content = content.replace(
    /const (\w+) = \(\): React\.ReactElement => \{\s*return;\s*\}/g,
    'const $1 = (): void => {\n    return;\n  }'
  );
  
  content = content.replace(
    /const (\w+) = \(\): React\.ReactElement => \{\s*([^}]*return null;[^}]*)\}/gs,
    'const $1 = (): React.ReactElement | null => {\n    $2}'
  );
  
  // Corriger les fonctions qui ne retournent rien
  content = content.replace(
    /const (\w+) = \(\): React\.ReactElement => \{\s*([^}]*(?!return)[^}]*)\}/gs,
    (match, funcName, body) => {
      if (!body.includes('retur\n)) {
        return `const ${funcName} = (): void => {\n    ${body.trim()}\n  }`;
      }
      return match;
    }
  );
  
  return content;
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Appliquer les corrections
    content = fixIncorrectReturnTypes(content);
    
    // Écrire le fichier seulement s'il y a des changements
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Corrigé: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
  }
}

// Fichiers spécifiques à corriger
const filesToFix = [
  'admin/pages/orders/page.tsx',
  'admin/pages/payments/page.tsx', 
  'admin/pages/subscriptions/page.tsx',
  'mobile/app/checkout/dazbox/index.tsx',
  'mobile/app/checkout/dazpay/index.tsx',
  'mobile/app/tabs/_layout.tsx',
  'mobile/app/tabs/dazpay/page.tsx'
];

console.log('🔧 Correction des erreurs TypeScript spécifiques...');
filesToFix.forEach(processFile);
console.log('✨ Correction terminée !'); 