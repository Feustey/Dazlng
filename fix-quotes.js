#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Extensions de fichiers à traiter
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Patterns à remplacer
const PATTERNS = [
  // Guillemets doubles mal placés dans les imports
  { from: /import\s+.*\s+from\s+""([^"]+)""/g, to: 'import $& from "$1' },
  
  // Guillemets doubles mal placés dans les className
  { from: /className=""([^"]+)""/g, to: 'className="$1' },
  
  // Guillemets doubles mal placés dans les props JSX
  { from: /(\w+)=""([^"]+)""/g, to: '$1="$2' },
  
  // Guillemets doubles mal placés dans les chaînes de caractères
  { from: /""([^"]+)""/g, to: '"$1' },
  
  // Guillemets doubles mal placés dans les tableaux
  { from: /\[""([^"]+)""/g, to: '["$1' },
  { from: /""([^"]+)""\]/g, to: '"$1"]' },
  { from: /,\s*""([^"]+)""/g, to: ', "$1' },
  
  // Guillemets doubles mal placés dans les objets
  { from: /\{\s*""([^"]+)""/g, to: '{ "$1' },
  { from: /""([^"]+)""\s*\}/g, to: '"$1" }' },
  
  // Guillemets doubles mal placés dans les exports
  { from: /export\s+const\s+(\w+)\s*=\s*""([^"]+)""/g, to: 'export const $1 = "$2' },
  
  // Guillemets doubles mal placés dans les console.log
  { from: /console\.log\(""([^"]+)""/g, to: 'console.log("$1' },
  
  // Guillemets doubles mal placés dans les fetch
  { from: /fetch\(""([^"]+)""/g, to: 'fetch("$1' },
  
  // Guillemets doubles mal placés dans les erreurs
  { from: /throw\s+new\s+Error\(""([^"]+)""/g, to: 'throw new Error("$1' },
  
  // Guillemets doubles mal placés dans les t()
  { from: /t\(""([^"]+)""/g, to: 't("$1' },
  
  // Guillemets doubles mal placés dans les useAdvancedTranslation
  { from: /useAdvancedTranslation\(""([^"]+)""/g, to: 'useAdvancedTranslation("$1' },
];

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Appliquer tous les patterns
    PATTERNS.forEach(pattern => {
      const matches = newContent.match(pattern.from);
      if (matches) {
        newContent = newContent.replace(pattern.from, pattern.to);
        hasChanges = true;
        console.log(`  ✅ Remplacé ${matches.length} occurrence(s) dans ${path.basename(filePath)}`);
      }
    });
    
    // Écrire le fichier si des changements ont été faits
    if (hasChanges) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
    return false;
  }
}

// Fonction pour parcourir récursivement les dossiers
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorer les dossiers node_modules, .git, etc.
      if (![\node_modules', '.git', '.next', 'dist', 'build'].includes(file)) {
        walkDir(filePath, callback);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (EXTENSIONS.includes(ext)) {
        callback(filePath);
      }
    }
  });
}

// Fonction principale
function main() {
  console.log('🔧 Début de la correction des guillemets...\\n);
  
  const startDir = process.cwd();
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  walkDir(startDir, (filePath) => {
    totalFiles++;
    console.log(`📁 Traitement de: ${path.relative(startDir, filePath)}`);
    
    if (processFile(filePath)) {
      modifiedFiles++;
    }
  });
  
  console.log(`\n✅ Correction terminée!`);
  console.log(`📊 Fichiers traités: ${totalFiles}`);
  console.log(`📝 Fichiers modifiés: ${modifiedFiles}`);
  
  if (modifiedFiles > 0) {
    console.log(`\n🚀 Vous pouvez maintenant relancer le build avec: npm run build`);
  } else {
    console.log(`\n✨ Aucun fichier à corriger trouvé.`);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { processFile, walkDir, PATTERNS }; 