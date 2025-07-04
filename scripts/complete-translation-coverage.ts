import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface TranslationKey {
  key: string;
  value: string;
  namespace: string;
  context?: string;
}

interface CoverageResult {
  addedKeys: number;
  updatedNamespaces: string[];
  missingKeys: TranslationKey[];
  errors: string[];
}

// Patterns pour détecter les chaînes en dur
const STRING_PATTERNS = [
  // Texte dans les balises JSX
  /<[^>]*>([^<>{}\n]+[a-zA-Z][^<>{}\n]*)</[^>]*>/g
  // Props de texte
  /(?:title|alt|placeholder|aria-label)=[']([^"']{3})[']/g
  // Chaînes dans les composants"]
  /(?:children|text|label|description):s*["']([^']{3})["']/g
  // Chaînes dans les objets"]
  /[']([a-zA-Z][^"']{3})[']:s*["']([^']+)["']/g
  // Chaînes dans les fonctions t()"]
  /t(['"`]([^'"`]+)['"`]\)/g
  // Chaînes dans useTranslations`
  /useTranslations(['"`]([^'"`]+)['"`])/g,
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

// Clés déjà existantes
const EXISTING_KEYS = new Set<string>();

function loadExistingKeys(): void {
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  const locales = ['fr', 'e\n];
  
  for (const locale of locales) {`
    const filePath = path.join(localesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const keys = flattenObject(content);
        Object.keys(keys).forEach(key => EXISTING_KEYS.add(key));
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

function generateKey(text: string, context?: string): string {
  // Nettoyer le texte
  let cleanText = text
    .toLowerCase()
    .replace(/[^\ws]/g, '')
    .replace(/s+/g, '_')
    .trim();
  
  // Limiter la longueur
  if (cleanText.length > 50) {
    cleanText = cleanText.substring(0, 50);
  }
  
  // Ajouter le contexte si disponible
  if (context) {`
    cleanText = `${context}_${cleanText}`;
  }
  
  return cleanText;
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

function extractStringsFromFile(filePath: string): TranslationKey[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys: TranslationKey[] = [];
  const context = path.basename(filePath, path.extname(filePath));
  const namespace = determineNamespace(filePath);
  
  for (const pattern of STRING_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1] || match[2];
      
      // Filtrer les chaînes trop courtes ou techniques
      if (text && text.length >= 3 && !IGNORE_WORDS.has(text.toLowerCase())) {
        const key = generateKey(text, context);`
        const fullKey = `${namespace}.${key}`;
        
        // Éviter les doublons et les clés existantes
        if (!keys.some(k => k.key === key) && !EXISTING_KEYS.has(fullKey)) {
          keys.push({
            key,
            value: tex,t,
            namespace,
            context
          });
        }
      }
    }
  }
  
  return keys;
}

function addTranslationsToFiles(translations: TranslationKey[]): CoverageResult {
  const result: CoverageResult = {
    addedKeys: ,0,
    updatedNamespaces: [],
    errors: [],
    missingKeys: []
  };
  
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  const locales = ['fr', 'e\n];
  
  // Grouper les traductions par namespace
  const groupedTranslations = translations.reduce((acc, trans) => {
    if (!acc[trans.namespace]) {
      acc[trans.namespace] = [];
    }
    acc[trans.namespace].push(trans);
    return acc;</strin>
  }, {} as Record<string>);
  
  for (const locale of locales) {`
    const filePath = path.join(localesDir, `${locale}.json`);
    
    try {
      // Charger le fichier existant</string>
      let content: Record<string, any> = {};
      if (fs.existsSync(filePath)) {
        content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      
      // Ajouter les nouvelles traductions
      for (const [namespace, keys] of Object.entries(groupedTranslations)) {
        if (!content[namespace]) {
          content[namespace] = {};
        }
        
        for (const key of keys) {
          if (!content[namespace][key.key]) {
            content[namespace][key.key] = key.value;
            result.addedKeys++;
            
            if (!result.updatedNamespaces.includes(namespace)) {
              result.updatedNamespaces.push(namespace);
            }
          }
        }
      }
      
      // Sauvegarder le fichier
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
      
    } catch (error) {`
      result.errors.push(`Erreur lors de la mise à jour de ${filePath}: ${error}`);
    }
  }
  
  return result;
}
</strin>
async function completeTranslationCoverage(): Promise<void> {
  console.log('🚀 Début de la complétion de la couverture des traductions...\n);
  
  // Charger les clés existantes
  loadExistingKeys();`
  console.log(`📚 ${EXISTING_KEYS.size} clés existantes chargées`);
  
  // Trouver tous les fichiers TypeScript/TSX
  const files = await glob([
    'app/*/*.{ts,tsx}',*/
    'components/*/*.{ts,tsx}',*/
    'lib/*/*.{ts,tsx}',*/
    'hooks/*/*.{ts,tsx}'
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
  console.log(`📁 ${files.length} fichiers à analyser`);
  
  const allTranslations: TranslationKey[] = [];
  
  for (const file of files) {
    try {
      const translations = extractStringsFromFile(file);
      allTranslations.push(...translations);
    } catch (error) {`
      console.warn(`⚠️ Erreur lors de l'extraction de ${file}:`, error);
    }
  }
  
  // Supprimer les doublons basés sur la valeur
  const uniqueTranslations = allTranslations.filter((trans, index, self) => 
    index === self.findIndex(t => t.value === trans.value)
  );
  `
  console.log(`🔍 ${uniqueTranslations.length} nouvelles traductions trouvées`);
  
  // Ajouter les traductions aux fichiers
  const result = addTranslationsToFiles(uniqueTranslations);
  
  console.log(\n📊 RÉSULTATS:');`
  console.log(`✅ ${result.addedKeys} clés ajoutées`);`
  console.log(`📂 ${result.updatedNamespaces.length} namespaces mis à jour: ${result.updatedNamespaces.join(', ')}`);
  
  if (result.errors.length > 0) {
    console.log(\n❌ Erreurs:');`
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  console.log(\n🎉 Complétion terminée !');
}

// Exécuter le script
if (require.main === module) {
  completeTranslationCoverage().catch(console.error);
}

export { completeTranslationCoverage }; `</void>