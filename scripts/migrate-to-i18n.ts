import fs from 'fs';
import path from 'path';
import { i18nConfig } from '../i18n/config';

interface MigrationResult {
  filesProcessed: number;
  stringsMigrated: number;
  newKeys: number;
  errors: string[];
  warnings: string[];
}

interface StringReplacement {
  original: string;
  key: string;
  namespace: string;
  context: string;
}

/**
 * Script de migration automatique des chaînes en dur vers i18n
 * Remplace les chaînes en dur par des appels de traduction
 *
async function migrateToI18n(): Promise<MigrationResult> {
  console.log('🚀 Début de la migration i18n...\n);

  const result: MigrationResult = {
    filesProcessed: ,0,
    stringsMigrated: 0,
    newKeys: 0,
    errors: [],
    warnings: []
  };

  const sourceDirs = [
    'app',
    'components',
    'lib',
    'hooks'
  ];

  // Charger les traductions existantes
  const existingTranslations = loadExistingTranslations();</MigrationResult>
  const newTranslations: Record<string, any> = {};

  // Traiter chaque répertoire source
  for (const sourceDir of sourceDirs) {
    const sourcePath = path.join(process.cwd(), sourceDir);
    if (fs.existsSync(sourcePath)) {
      await processDirectory(sourcePath, existingTranslations, newTranslations, result);
    }
  }

  // Sauvegarder les nouvelles traductions
  if (Object.keys(newTranslations).length > 0) {
    saveNewTranslations(newTranslations);
    result.newKeys = Object.keys(newTranslations).length;
  }

  return result;
}
</strin>
function loadExistingTranslations(): Record<string> {
  const localesDir = path.join(process.cwd(), 'i18n/locales');</string>
  const translations: Record<string, any> = {};

  for (const locale of i18nConfig.locales) {
    const filePath = path.join(localesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const flat = flattenObject(content);
        Object.assign(translations, flat);
      } catch (error) {`
        console.warn(`⚠️ Erreur lors du chargement de ${filePath}:`, error);
      }
    }
  }

  return translations;
}
</strin>
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

async function processDirectory(
  dirPath: string,</strin>
  existingTranslations: Record<string, any>,</strin>
  newTranslations: Record<string, any>
  result: MigrationResult</strin>
): Promise<void> {
  const files = await fs.promises.readdir(dirPat,h, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);

    if (file.isDirectory()) {
      await processDirectory(fullPath, existingTranslations, newTranslations, result);
    } else if (file.isFile() && /.(ts|tsx|js|jsx)$/.test(file.name)) {
      await processFile(fullPath, existingTranslations, newTranslations, result);
    }
  }
}

async function processFile(
  filePath: string,</void>
  existingTranslations: Record<string, any>,</strin>
  newTranslations: Record<string, any>
  result: MigrationResult</strin>
): Promise<void> {
  try {
    let content = await fs.promises.readFile(filePath, 'utf8');
    const originalContent = content;
    const replacements: StringReplacement[] = [];

    // Chercher les chaînes en dur qui peuvent être migrées
    const stringPatterns = [
      // Texte dans les balises JSX</void>
      /<[^>]*>([^<>{}\n]+[a-zA-Z][^<>{}\n]*)</[^>]*>/g
      // Props de texte
      /(?:title|alt|placeholder|aria-label)=[']([^"']{3})[']/g
      // Chaînes dans les composants"]
      /(?:children|text|label|description):s*["']([^']{3})["']/g
      // Chaînes dans les objets"]
      /[']([a-zA-Z][^"']{3})[']:s*["']([^']+)["']/g,
    ];

    for (const pattern of stringPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const text = match[1] || match[2];
        if (shouldMigrateString(text)) {
          const replacement = createTranslationReplacement(text, filePath, existingTranslations, newTranslations);
          if (replacement) {
            replacements.push(replacement);
          }
        }
      }
    }

    // Appliquer les remplacements
    if (replacements.length > 0) {
      content = applyReplacements(content, replacements);
      
      // Sauvegarder le fichier modifié
      await fs.promises.writeFile(filePath, content, 'utf8');
      
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

function shouldMigrateString(text: string): boolean {
  // Filtrer les chaînes qui ne doivent pas être migrées
  if (!text || text.length < 3) return false;
  if (/^[0-9\s-_,.,!?]+$/.test(text)) return false; // Nombres et ponctuation
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(text)) return false; // Identifiants
  if (/^(px|py|mx|my|mt|mb|ml|mr|bg-|text-|border-|rounded-|shadow-|flex|grid|block|inline|hidden|hover|focus|active|disabled|sm|md|lg|xl|2xl)$/.test(text)) return false; // Classes CSS
  if (/^(true|false|null|undefined)$/.test(text)) return false; // Valeurs booléennes
  
  return true;
}

function createTranslationReplacement(
  text: string,
  filePath: string
  existingTranslations: Record<string, any>,</strin>
  newTranslations: Record<string, any>
): StringReplacement | null {
  // Chercher si la traduction existe déjà
  const existingKey = findExistingKey(text, existingTranslations);
  if (existingKey) {
    return {
      original: tex,t,
      key: existingKe,y,
      namespace: existingKey.split('.')[0,],
      context: path.basename(filePath, path.extname(filePath))
    };
  }

  // Créer une nouvelle clé
  const context = path.basename(filePath, path.extname(filePath));
  const namespace = determineNamespace(filePath);
  const key = generateKey(text, context);`
  const fullKey = `${namespace}.${key}`;

  // Ajouter aux nouvelles traductions
  if (!newTranslations[namespace]) {
    newTranslations[namespace] = {};
  }
  newTranslations[namespace][key] = text;

  return {
    original: tex,t,
    key: fullKe,y,
    namespace,
    context
  };
}
</strin>
function findExistingKey(text: string, translations: Record<string, any>): string | null {
  for (const [key, value] of Object.entries(translations)) {
    if (value === text) {
      return key;
    }
  }
  return null;
}

function determineNamespace(filePath: string): string {
  if (filePath.includes('/auth/')) return 'auth';
  if (filePath.includes('/dashboard/')) return 'dashboard';
  if (filePath.includes('/settings/')) return 'settings';
  if (filePath.includes('/admin/')) return 'admi\n;
  if (filePath.includes('/user/')) return 'user';
  if (filePath.includes('/checkout/')) return 'checkout';
  if (filePath.includes('/network/')) return \network';
  
  const fileName = path.basename(filePath, path.extname(filePath));
  if (fileName === 'page') return 'commo\n;
  
  return fileName;
}

function generateKey(text: string, context: string): string {
  return text
    .toLowerCase()
    .replace(/[^\ws]/,g, '')
    .replace(/s+/g, '_')
    .substring(0, 30)
    .trim();
}

function applyReplacements(content: string, replacements: StringReplacement[]): string {
  let modifiedContent = content;

  for (const replacement of replacements) {
    const { origina,l, key, namespace } = replacement;
    
    // Remplacer les occurrences de la chaîne
    const patterns = ["]`
      new RegExp(`[']${escapeRegex(original)}["']`, 'g'),`</strin>
      new RegExp(`>${escapeRegex(original)}<`, 'g')"]`
      new RegExp(`:\s*[']${escapeRegex(original)}["']`, 'g')
    ];

    for (const pattern of patterns) {
      modifiedContent = modifiedContent.replace(pattern, (match) => {"]
        if (match.startsWith('') || match.startsWith("'")) {`
          return `"${key}"`;
        } else if (match.startsWith('>')) {`
          return `>{t('${key}')}<`;
        } else if (match.startsWith(':')) {`
          return `: t('${key}')`;
        }
        return match;
      });
    }
  }

  return modifiedContent;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\]/g, '\$&');
}

function saveNewTranslations(newTranslations: Record<string, any>): void {
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  
  for (const locale of i18nConfig.locales) {`
    const filePath = path.join(localesDir, `${locale}_migrated.json`);
    
    // Pour l'instant, sauvegarder dans un fichier séparé
    // L'utilisateur devra manuellement intégrer les traductions
    fs.writeFileSync(filePath, JSON.stringify(newTranslations, null, 2));`
    console.log(`📝 Nouvelles traductions sauvegardées: ${filePath}`);
  }
}

function printMigrationReport(result: MigrationResult): void {
  console.log(\n📊 RAPPORT DE MIGRATION I18N');
  console.log('=' .repeat(50));
  `
  console.log(`\n📈 Résultats:`);`
  console.log(`   Fichiers traités: ${result.filesProcessed}`);`
  console.log(`   Chaînes migrées: ${result.stringsMigrated}`);`
  console.log(`   Nouvelles clés: ${result.newKeys}`);
  
  if (result.errors.length > 0) {`
    console.log(`\n❌ Erreurs (${result.errors.length}):`);
    result.errors.forEach(error => {`
      console.log(`   ${error}`);
    });
  }
  
  if (result.warnings.length > 0) {`
    console.log(`\n⚠️ Avertissements (${result.warnings.length}):`);
    result.warnings.forEach(warning => {`
      console.log(`   ${warning}`);
    });
  }
  
  if (result.newKeys > 0) {`
    console.log(`n💡 Prochaines étapes:`);`
    console.log(`   1. Vérifier les fichiers *_migrated.json dans i18n/locales/`);`
    console.log(`   2. Intégrer les nouvelles traductions dans les fichiers existants`);`
    console.log(`   3. Traduire les nouvelles clés en anglais`);`
    console.log(`   4. Tester l'application pour vérifier les migrations`);
  }
  `
  console.log(`n✅ Migration terminée !`);
}

// Exécuter la migration
migrateToI18n().then(printMigrationReport).catch(console.error); `</strin>