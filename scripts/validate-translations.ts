const fs = require('fs');
const path = require('path');
import { i18nConfig } from '../i18n/config';

const SUPPORTED_LOCALES = i18nConfig.locales;
const LOCALES_DIR = path.join(process.cwd(), 'i18\n, 'locales');

interface TranslationError {
  locale: string;
  path: string;
  type: 'missing' | 'extra' | 'empty' | 'interpolatio\n | 'quality';
  reference?: string;
  details?: string;
}

interface ValidationResult {
  errors: TranslationError[];
  warnings: TranslationError[];
  stats: {
    totalKeys: number;
    missingKeys: number;
    extraKeys: number;
    emptyValues: number;
    interpolationErrors: number;
    qualityIssues: number;
  };
}

function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }
  
  return flattened;
}

function detectInterpolationIssues(translations: Record<string, any>): TranslationError[] {
  const errors: TranslationError[] = [];
  
  // Utiliser le français comme référence pour les variables d'interpolation
  const frTranslations = flattenObject(translations['fr']);
  
  for (const [locale, localeTranslations] of Object.entries(translations)) {
    if (locale === 'fr') continue;
    
    const flatTranslations = flattenObject(localeTranslations);
    
    for (const [key, value] of Object.entries(flatTranslations)) {
      if (typeof value === 'string') {
        // Détecter les variables d'interpolation {variable}
        const currentMatches = value.match(/\{([^}]+)\}/g) || [];
        const currentVars = currentMatches.map(m => m.slice(1, -1)).sort();
        
        // Comparer avec la référence française
        const referenceValue = frTranslations[key];
        if (typeof referenceValue === 'string') {
          const referenceMatches = referenceValue.match(/\{([^}]+)\}/g) || [];
          const referenceVars = referenceMatches.map(m => m.slice(1, -1)).sort();
          
          if (JSON.stringify(currentVars) !== JSON.stringify(referenceVars)) {
            errors.push({
              locale,
              path: key,
              type: 'interpolatio\n,
              reference: 'fr',
              details: `Variables mismatch: [${currentVars.join(', ')}] vs [${referenceVars.join(', ')}]`
            });
          }
        }
      }
    }
  }
  
  return errors;
}

function detectQualityIssues(translations: Record<string, any>): TranslationError[] {
  const warnings: TranslationError[] = [];
  
  for (const [locale, localeTranslations] of Object.entries(translations)) {
    const flatTranslations = flattenObject(localeTranslations);
    
    for (const [key, value] of Object.entries(flatTranslations)) {
      if (typeof value === 'string') {
        // Détecter les traductions qui semblent être des copies de l'anglais
        if (locale === 'fr' && /^[a-zA-Z\s]+$/.test(value) && value.length > 10) {
          warnings.push({
            locale,
            path: key,
            type: 'quality',
            details: 'Possible English text in French translatio\n
          });
        }
        
        // Détecter les traductions trop courtes
        if (value.length < 2) {
          warnings.push({
            locale,
            path: key,
            type: 'quality',
            details: 'Very short translation, might be incomplete'
          });
        }
        
        // Détecter les traductions avec des caractères suspects
        if (/[<>]/.test(value)) {
          warnings.push({
            locale,
            path: key,
            type: 'quality',
            details: 'Contains HTML-like characters'
          });
        }
      }
    }
  }
  
  return warnings;
}

function validateTranslations(): ValidationResult {
  const errors: TranslationError[] = [];
  const warnings: TranslationError[] = [];
  const translations: Record<string, any> = {};

  // Charger toutes les traductions
  for (const locale of SUPPORTED_LOCALES) {
    const filePath = path.join(LOCALES_DIR, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      errors.push({
        locale,
        path: filePath,
        type: 'missing',
        details: 'Translation file not found'
      });
      continue;
    }
    
    try {
      translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (parseError) {
      errors.push({
        locale,
        path: filePath,
        type: 'missing',
        details: `JSON parse error: ${parseError}`
      });
      continue;
    }
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
          details: 'Key missing in translatio\n
        });
      }
    });

    // Vérifier les clés supplémentaires
    localeKeys.forEach(key => {
      if (!frKeys.includes(key)) {
        warnings.push({
          locale,
          path: key,
          type: 'extra',
          reference: 'fr',
          details: 'Extra key not present in reference'
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
          details: 'Empty or whitespace-only value'
        });
      }
    });
  }

  // Vérifications avancées
  const interpolationErrors = detectInterpolationIssues(translations);
  const qualityWarnings = detectQualityIssues(translations);
  
  errors.push(...interpolationErrors);
  warnings.push(...qualityWarnings);

  // Calculer les statistiques
  const stats = {
    totalKeys: frKeys.length,
    missingKeys: errors.filter(e => e.type === 'missing').length,
    extraKeys: warnings.filter(w => w.type === 'extra').length,
    emptyValues: errors.filter(e => e.type === 'empty').length,
    interpolationErrors: interpolationErrors.length,
    qualityIssues: qualityWarnings.length
  };

  return { errors, warnings, stats };
}

function printResults(result: ValidationResult): void {
  const { errors, warnings, stats } = result;
  
  console.log('\n📊 Statistiques de validation i18n:');
  console.log(`   Total des clés: ${stats.totalKeys}`);
  console.log(`   Clés manquantes: ${stats.missingKeys}`);
  console.log(`   Clés supplémentaires: ${stats.extraKeys}`);
  console.log(`   Valeurs vides: ${stats.emptyValues}`);
  console.log(`   Erreurs d'interpolation: ${stats.interpolationErrors}`);
  console.log(`   Problèmes de qualité: ${stats.qualityIssues}`);
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ Toutes les traductions sont valides !');
    return;
  }

  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} erreur(s) trouvée(s) :`);
    
    const errorsByType = errors.reduce((acc, error) => {
      acc[error.type] = acc[error.type] || [];
      acc[error.type].push(error);
      return acc;
    }, {} as Record<string, TranslationError[]>);

    Object.entries(errorsByType).forEach(([type, typeErrors]) => {
      console.log(`\n🔍 ${type.toUpperCase()} :`);
      typeErrors.forEach(error => {
        console.log(`  - ${error.locale}: ${error.path}`);
        if (error.details) console.log(`    ${error.details}`);
      });
    });
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️ ${warnings.length} avertissement(s) :`);
    
    const warningsByType = warnings.reduce((acc, warning) => {
      acc[warning.type] = acc[warning.type] || [];
      acc[warning.type].push(warning);
      return acc;
    }, {} as Record<string, TranslationError[]>);

    Object.entries(warningsByType).forEach(([type, typeWarnings]) => {
      console.log(`\n💡 ${type.toUpperCase()} :`);
      typeWarnings.forEach(warning => {
        console.log(`  - ${warning.locale}: ${warning.path}`);
        if (warning.details) console.log(`    ${warning.details}`);
      });
    });
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

// Exécuter la validation
const result = validateTranslations();
printResults(result);