#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase', 'migrations');

function fixFinalIssues(filePath: string): { fixed: boolean; changes: number } {
  const content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  let newContent = content;
  
  // 1. Corriger les points-virgule manquants dans les fonctions et triggers
  const functionPatterns = [
    /(CREATE OR REPLACE FUNCTION [^;]+)(?=\n)/g,
    /(CREATE FUNCTION [^;]+)(?=\n)/g,
    /(CREATE TRIGGER [^;]+)(?=\n)/g,
    /(CREATE OR REPLACE VIEW [^;]+)(?=\n)/g,
    /(CREATE MATERIALIZED VIEW [^;]+)(?=\n)/g,
    /(ALTER TABLE [^;]+)(?=\n)/g,
    /(COMMENT ON [^;]+)(?=\n)/g
  ];
  
  functionPatterns.forEach(pattern => {
    const matches = newContent.match(pattern);
    if (matches) {
      newContent = newContent.replace(pattern, '$1;');
      changes += matches.length;
    }
  });
  
  // 2. Corriger les guillemets non fermés dans les commentaires
  const lines = newContent.split('\n');
  const fixedLines = lines.map(line => {
    if (line.includes('--') && line.includes("'") && !line.includes("''")) {
      const commentIndex = line.indexOf('--');
      const beforeComment = line.substring(0, commentIndex);
      const comment = line.substring(commentIndex);
      
      // Compter les guillemets simples dans le commentaire
      const commentQuotes = comment.match(/'/g);
      if (commentQuotes && commentQuotes.length % 2 !== 0) {
        // Ajouter un guillemet fermant
        return beforeComment + comment + "'";
      }
    }
    return line;
  });
  
  const finalContent = fixedLines.join('\n');
  
  if (finalContent !== content) {
    fs.writeFileSync(filePath, finalContent, 'utf8');
    return { fixed: true, changes };
  }
  
  return { fixed: false, changes: 0 };
}

async function fixAllFinalIssues(): Promise<void> {
  console.log('🔧 Correction finale des problèmes SQL...\n');
  
  const sqlFiles = await glob('*.sql', { cwd: MIGRATIONS_DIR });
  let totalFixed = 0;
  let totalChanges = 0;
  
  for (const file of sqlFiles) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const result = fixFinalIssues(filePath);
    
    if (result.fixed) {
      totalFixed++;
      totalChanges += result.changes;
      console.log(`✅ ${file} - ${result.changes} corrections finales appliquées`);
    }
  }
  
  console.log(`\n📊 Résultats finaux:`);
  console.log(`   Fichiers corrigés: ${totalFixed}/${sqlFiles.length}`);
  console.log(`   Total de corrections: ${totalChanges}`);
  
  if (totalFixed > 0) {
    console.log('\n🎉 Corrections finales appliquées avec succès !');
    console.log('💡 Relancez la validation pour vérifier les corrections.');
  } else {
    console.log('\nℹ️  Aucune correction finale nécessaire.');
  }
}

// Exécuter les corrections finales
fixAllFinalIssues().catch(console.error); 