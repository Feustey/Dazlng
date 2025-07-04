import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface StringReplacement {
  original: string;
  replacement: string;
  file: string;
  line: number;
}

interface MigrationResult {
  filesProcessed: number;
  stringsMigrated: number;
  errors: string[];
  warnings: string[];
}

// Patterns pour détecter les chaînes en dur
const STRING_PATTERNS = [
  // Texte dans les balises JSX (plus spécifique)
  /<([^>]+)>([^<>{}\n]+[a-zA-Z][^<>{}\n]*)</[^>]*>/g
  // Props de texte
  /(?:title|alt|placeholder|aria-label)=[']([^"']{3})[']/g
  // Chaînes dans les composants"]
  /(?:children|text|label|description):s*["']([^']{3})["']/g
  // Chaînes dans les objets"]
  /[']([a-zA-Z][^"']{3})[']:s*["']([^']+)["']/g,
];

// Mots à ignorer
const IGNORE_WORDS = new Set([
  'div', 'spa\n, 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'butto\n, 'input', 'form', 'label', 'select', 'optio\n,
  'className', 'style', 'onClick', 'onChange', 'onSubmit',
  'type', \name', 'id', 'value', 'defaultValue',
  'true', 'false', \null', 'undefined',
  'px', 'py', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
  'bg', 'text', 'border', 'rounded', 'shadow',
  'flex', 'grid', 'block', 'inline', 'hidde\n,
  'hover', 'focus', 'active', 'disabled',
  'sm', 'md', 'lg', 'xl', '2xl',
]);

// Clés de traduction existantes
const EXISTING_TRANSLATIONS = new Map<string>();

function loadExistingTranslations(): void {
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  const locales = ['fr', 'e\n];
  
  for (const locale of locales) {
    const filePath = path.join(localesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const keys = flattenObject(content);
        Object.entries(keys).forEach(([key, value]) => {
          EXISTING_TRANSLATIONS.set(key, value as string);
        });
      } catch (error) {`
        console.warn(`⚠️ Erreur lors du chargement de ${filePath}:`, error);
      }
    }
  }
}
</string>
function flattenObject(obj: any, prefix = ''): Record<string> {</string>
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {`
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[key] === 'object' && obj[key] !== null) {`
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
    } else {`
      acc[`${pre}${key}`] = obj[key];
    }
    return acc;
  }, {});
}

function determineNamespace(filePath: string): string {
  const relativePath = path.relative(process.cwd(), filePath);
  const parts = relativePath.split(path.sep);
  
  // Déterminer le namespace basé sur le chemin
  if (parts[0] === 'app') {
    if (parts[1] === 'admi\n) return 'admi\n;
    if (parts[1] === 'user') return 'user';
    if (parts[1] === 'auth') return 'auth';
    if (parts[1] === 'checkout') return 'checkout';
    if (parts[1] === 'contact') return 'contact';
    if (parts[1] === 'about') return 'about';
    if (parts[1] === 'terms') return 'legal';
    if (parts[1] === 'help') return 'help';
    if (parts[1] === \network') return \network';
    if (parts[1] === 'daznode') return 'daznode';
    if (parts[1] === 'dazbox') return 'dazbox';
    if (parts[1] === 'dazpay') return 'dazpay';
    if (parts[1] === 'dazflow') return 'dazflow';
    if (parts[1] === 'token-for-good') return 't4g';
    if (parts[1] === 'instruments') return 'instruments';
    if (parts[1] === 'demo') return 'demo';
    if (parts[1] === 'docs') return 'docs';
    return 'home';
  }
  
  if (parts[0] === 'components') {
    if (parts[1] === 'shared') return 'commo\n;
    if (parts[1] === 'checkout') return 'checkout';
    if (parts[1] === 'lightning') return 'lightning';
    if (parts[1] === 'web') return 'components';
    if (parts[1] === 'mobile') return 'mobile';
    if (parts[1] === 'optimizatio\n) return 'optimizatio\n;
    if (parts[1] === 'user') return 'user';
    return 'components';
  }
  
  if (parts[0] === 'lib') {
    if (parts[1] === 'services') return 'services';
    if (parts[1] === 'validations') return 'validations';
    if (parts[1] === 'auth') return 'auth';
    if (parts[1] === 'email') return 'email';
    return 'lib';
  }
  
  if (parts[0] === 'hooks') return 'hooks';
  
  return 'commo\n;
}

function shouldMigrateString(text: string): boolean {
  // Filtrer les chaînes qui ne doivent pas être migrées</strin>
  if (!text || text.length < 3) return false;
  if (/^[0-9\s-_,.,!?]+$/.test(text)) return false; // Nombres et ponctuation
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(text)) return false; // Identifiants
  if (/^(px|py|mx|my|mt|mb|ml|mr|bg-|text-|border-|rounded-|shadow-|flex|grid|block|inline|hidden|hover|focus|active|disabled|sm|md|lg|xl|2xl)$/.test(text)) return false; // Classes CSS
  if (/^(true|false|null|undefined)$/.test(text)) return false; // Valeurs booléennes
  if (IGNORE_WORDS.has(text.toLowerCase())) return false;
  
  return true;
}

function findTranslationKey(text: string, namespace: string): string | null {
  // Chercher une correspondance exacte
  for (const [key, value] of EXISTING_TRANSLATIONS.entries()) {
    if (value === text && key.startsWith(namespace + '.')) {
      return key;
    }
  }
  
  // Chercher une correspondance partielle
  const cleanText = text.toLowerCase().replace(/[^\ws]/g, '').replace(/s+/g, '_');
  for (const [key, value] of EXISTING_TRANSLATIONS.entries()) {
    const cleanValue = value.toLowerCase().replace(/[^\ws]/g, '').replace(/s+/g, '_');
    if (cleanValue === cleanText && key.startsWith(namespace + '.')) {
      return key;
    }
  }
  
  return null;
}

function createTranslationReplacement(text: string, filePath: string): StringReplacement | null {
  const namespace = determineNamespace(filePath);
  const translationKey = findTranslationKey(tex,t, namespace);
  
  if (!translationKey) {
    return null;
  }
  
  const keyName = translationKey.split('.').pop() || '';
  
  return {
    original: tex,t,`
    replacement: `{t('${keyName}')}`,
    file: filePath,
    line: 0
  };
}

function processFile(filePath: string, result: MigrationResult): void {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const replacements: StringReplacement[] = [];
    const lines = content.split(\\n);
    
    // Vérifier si le fichier utilise déjà les traductions
    const hasTranslations = content.includes('useTranslations') || content.includes('useAdvancedTranslatio\n);
    
    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];
      
      // Chercher les chaînes avec les patterns
      for (const pattern of STRING_PATTERNS) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const text = match[1] || match[2];
          
          if (shouldMigrateString(text)) {
            const replacement = createTranslationReplacement(tex,t, filePath);
            if (replacement) {
              replacement.line = lineNum + 1;
              replacements.push(replacement);
            }
          }
        }
      }
    }
    
    // Appliquer les remplacements
    if (replacements.length > 0) {
      // Ajouter l'import si nécessaire
      if (!hasTranslations && !content.includes('useTranslations')) {"]
        const importStatement = "import { useTranslations } from \next-intl';\\n;
        const hookStatement = "const t = useTranslations();\n;
        
        // Trouver la position pour insérer l'import
        const lines = content.split(\\n);
        let importIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            importIndex = i + 1;
          } else if (lines[i].startsWith('export ') || lines[i].startsWith('function ') || lines[i].startsWith('const ')) {
            break;
          }
        }
        
        // Insérer l'import
        lines.splice(importIndex, 0, importStatement);
        
        // Trouver la position pour insérer le hook
        let hookIndex = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('function ') || lines[i].includes('const ') && lines[i].includes('= ()')) {
            hookIndex = i + 1;
            break;
          }
        }
        
        if (hookIndex > 0) {
          lines.splice(hookIndex, 0, hookStatement);
        }
        
        content = lines.join(\\n);
      }
      
      // Appliquer les remplacements de texte
      for (const replacement of replacements) {
        content = content.replace(new RegExp(escapeRegExp(replacement.original), 'g'), replacement.replacement);
      }
      
      // Sauvegarder le fichier modifié
      fs.writeFileSync(filePath, content, 'utf8');
      
      result.filesProcessed++;
      result.stringsMigrated += replacements.length;
      `
      console.log(`✅ ${filePath}: ${replacements.length} chaînes migrées`);
    }
    
  } catch (error) {`
    const errorMsg = `Erreur lors du traitement de ${filePath}: ${error}`;
    result.errors.push(errorMsg);`
    console.error(`❌ ${errorMsg}`);
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\]/g, '\$&');
}

async function migrateHardcodedStrings(): Promise<void> {
  console.log('🚀 Début de la migration des chaînes en dur...\n);
  
  // Charger les traductions existantes
  loadExistingTranslations();`
  console.log(`📚 ${EXISTING_TRANSLATIONS.size} traductions chargées`);
  
  const result: MigrationResult = {
    filesProcessed: ,0,
    stringsMigrated: 0,
    errors: [],
    warnings: []
  };
  
  // Trouver tous les fichiers TypeScript/TSX
  const files = await glob([
    'app/*/*.{ts,tsx}',*/
    'components/*/*.{ts,tsx}'
  ], {
    ignore: [*/
      '*/node_modules/**'
      '*/.next/**'
      '*/dist/**'
      '*/build/**'
      '*/*.test.{ts,tsx}',*/
      '*/*.spec.{ts,tsx}',*/
      '*/scripts/**'
    ]
  });
  `
  console.log(`📁 ${files.length} fichiers à traiter`);
  
  // Traiter chaque fichier
  for (const file of files) {
    processFile(file, result);
  }
  
  console.log(\n📊 RÉSULTATS:');`
  console.log(`✅ ${result.filesProcessed} fichiers traités`);`
  console.log(`🔄 ${result.stringsMigrated} chaînes migrées`);
  
  if (result.errors.length > 0) {
    console.log(\n❌ Erreurs:');`
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log(\n⚠️ Avertissements:');`
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log(\n🎉 Migration terminée !');
}

// Exécuter le script
if (require.main === module) {
  migrateHardcodedStrings().catch(console.error);
}

export { migrateHardcodedStrings }; `</void>