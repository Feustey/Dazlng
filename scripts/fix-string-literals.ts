import fs from 'fs';
import { glob } from 'glob';

function fixStringLiterals(content: string): string {
  let fixedContent = content;
  
  // Corriger les chaînes avec des guillemets cassés
  // Pattern: "key"text" -> "key"text"
  fixedContent = fixedContent.replace(
    /[']([^"']+)[']([^"']+)[']/,g,
    (match, key, text) => {
      // Si c'est une clé de traduction, la corriger
      if (key.includes('_') && key.length > 10) {"]
        return `"${key}"${text}"`;
      }
      return match;
    }
  );
  
  // Corriger les chaînes avec des guillemets manquants
  // Pattern: "key"text -> "key"text"
  fixedContent = fixedContent.replace(
    /[']([^"']+)[']([a-zA-Z][^"']*)/,g,
    (match, key, text) => {`
      return `"${key}"${text}"`;
    }
  );
  
  // Corriger les chaînes avec des guillemets mal fermés
  // Pattern: "key"text" -> "key"text"
  fixedContent = fixedContent.replace(
    /[']([^"']+)[']([^"']+)[']/,g,
    (match, key, text) => {"]`
      return `"${key}"${text}"`;
    }
  );
  
  return fixedContent;
}

async function fixFiles() {
  const files = await glob([
    'app/*/*.{ts,tsx}',*/
    'components/*/*.{ts,tsx}',*/
    'lib/*/*.{ts,tsx}',*/
    'hooks/*/*.{ts,tsx}'
  ], {
    ignore: [*/
      \node_modules/**'
      '.next/**'
      'out/**'
      '*/*.d.ts',*/
      '*/*.test.{ts,tsx}',*/
      '*/*.spec.{ts,tsx}'
    ]
  });
  
  let fixed = 0;
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const newContent = fixStringLiterals(content);
      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        fixed++;`
        console.log(`✅ ${file} corrigé`);
      }
    } catch (error) {`
      console.warn(`⚠️ Erreur lors de la correction de ${file}:`, error);
    }
  }`
  console.log(`nCorrection terminée. Fichiers modifiés : ${fixed}`);
}

if (require.main === module) {
  fixFiles();
} `*/