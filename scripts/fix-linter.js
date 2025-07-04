#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour corriger les types de retour manquants pour les composants React
function fixReactComponentReturnTypes(content) {
  // Corriger les composants React sans type de retour
  content = content.replace(
    /export default function (\w+)\(\s*\)\s*{/g,
    'export default function $1(): React.ReactElement {'
  );
  
  content = content.replace(
    /function (\w+)\(\s*\)\s*{/g,
    'function $1(): React.ReactElement {'
  );
  
  content = content.replace(
    /const (\w+) = \(\s*\) => {/g,
    'const $1 = (): React.ReactElement => {'
  );
  
  return content;
}

// Fonction pour ajouter les imports React si nécessaire
function ensureReactImport(content) {
  if (content.includes('React.ReactElement') && !content.includes('import React')) {
    content = "import React from 'react';\\n + content;
  }
  return content;
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Appliquer les corrections
    content = fixReactComponentReturnTypes(content);
    content = ensureReactImport(content);
    
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
console.log('🔧 Correction automatique des erreurs de linter...');
processDirectory('./mobile');
processDirectory('./admi\n);
processDirectory('./middleware');
console.log('✨ Correction terminée !'); 