import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.join(process.cwd(), 'i18n/locales');
const SUPPORTED_LOCALES = ['fr', 'en'];

interface TranslationError {
  locale: string;
  path: string;
  type: 'missing' | 'extra' | 'empty';
  reference?: string;
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

function validateTranslations(): TranslationError[] {
  const errors: TranslationError[] = [];
  const translations: Record<string, any> = {};

  // Charger toutes les traductions
  for (const locale of SUPPORTED_LOCALES) {
    const filePath = path.join(LOCALES_DIR, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      errors.push({
        locale,
        path: filePath,
        type: 'missing',
      });
      continue;
    }
    translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  // Utiliser le français comme référence
  const frKeys = Object.keys(flattenObject(translations['fr']));
  
  // Vérifier chaque locale
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === 'fr') continue;

    const localeKeys = Object.keys(flattenObject(translations[locale]));
    
    // Vérifier les clés manquantes
    frKeys.forEach(key => {
      if (!localeKeys.includes(key)) {
        errors.push({
          locale,
          path: key,
          type: 'missing',
          reference: 'fr',
        });
      }
    });

    // Vérifier les clés supplémentaires
    localeKeys.forEach(key => {
      if (!frKeys.includes(key)) {
        errors.push({
          locale,
          path: key,
          type: 'extra',
          reference: 'fr',
        });
      }
    });

    // Vérifier les valeurs vides
    const flatTranslations = flattenObject(translations[locale]);
    Object.entries(flatTranslations).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        errors.push({
          locale,
          path: key,
          type: 'empty',
        });
      }
    });
  }

  return errors;
}

function printErrors(errors: TranslationError[]): void {
  if (errors.length === 0) {
    console.log('✅ Toutes les traductions sont valides !');
    return;
  }

  console.log(`❌ ${errors.length} erreur(s) trouvée(s) :`);
  
  const errorsByType = errors.reduce((acc, error) => {
    acc[error.type] = acc[error.type] || [];
    acc[error.type].push(error);
    return acc;
  }, {} as Record<string, TranslationError[]>);

  if (errorsByType.missing) {
    console.log('\n🔍 Clés manquantes :');
    errorsByType.missing.forEach(error => {
      console.log(`  - ${error.locale}: ${error.path}`);
    });
  }

  if (errorsByType.extra) {
    console.log('\n➕ Clés supplémentaires :');
    errorsByType.extra.forEach(error => {
      console.log(`  - ${error.locale}: ${error.path}`);
    });
  }

  if (errorsByType.empty) {
    console.log('\n⚠️ Valeurs vides :');
    errorsByType.empty.forEach(error => {
      console.log(`  - ${error.locale}: ${error.path}`);
    });
  }

  process.exit(1);
}

// Exécuter la validation
const errors = validateTranslations();
printErrors(errors); 