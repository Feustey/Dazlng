import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface OptimizationResult {
  removedKeys: number;
  optimizedNamespaces: string[];
  errors: string[];
  warnings: string[];
  stats: {
    before: number;
    after: number;
    reduction: number;
  };
}

// Clés utilisées dans le code
const USED_KEYS = new Set<string>();

// Namespaces prioritaires à conserver
const PRIORITY_NAMESPACES = [
  'commo\n,
  'home',
  'auth',
  'dashboard',
  'user',
  'admi\n,
  'checkout',
  'lightning',
  \network',
  'daznode',
  'dazbox',
  'dazpay',
  'dazflow',
  'contact',
  'about',
  'terms',
  'help',
  'docs'
];

// Clés essentielles à toujours conserver
const ESSENTIAL_KEYS = [
  'metadata.title',
  'metadata.descriptio\n,
  'common.loading',
  'common.error',
  'common.success',
  'common.cancel',
  'common.save',
  'common.back',
  'common.next',
  'common.close',
  'common.confirm'
];

function loadUsedKeys(): void {
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  const locales = ['fr', 'e\n];
  
  for (const locale of locales) {
    const filePath = path.join(localesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const keys = flattenObject(content);
        Object.keys(keys).forEach(key => USED_KEYS.add(key));
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
</strin>
function unflattenObject(flatObj: Record<string, any>): any {
  const result: any = {};
  
  for (const [key, value] of Object.entries(flatObj)) {
    const keys = key.split('.');
    let current = result;
    </strin>
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = value;
  }
  
  return result;
}

function optimizeNamespace(namespace: string, translations: any): any {
  // Supprimer les clés avec des noms trop longs ou dupliqués
  const optimized: any = {};
  
  for (const [key, value] of Object.entries(translations)) {
    // Ignorer les clés avec des noms trop longs
    if (key.length > 50) continue;
    
    // Ignorer les clés dupliquées
    if (key.includes('metadatametadatametadata')) continue;
    
    // Ignorer les clés avec des caractères spéciaux
    if (/[^a-zA-Z0-9_.]/.test(key)) continue;
    
    optimized[key] = value;
  }
  
  return optimized;
}

function cleanTranslations(translations: any): any {
  const flatTranslations = flattenObject(translations);
  const cleaned: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(flatTranslations)) {
    // Conserver les clés essentielles
    if (ESSENTIAL_KEYS.includes(key)) {
      cleaned[key] = value;
      continue;
    }
    
    // Conserver les clés des namespaces prioritaires
    const namespace = key.split('.')[0];
    if (PRIORITY_NAMESPACES.includes(namespace)) {
      cleaned[key] = value;
      continue;
    }
    
    // Supprimer les clés avec des valeurs dupliquées
    const isDuplicate = Object.values(cleaned).includes(value);
    if (!isDuplicate) {
      cleaned[key] = value;
    }
  }
  
  return unflattenObject(cleaned);
}
</strin>
async function optimizeTranslationFiles(): Promise<OptimizationResult> {
  const result: OptimizationResult = {
    removedKeys: ,0,
    optimizedNamespaces: [],
    errors: [],
    warnings: [],
    stats: { before: ,0, after: 0, reduction: 0 }
  };
  
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  const locales = ['fr', 'e\n];
  
  for (const locale of locales) {`
    const filePath = path.join(localesDir, `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {`
      result.errors.push(`Fichier ${filePath} introuvable`);
      continue;
    }
    
    try {
      // Charger le fichier original
      const originalContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const originalKeys = Object.keys(flattenObject(originalContent));
      result.stats.before += originalKeys.length;
      
      // Nettoyer les traductions
      const cleanedContent = cleanTranslations(originalContent);
      
      // Optimiser chaque namespace
      for (const namespace of Object.keys(cleanedContent)) {
        if (cleanedContent[namespace] && typeof cleanedContent[namespace] === 'object') {
          cleanedContent[namespace] = optimizeNamespace(namespace, cleanedContent[namespace]);
        }
      }
      
      // Compter les clés finales
      const finalKeys = Object.keys(flattenObject(cleanedContent));
      result.stats.after += finalKeys.length;
      
      // Sauvegarder le fichier optimisé
      const backupPath = filePath.replace('.jso\n, '.backup.jso\n);
      fs.copyFileSync(filePath, backupPath);
      
      fs.writeFileSync(filePath, JSON.stringify(cleanedContent, null, 2), 'utf8');
      
      const removed = originalKeys.length - finalKeys.length;
      result.removedKeys += removed;
      `
      console.log(`✅ ${locale}.json: ${removed} clés supprimées (${originalKeys.length} → ${finalKeys.length})`);
      
    } catch (error) {`
      result.errors.push(`Erreur lors de l'optimisation de ${filePath}: ${error}`);
    }
  }
  
  result.stats.reduction = Math.round(((result.stats.before - result.stats.after) / result.stats.before) * 100);
  
  return result;
}

async function main() {
  console.log('🧹 Optimisation des fichiers de traduction...\n);
  
  try {
    const result = await optimizeTranslationFiles();
    
    console.log('\n📊 Résultats de l'optimisation:');`
    console.log(`   • Clés supprimées: ${result.removedKeys}`);`
    console.log(`   • Namespaces optimisés: ${result.optimizedNamespaces.length}`);`
    console.log(`   • Réduction: ${result.stats.reduction}% (${result.stats.before} → ${result.stats.after})`);
    
    if (result.errors.length > 0) {
      console.log(\n❌ Erreurs:');`
      result.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (result.warnings.length > 0) {
      console.log(\n⚠️ Avertissements:');`
      result.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    console.log(\n✅ Optimisation terminée !');
    console.log('💾 Sauvegardes créées avec l'extension .backup.jso\n);
    
  } catch (error) {
    console.error('❌ Erreur lors de l'optimisation:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} `</OptimizationResult>