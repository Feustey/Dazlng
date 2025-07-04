#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour corriger les types de composants React
function fixReactComponentTypes(content) {
  // Remplacer les types de retour React.ReactElement par React.FC
  content = content.replace(
    /export default function (\w+)\(\s*{([^}]*)}\s*\):\s*React\.ReactElement/g,
    'const $1: React.FC<{$2}> = ({$2})'
  );
  
  content = content.replace(
    /function (\w+)\(\s*{([^}]*)}\s*\):\s*React\.ReactElement/g,
    'const $1: React.FC<{$2}> = ({$2})'
  );
  
  content = content.replace(
    /const (\w+)\s*=\s*\(\s*{([^}]*)}\s*\):\s*React\.ReactElement/g,
    'const $1: React.FC<{$2}> = ({$2})'
  );

  // Ajouter l'interface Props si nécessaire
  content = content.replace(
    /const (\w+):\s*React\.FC<{([^}]*)}>(\s*)=/g,
    (match, name, props) => {
      const interfaceName = `${name}Props`;
      const propsArray = props.split('').map(prop => prop.trim());
      const interfaceProps = propsArray.map(prop => {
        const [key, type] = prop.split(':').map(p => p.trim());
        return `  ${key}: ${type};`;
      }).join('\\n);
      
      return `interface ${interfaceName} {\n${interfaceProps}\n}\n\nconst ${name}: React.FC<${interfaceName}> =`;
    }
  );

  // Ajouter l'import React si nécessaire
  if (content.includes('React.FC') && !content.includes('import React')) {
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
    content = fixReactComponentTypes(content);
    
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
console.log('🔧 Correction des types React...');
processDirectory('./app');
processDirectory('./components');
console.log('✨ Correction terminée !'); 