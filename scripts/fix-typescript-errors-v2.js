#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour corriger les types React
function fixReactTypes(content) {
  // Corriger les retours de type Element
  content = content.replace(
    /return \(\s*<([^>]+)>\s*([^<]*)<\/\1>\s*\);\s*}/g,
    'return <$1>$2</$1>;\n}'
  );

  // Corriger les composants React.FC avec syntaxe incorrecte
  content = content.replace(
    /const (\w+): React\.FC => {/g,
    'const $1: React.FC = () => {'
  );

  content = content.replace(
    /export const (\w+): React\.FC => {/g,
    'export const $1: React.FC = () => {'
  );

  // Corriger les composants React.FC avec double définition
  content = content.replace(
    /const (\w+): React\.FC = \(\): React\.FC/g,
    'const $1: React.FC'
  );

  // Ajouter les imports React manquants
  if (content.includes('React.') && !content.includes('import React')) {
    content = "import React from 'react';\\n + content;
  }

  return content;
}

// Fonction pour corriger les erreurs de null safety
function fixNullSafety(content) {
  // Initialiser les propriétés privées
  content = content.replace(
    /private (\w+): (\w+);/g,
    'private $1: $2 | null = null;'
  );

  // Ajouter des vérifications de null
  content = content.replace(
    /this\.(\w+)\./g,
    (match, prop) => `this.${prop}?.`
  );

  return content;
}

// Fonction pour corriger les imports
function fixImports(content, filePath) {
  // Corriger les imports de types Lightning
  if (filePath.includes('services/')) {
    content = content.replace(
      /import {([^}]+)} from '\.\/lightning-service';/g,
      (match, imports) => {
        const cleanedImports = imports
          .split('')
          .map(i => i.trim())
          .filter(i => !['Invoice', 'CreateInvoiceParams', 'InvoiceStatus'].includes(i))
          .join(', ');
        return `import { ${cleanedImports} } from './lightning-service';\nimport type { Invoice, CreateInvoiceParams, InvoiceStatus } from '@/types/lightning';`;
      }
    );
  }

  // Corriger les imports de composants UI
  if (content.includes('import { Button }')) {
    content = content.replace(
      /import { Button } from/g,
      'import Button from'
    );
  }

  return content;
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Appliquer les corrections
    if (filePath.endsWith('.tsx')) {
      content = fixReactTypes(content);
    }
    
    if (filePath.includes('services/')) {
      content = fixNullSafety(content);
    }
    
    content = fixImports(content, filePath);
    
    // Écrire le fichier seulement s'il y a des changements
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Corrigé: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
  }
}

// Fonction pour parcourir récursivement les dossiers
function processDirectory(dirPath, extensions = ['.tsx', '.ts']) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Ignorer certains dossiers
      if (![\node_modules', '.next', '.git', 'build', 'dist'].includes(item)) {
        processDirectory(fullPath, extensions);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(fullPath);
      if (extensions.includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

// Démarrer le traitement
console.log('🔧 Correction des erreurs TypeScript v2...');
processDirectory('./app');
processDirectory('./components');
processDirectory('./lib');
console.log('✨ Correction terminée !'); 