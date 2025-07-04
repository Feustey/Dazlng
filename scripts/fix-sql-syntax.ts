#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase', 'migrations');

// Patterns de correction
const FIXES = [
  // Standardiser la casse SQL
  { pattern: /\bcreate\s+table\b/gi, replacement: 'CREATE TABLE' },
  { pattern: /\bcreate\s+index\b/gi, replacement: 'CREATE INDEX' },
  { pattern: /\bcreate\s+policy\b/gi, replacement: 'CREATE POLICY' },
  { pattern: /\bcreate\s+trigger\b/gi, replacement: 'CREATE TRIGGER' },
  { pattern: /\bcreate\s+or\s+replace\s+function\b/gi, replacement: 'CREATE OR REPLACE FUNCTION' },
  { pattern: /\balter\s+table\b/gi, replacement: 'ALTER TABLE' },
  { pattern: /\bdrop\s+index\b/gi, replacement: 'DROP INDEX' },
  { pattern: /\bdrop\s+policy\b/gi, replacement: 'DROP POLICY' },
  { pattern: /\bdrop\s+trigger\b/gi, replacement: 'DROP TRIGGER' },
  { pattern: /\binsert\s+into\b/gi, replacement: 'INSERT INTO' },
  { pattern: /\bupdate\s+set\b/gi, replacement: 'UPDATE SET' },
  { pattern: /\bdelete\s+from\b/gi, replacement: 'DELETE FROM' },
  { pattern: /\bselect\s+from\b/gi, replacement: 'SELECT FROM' },
  
  // Standardiser les types de données
  { pattern: /\buuid\b/gi, replacement: 'UUID' },
  { pattern: /\btext\b/gi, replacement: 'TEXT' },
  { pattern: /\bvarchar\b/gi, replacement: 'VARCHAR' },
  { pattern: /\binteger\b/gi, replacement: 'INTEGER' },
  { pattern: /\bbigint\b/gi, replacement: 'BIGINT' },
  { pattern: /\bboolean\b/gi, replacement: 'BOOLEAN' },
  { pattern: /\bjsonb\b/gi, replacement: 'JSONB' },
  { pattern: /\btimestamp\s+with\s+time\s+zone\b/gi, replacement: 'TIMESTAMP WITH TIME ZONE' },
  
  // Standardiser les contraintes
  { pattern: /\bprimary\s+key\b/gi, replacement: 'PRIMARY KEY' },
  { pattern: /\bforeign\s+key\b/gi, replacement: 'FOREIGN KEY' },
  { pattern: /\bnot\s+null\b/gi, replacement: 'NOT NULL' },
  { pattern: /\bunique\b/gi, replacement: 'UNIQUE' },
  { pattern: /\bdefault\b/gi, replacement: 'DEFAULT' },
  { pattern: /\bcheck\b/gi, replacement: 'CHECK' },
  { pattern: /\bon\s+delete\s+cascade\b/gi, replacement: 'ON DELETE CASCADE' },
  { pattern: /\bon\s+delete\s+set\s+null\b/gi, replacement: 'ON DELETE SET NULL' },
  
  // Standardiser les clauses
  { pattern: /\bif\s+not\s+exists\b/gi, replacement: 'IF NOT EXISTS' },
  { pattern: /\bfor\s+each\s+row\b/gi, replacement: 'FOR EACH ROW' },
  { pattern: /\bbefore\s+update\b/gi, replacement: 'BEFORE UPDATE' },
  { pattern: /\bafter\s+insert\b/gi, replacement: 'AFTER INSERT' },
  { pattern: /\bexecute\s+function\b/gi, replacement: 'EXECUTE FUNCTION' },
  { pattern: /\blanguage\s+plpgsql\b/gi, replacement: 'LANGUAGE plpgsql' },
  { pattern: /\breturns\s+trigger\b/gi, replacement: 'RETURNS TRIGGER' },
  { pattern: /\breturns\s+void\b/gi, replacement: 'RETURNS void' },
  
  // Standardiser les politiques RLS
  { pattern: /\bfor\s+all\b/gi, replacement: 'FOR ALL' },
  { pattern: /\bfor\s+select\b/gi, replacement: 'FOR SELECT' },
  { pattern: /\bfor\s+insert\b/gi, replacement: 'FOR INSERT' },
  { pattern: /\bfor\s+update\b/gi, replacement: 'FOR UPDATE' },
  { pattern: /\bfor\s+delete\b/gi, replacement: 'FOR DELETE' },
  { pattern: /\busing\b/gi, replacement: 'USING' },
  { pattern: /\bwith\s+check\b/gi, replacement: 'WITH CHECK' },
  
  // Standardiser les fonctions
  { pattern: /\bnew\b/gi, replacement: 'NEW' },
  { pattern: /\bold\b/gi, replacement: 'OLD' },
  { pattern: /\breturn\b/gi, replacement: 'RETURN' },
  { pattern: /\bbegin\b/gi, replacement: 'BEGIN' },
  { pattern: /\bend\b/gi, replacement: 'END' },
  { pattern: /\bif\b/gi, replacement: 'IF' },
  { pattern: /\bthen\b/gi, replacement: 'THEN' },
  { pattern: /\belse\b/gi, replacement: 'ELSE' },
  { pattern: /\bend\s+if\b/gi, replacement: 'END IF' },
];

function fixSqlFile(filePath: string): { fixed: boolean; changes: number } {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  // Appliquer les corrections
  FIXES.forEach(fix => {
    const matches = content.match(fix.pattern);
    if (matches) {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        changes += matches.length;
      }
    }
  });
  
  // Corriger les guillemets non fermés dans les commentaires
  const lines = content.split('\n');
  const fixedLines = lines.map(line => {
    if (line.includes('--') && line.includes("'") && !line.includes("''")) {
      // Compter les guillemets simples
      const quoteCount = (line.match(/'/g) || []).length;
      if (quoteCount % 2 !== 0) {
        // Ajouter un guillemet fermant à la fin du commentaire
        const commentIndex = line.indexOf('--');
        const beforeComment = line.substring(0, commentIndex);
        const comment = line.substring(commentIndex);
        return beforeComment + comment.replace(/'$/, "''");
      }
    }
    return line;
  });
  
  const fixedContent = fixedLines.join('\n');
  
  if (fixedContent !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    return { fixed: true, changes };
  }
  
  return { fixed: false, changes: 0 };
}

async function fixAllSqlFiles(): Promise<void> {
  console.log('🔧 Correction automatique des fichiers SQL...\n');
  
  const sqlFiles = await glob('*.sql', { cwd: MIGRATIONS_DIR });
  let totalFixed = 0;
  let totalChanges = 0;
  
  for (const file of sqlFiles) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const result = fixSqlFile(filePath);
    
    if (result.fixed) {
      totalFixed++;
      totalChanges += result.changes;
      console.log(`✅ ${file} - ${result.changes} corrections appliquées`);
    }
  }
  
  console.log(`\n📊 Résultats:`);
  console.log(`   Fichiers corrigés: ${totalFixed}/${sqlFiles.length}`);
  console.log(`   Total de corrections: ${totalChanges}`);
  
  if (totalFixed > 0) {
    console.log('\n🎉 Corrections appliquées avec succès !');
    console.log('💡 Relancez la validation pour vérifier les corrections.');
  } else {
    console.log('\nℹ️  Aucune correction nécessaire.');
  }
}

// Exécuter les corrections
fixAllSqlFiles().catch(console.error); 