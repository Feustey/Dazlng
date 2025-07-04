#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase', 'migrations');

function fixMissingSemicolons(filePath: string): { fixed: boolean; changes: number } {
  const content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  // Diviser le contenu en lignes
  const lines = content.split('\n');
  const fixedLines: string[] = [];
  
  let inDoBlock = false;
  let inFunctionBlock = false;
  let inCommentBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Ignorer les lignes vides
    if (!trimmedLine) {
      fixedLines.push(line);
      continue;
    }
    
    // Détecter les blocs spéciaux
    if (trimmedLine.startsWith('DO $$')) {
      inDoBlock = true;
      fixedLines.push(line);
      continue;
    }
    
    if (trimmedLine === '$$;') {
      inDoBlock = false;
      fixedLines.push(line);
      continue;
    }
    
    if (trimmedLine.startsWith('CREATE OR REPLACE FUNCTION') || trimmedLine.startsWith('CREATE FUNCTION')) {
      inFunctionBlock = true;
      fixedLines.push(line);
      continue;
    }
    
    if (inFunctionBlock && trimmedLine === '$$ LANGUAGE plpgsql;') {
      inFunctionBlock = false;
      fixedLines.push(line);
      continue;
    }
    
    if (trimmedLine.startsWith('/*')) {
      inCommentBlock = true;
      fixedLines.push(line);
      continue;
    }
    
    if (trimmedLine.includes('*/')) {
      inCommentBlock = false;
      fixedLines.push(line);
      continue;
    }
    
    // Ignorer les commentaires
    if (trimmedLine.startsWith('--') || inCommentBlock) {
      fixedLines.push(line);
      continue;
    }
    
    // Ignorer les lignes dans les blocs spéciaux
    if (inDoBlock || inFunctionBlock) {
      fixedLines.push(line);
      continue;
    }
    
    // Ajouter un point-virgule si nécessaire
    if (trimmedLine && !trimmedLine.endsWith(';') && !trimmedLine.endsWith('$$')) {
      // Instructions SQL qui nécessitent un point-virgule
      const sqlKeywords = [
        'CREATE TABLE',
        'CREATE INDEX',
        'CREATE POLICY',
        'CREATE TRIGGER',
        'CREATE OR REPLACE FUNCTION',
        'CREATE FUNCTION',
        'CREATE VIEW',
        'CREATE MATERIALIZED VIEW',
        'ALTER TABLE',
        'DROP TABLE',
        'DROP INDEX',
        'DROP POLICY',
        'DROP TRIGGER',
        'DROP FUNCTION',
        'INSERT INTO',
        'UPDATE',
        'DELETE FROM',
        'SELECT',
        'GRANT',
        'REVOKE',
        'COMMENT ON',
        'ANALYZE'
      ];
      
      const needsSemicolon = sqlKeywords.some(keyword => 
        trimmedLine.toUpperCase().startsWith(keyword)
      );
      
      if (needsSemicolon) {
        // Ajouter le point-virgule à la fin de la ligne
        const indent = line.match(/^\s*/)?.[0] || '';
        const newLine = indent + trimmedLine + ';';
        fixedLines.push(newLine);
        changes++;
        continue;
      }
    }
    
    fixedLines.push(line);
  }
  
  const fixedContent = fixedLines.join('\n');
  
  if (fixedContent !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    return { fixed: true, changes };
  }
  
  return { fixed: false, changes: 0 };
}

async function fixAllSqlFiles(): Promise<void> {
  console.log('🔧 Correction des points-virgule manquants...\n');
  
  const sqlFiles = await glob('*.sql', { cwd: MIGRATIONS_DIR });
  let totalFixed = 0;
  let totalChanges = 0;
  
  for (const file of sqlFiles) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const result = fixMissingSemicolons(filePath);
    
    if (result.fixed) {
      totalFixed++;
      totalChanges += result.changes;
      console.log(`✅ ${file} - ${result.changes} points-virgule ajoutés`);
    }
  }
  
  console.log(`\n📊 Résultats:`);
  console.log(`   Fichiers corrigés: ${totalFixed}/${sqlFiles.length}`);
  console.log(`   Total de points-virgule ajoutés: ${totalChanges}`);
  
  if (totalFixed > 0) {
    console.log('\n🎉 Points-virgule ajoutés avec succès !');
    console.log('💡 Relancez la validation pour vérifier les corrections.');
  } else {
    console.log('\nℹ️  Aucune correction nécessaire.');
  }
}

// Exécuter les corrections
fixAllSqlFiles().catch(console.error); 