import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface TranslationKey {
  key: string;
  defaultValue: string;
  context?: string;
  file: string;
  line: number;
}

interface ExtractionResult {
  keys: TranslationKey[];
  stats: {
    totalFiles: number;
    totalStrings: number;
    uniqueKeys: number;
  };
}

// Patterns pour détecter les chaînes en dur
const STRING_PATTERNS = [
  // Texte dans les balises JSX
  /<[^>]*>([^<>{}\n]+[a-zA-Z][^<>{}\n]*)<\/[^>]*>/g,
  // Props de texte
  /(?:title|alt|placeholder|aria-label)=["']([^"']{3,})["']/g,
  // Chaînes dans les composants
  /(?:children|text|label|description):\s*["']([^"']{3,})["']/g,
  // Chaînes dans les objets
  /["']([a-zA-Z][^"']{3,})["']:\s*["']([^"']+)["']/g,
];

// Mots à ignorer (trop courts ou techniques)
const IGNORE_WORDS = new Set([
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'button', 'input', 'form', 'label', 'select', 'option',
  'className', 'style', 'onClick', 'onChange', 'onSubmit',
  'type', 'name', 'id', 'value', 'defaultValue',
  'true', 'false', 'null', 'undefined',
  'px', 'py', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
  'bg', 'text', 'border', 'rounded', 'shadow',
  'flex', 'grid', 'block', 'inline', 'hidden',
  'hover', 'focus', 'active', 'disabled',
  'sm', 'md', 'lg', 'xl', '2xl',
]);

// Clés déjà utilisées dans les fichiers de traduction
const EXISTING_KEYS = new Set<string>();

function loadExistingKeys(): void {
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  const locales = ['fr', 'en'];
  
  for (const locale of locales) {
    const filePath = path.join(localesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const keys = flattenObject(content);
        Object.keys(keys).forEach(key => EXISTING_KEYS.add(key));
      } catch (error) {
        console.warn(`⚠️ Erreur lors du chargement de ${filePath}:`, error);
      }
    }
  }
}

function flattenObject(obj: any, prefix = ''): Record<string, string> {
  return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
    } else {
      acc[`${pre}${key}`] = obj[key];
    }
    return acc;
  }, {});
}

function generateKey(text: string, context?: string): string {
  // Nettoyer le texte
  let cleanText = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')
    .trim();
  
  // Limiter la longueur
  if (cleanText.length > 50) {
    cleanText = cleanText.substring(0, 50);
  }
  
  // Ajouter le contexte si disponible
  if (context) {
    cleanText = `${context}_${cleanText}`;
  }
  
  return cleanText;
}

function extractStringsFromFile(filePath: string): TranslationKey[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys: TranslationKey[] = [];
  const lines = content.split('\n');
  
  // Détecter le contexte basé sur le chemin du fichier
  const context = path.basename(filePath, path.extname(filePath));
  
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    
    // Chercher les chaînes avec les patterns
    for (const pattern of STRING_PATTERNS) {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const text = match[1] || match[2];
        
        // Filtrer les chaînes trop courtes ou techniques
        if (text && text.length >= 3 && !IGNORE_WORDS.has(text.toLowerCase())) {
          const key = generateKey(text, context);
          
          // Éviter les doublons
          if (!keys.some(k => k.key === key) && !EXISTING_KEYS.has(key)) {
            keys.push({
              key,
              defaultValue: text,
              context,
              file: filePath,
              line: lineNum + 1
            });
          }
        }
      }
    }
  }
  
  return keys;
}

async function extractTranslations(): Promise<ExtractionResult> {
  console.log('🔍 Extraction des chaînes en dur...');
  
  // Charger les clés existantes
  loadExistingKeys();
  console.log(`📚 ${EXISTING_KEYS.size} clés existantes chargées`);
  
  // Trouver tous les fichiers TypeScript/TSX
  const files = await glob([
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}'
  ], {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}'
    ]
  });
  
  const allKeys: TranslationKey[] = [];
  
  for (const file of files) {
    try {
      const keys = extractStringsFromFile(file);
      allKeys.push(...keys);
    } catch (error) {
      console.warn(`⚠️ Erreur lors de l'extraction de ${file}:`, error);
    }
  }
  
  // Supprimer les doublons basés sur la valeur
  const uniqueKeys = allKeys.filter((key, index, self) => 
    index === self.findIndex(k => k.defaultValue === key.defaultValue)
  );
  
  const stats = {
    totalFiles: files.length,
    totalStrings: allKeys.length,
    uniqueKeys: uniqueKeys.length
  };
  
  return { keys: uniqueKeys, stats };
}

function generateTranslationFiles(keys: TranslationKey[]): void {
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  
  // Grouper les clés par contexte
  const groupedKeys = keys.reduce((acc, key) => {
    const context = key.context || 'common';
    if (!acc[context]) acc[context] = [];
    acc[context].push(key);
    return acc;
  }, {} as Record<string, TranslationKey[]>);
  
  // Générer les fichiers de traduction
  for (const locale of ['fr', 'en']) {
    const output: Record<string, any> = {};
    
    Object.entries(groupedKeys).forEach(([context, contextKeys]) => {
      output[context] = {};
      contextKeys.forEach(key => {
        output[context][key.key] = key.defaultValue;
      });
    });
    
    const outputPath = path.join(localesDir, `${locale}_extracted.json`);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`📝 Fichier généré: ${outputPath}`);
  }
}

function printResults(result: ExtractionResult): void {
  const { keys, stats } = result;
  
  console.log('\n📊 Résultats de l\'extraction:');
  console.log(`   Fichiers analysés: ${stats.totalFiles}`);
  console.log(`   Chaînes trouvées: ${stats.totalStrings}`);
  console.log(`   Clés uniques: ${stats.uniqueKeys}`);
  
  if (keys.length > 0) {
    console.log('\n🔑 Clés extraites:');
    keys.slice(0, 10).forEach(key => {
      console.log(`   ${key.key}: "${key.defaultValue}" (${key.file}:${key.line})`);
    });
    
    if (keys.length > 10) {
      console.log(`   ... et ${keys.length - 10} autres`);
    }
    
    // Générer les fichiers de traduction
    generateTranslationFiles(keys);
    
    console.log('\n💡 Prochaines étapes:');
    console.log('   1. Vérifier les fichiers générés dans i18n/locales/');
    console.log('   2. Intégrer les traductions dans les fichiers existants');
    console.log('   3. Remplacer les chaînes en dur par useTranslations()');
  } else {
    console.log('\n✅ Aucune nouvelle chaîne à extraire !');
  }
}

// Exécuter l'extraction
extractTranslations().then(printResults).catch(console.error); 