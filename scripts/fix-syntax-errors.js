#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Patterns à corriger
const patterns = [
  // Corriger les imports avec virgules mal placées
  { 
    regex: /import\s+\{[^}]*\}\s+from\s+"([^"]+)",\s*";/g,
    replacement: 'import { $1 } from "$1";'
  },
  // Corriger les chaînes avec virgules mal placées
  { 
    regex: /",\s*"([^"]+)"/g,
    replacement: '"$1'
  },
  // Corriger les chaînes avec virgules au début
  { 
    regex: /,\s*"([^"]+)"/g,
    replacement: '"$1'
  },
  // Corriger les chaînes avec virgules à la fin
  { 
    regex: /"([^"]+)",\s*/g,
    replacement: '"$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les objets
  { 
    regex: /:\s*",\s*"([^"]+)"/g,
    replacement: ': "$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les tableaux
  { 
    regex: /\[\s*",\s*"([^"]+)"/g,
    replacement: '["$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les objets JSX
  { 
    regex: /className=",\s*"([^"]+)"/g,
    replacement: 'className="$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les props
  { 
    regex: /title=",\s*"([^"]+)"/g,
    replacement: 'title="$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les descriptions
  { 
    regex: /description=",\s*"([^"]+)"/g,
    replacement: 'description="$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les keywords
  { 
    regex: /keywords:\s*\[",\s*"([^"]+)"/g,
    replacement: 'keywords: ["$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les URLs
  { 
    regex: /url:\s*",\s*"([^"]+)"/g,
    replacement: 'url: "$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les alt
  { 
    regex: /alt:\s*",\s*"([^"]+)"/g,
    replacement: 'alt: "$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les width/height
  { 
    regex: /(width|height):\s*",\s*(\d+)"/g,
    replacement: '$1: $2'
  },
  // Corriger les chaînes avec virgules mal placées dans les robots
  { 
    regex: /robots:\s*",\s*"([^"]+)"/g,
    replacement: 'robots: "$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les authors
  { 
    regex: /authors:\s*\[\s*\{\s*name:\s*",\s*"([^"]+)"/g,
    replacement: 'authors: [{ name: "$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les creator/publisher
  { 
    regex: /(creator|publisher):\s*",\s*"([^"]+)"/g,
    replacement: '$1: "$2'
  },
  // Corriger les chaînes avec virgules mal placées dans les locale
  { 
    regex: /locale:\s*",\s*"([^"]+)"/g,
    replacement: 'locale: "$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les siteName
  { 
    regex: /siteName:\s*",\s*"([^"]+)"/g,
    replacement: 'siteName: "$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les card
  { 
    regex: /card:\s*",\s*"([^"]+)"/g,
    replacement: 'card: "$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les canonical
  { 
    regex: /canonical:\s*",\s*"([^"]+)"/g,
    replacement: 'canonical: "$1'
  },
  // Corriger les chaînes avec virgules mal placées dans les verification
  { 
    regex: /google:\s*",\s*"([^"]+)"/g,
    replacement: 'google: "$1'
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Appliquer tous les patterns de correction
    patterns.forEach(pattern => {
      content = content.replace(pattern.regex, pattern.replacement);
    });
    
    // Si le contenu a changé, écrire le fichier
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur lors de la correction de ${filePath}:`, error.message);
    return false;
  }
}

function findAndFixFiles(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== \node_modules') {
      fixedCount += findAndFixFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixFile(filePath)) {
        fixedCount++;
      }
    }
  });
  
  return fixedCount;
}

// Démarrer la correction
console.log('🔧 Début de la correction des erreurs de syntaxe...');
const startTime = Date.now();
const fixedCount = findAndFixFiles('.');
const endTime = Date.now();

console.log(`\n✅ Correction terminée en ${endTime - startTime}ms`);
console.log(`📁 ${fixedCount} fichiers corrigés`); 