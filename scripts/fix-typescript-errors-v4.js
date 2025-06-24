#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour corriger les erreurs de syntaxe
function fixSyntaxErrors(content) {
  // Corriger les accolades fermantes manquantes
  content = content.replace(
    /\n};?\s*$/,
    '\n};\n'
  );

  // Corriger les useEffect
  content = content.replace(
    /}, \[(.*?)]\);?\s*$/gm,
    '}, [$1]);\n'
  );

  // Corriger les enums
  content = content.replace(
    /enum (\w+) {([^}]+)}/g,
    'export enum $1 {$2}'
  );

  // Corriger les interfaces
  content = content.replace(
    /interface (\w+) {([^}]+)}/g,
    'export interface $1 {$2}'
  );

  // Corriger les types optionnels
  content = content.replace(
    /(\w+)\?: ([^;]+);/g,
    '$1?: $2;'
  );

  // Corriger les composants React
  content = content.replace(
    /: React\.FC = \(\) => \(/g,
    ': React.FC = () => {'
  );

  content = content.replace(
    /\n\s*\)\s*;\s*$/gm,
    '\n};'
  );

  // Ajouter les imports React manquants
  if (content.includes('React.') && !content.includes('import React')) {
    content = "import React from 'react';\n" + content;
  }

  return content;
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Appliquer les corrections
    content = fixSyntaxErrors(content);
    
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
      if (!['node_modules', '.next', '.git', 'build', 'dist'].includes(item)) {
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
console.log('🔧 Correction des erreurs de syntaxe...');
processDirectory('./app');
processDirectory('./components');
processDirectory('./lib');
processDirectory('./utils');
console.log('✨ Correction terminée !'); 