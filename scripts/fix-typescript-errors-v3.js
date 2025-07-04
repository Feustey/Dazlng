#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour corriger les types React
function fixReactTypes(content) {
  // Corriger les retours de type Element
  content = content.replace(
    /: React\.FC = \(\) => {[\s\S]*?return \(/g,
    ': React.FC = () => ('
  );

  // Corriger les composants avec props
  content = content.replace(
    /interface (\w+)Props {([^}]+)}/g,
    (match, name, props) => {
      const cleanedProps = props
        .split('\\n)
        .map(line => line.trim())
        .filter(line => line)
        .join('\n  ');
      return `interface ${name}Props {\n  ${cleanedProps}\n}`;
    }
  );

  // Ajouter les imports React manquants
  if (content.includes('React.') && !content.includes('import React')) {
    content = "import React from 'react';\\n + content;
  }

  return content;
}

// Fonction pour corriger les erreurs de null safety
function fixNullSafety(content) {
  // Corriger les accès aux propriétés potentiellement nulles
  content = content.replace(
    /this\.(\w+)\./g,
    'this.$1?.'
  );

  // Corriger les initialisations de propriétés
  content = content.replace(
    /private (\w+): (\w+);/g,
    'private $1: $2 | null = null;'
  );

  // Ajouter des vérifications de null pour les promesses
  content = content.replace(
    /await (\w+)\.(\w+)/g,
    'await ($1 ?? Promise.reject(new Error("$1 is null"))).$2'
  );

  return content;
}

// Fonction pour corriger les types Lightning
function fixLightningTypes(content) {
  // Corriger les types d'état des factures
  content = content.replace(
    /'(pending|settled|expired|failed)'/g,
    'InvoiceStatus.$1'
  );

  // Ajouter l'enum InvoiceStatus si nécessaire
  if (content.includes('InvoiceStatus.') && !content.includes('enum InvoiceStatus')) {
    content = content.replace(
      /(import[^;]+;)/,
      '$1\n\nenum InvoiceStatus {\n  pending = "pending",\n  settled = "settled",\n  expired = "expired",\n  failed = "failed"\n}'
    );
  }

  // Corriger les imports de types Lightning
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

  return content;
}

// Fonction pour corriger les erreurs de typage
function fixTypingErrors(content) {
  // Corriger les erreurs de type string | undefined
  content = content.replace(
    /process\.env\.(\w+)/g,
    'process.env.$1 ?? "'
  );

  // Corriger les erreurs de type any implicite
  content = content.replace(
    /\(([\w\s,]+)\) =>/g,
    (match, params) => {
      const typedParams = params
        .split('')
        .map(param => {
          param = param.trim();
          if (!param.includes(':')) {
            return `${param}: any`;
          }
          return param;
        })
        .join(', ');
      return `(${typedParams}) =>`;
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
    if (filePath.endsWith('.tsx')) {
      content = fixReactTypes(content);
    }
    
    if (filePath.includes('services/')) {
      content = fixNullSafety(content);
      content = fixLightningTypes(content);
    }
    
    content = fixTypingErrors(content);
    
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
console.log('🔧 Correction des erreurs TypeScript v3...');
processDirectory('./app');
processDirectory('./components');
processDirectory('./lib');
processDirectory('./utils');
console.log('✨ Correction terminée !'); 