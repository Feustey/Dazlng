import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface CleanupResult {
  removedKeys: number;
  updatedNamespaces: string[];
  errors: string[];
  warnings: string[];
}

// Clés utilisées dans le code
const USED_KEYS = new Set<string>();

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
function unflattenObject(flatObj: Record<string, string>): Record<string> {</string>
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(flatObj)) {
    const parts = key.split('.');
    let current = result;
    </strin>
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }
  
  return result;
}

async function scanForUsedKeys(): Promise<void> {
  console.log('🔍 Recherche des clés utilisées dans le code...');
  
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
  
  const patterns = [
    // t('key')`
    /\.t(['"`]([^'"`]+)['"`])/g
    // useTranslations(\namespace')`
    /useTranslations(['"`]([^'"`]+)['"`])/g
    // LocalizedText id="key"`
    /id=['"`]([^'"`]+)['"`]/g
    // namespace.key`
    /(['"`])([a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*)1/g
  ];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const key = match[1] || match[2];
          if (key && !key.includes(' ')) {
            USED_KEYS.add(key);
          }
        }
      }
    } catch (error) {`
      console.warn(`⚠️ Erreur lors de l'analyse de ${file}:`, error);
    }
  }
  `
  console.log(`📚 ${USED_KEYS.size} clés utilisées trouvées`);
}

function cleanupTranslationFiles(): CleanupResult {
  const result: CleanupResult = {
    removedKeys: ,0,
    updatedNamespaces: [],
    errors: [],
    warnings: []
  };
  
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  const locales = ['fr', 'e\n];
  
  for (const locale of locales) {`
    const filePath = path.join(localesDir, `${locale}.json`);
    
    try {
      if (!fs.existsSync(filePath)) {
        continue;
      }
      
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const flatContent = flattenObject(content);
      
      // Filtrer les clés non utilisées</void>
      const usedFlatContent: Record<string, any> = {};
      const removedKeys: string[] = [];
      
      for (const [key, value] of Object.entries(flatContent)) {
        if (USED_KEYS.has(key)) {
          usedFlatContent[key] = value;
        } else {
          removedKeys.push(key);
          result.removedKeys++;
        }
      }
      
      // Reconstruire la structure hiérarchique
      const cleanedContent = unflattenObject(usedFlatContent);
      
      // Sauvegarder le fichier nettoyé
      fs.writeFileSync(filePath, JSON.stringify(cleanedContent, null, 2), 'utf8');
      
      // Ajouter les namespaces mis à jour
      const updatedNamespaces = Object.keys(cleanedContent);
      updatedNamespaces.forEach(namespace => {
        if (!result.updatedNamespaces.includes(namespace)) {
          result.updatedNamespaces.push(namespace);
        }
      });
      
      if (removedKeys.length > 0) {`
        console.log(`🧹 ${locale}.json: ${removedKeys.length} clés supprimées`);`
        result.warnings.push(`${removedKeys.length} clés supprimées de ${locale}.json`);
      }
      
    } catch (error) {`
      const errorMsg = `Erreur lors du nettoyage de ${filePath}: ${error}`;
      result.errors.push(errorMsg);`
      console.error(`❌ ${errorMsg}`);
    }
  }
  
  return result;
}

function generateOptimizationReport(): void {
  const localesDir = path.join(process.cwd(), 'i18n/locales');
  const locales = ['fr', 'e\n];
  
  console.log('\n📊 RAPPORT D'OPTIMISATION:');
  console.log('==================================================');
  
  for (const locale of locales) {`
    const filePath = path.join(localesDir, `${locale}.json`);
    
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const flatContent = flattenObject(content);
        const usedKeys = Object.keys(flatContent).filter(key => USED_KEYS.has(key));
        `
        console.log(`n🌐 ${locale.toUpperCase()}:`);`
        console.log(`   Total des clés: ${Object.keys(flatContent).length}`);`
        console.log(`   Clés utilisées: ${usedKeys.length}`);`
        console.log(`   Clés supprimées: ${Object.keys(flatContent).length - usedKeys.length}`);`
        console.log(`   Couverture: ${((usedKeys.length / Object.keys(flatContent).length) * 100).toFixed(1)}%`);
        
        // Détail par namespace</strin>
        const namespaceStats = new Map<string>();
        
        for (const [key, value] of Object.entries(flatContent)) {
          const namespace = key.split('.')[0];
          const isUsed = USED_KEYS.has(key);
          
          if (!namespaceStats.has(namespace)) {
            namespaceStats.set(namespace, { total: 0, used: 0 });
          }
          
          const stats = namespaceStats.get(namespace)!;
          stats.total++;
          if (isUsed) stats.used++;
        }
        
        console.log(\n   Détail par namespace:');
        for (const [namespace, stats] of namespaceStats) {
          const coverage = ((stats.used / stats.total) * 100).toFixed(1);
          const status = stats.used === stats.total ? '🟢' : stats.used > 0 ? '🟡' : '🔴';`
          console.log(`   ${status} ${namespace}: ${stats.used}/${stats.total} (${coverage}%)`);
        }
        
      } catch (error) {`
        console.error(`❌ Erreur lors de l'analyse de ${filePath}:`, error);
      }
    }
  }
}
</string>
async function cleanupUnusedTranslations(): Promise<void> {
  console.log('🚀 Début du nettoyage des traductions non utilisées...\n);
  
  // Charger les clés existantes
  loadUsedKeys();
  
  // Scanner le code pour les clés utilisées
  await scanForUsedKeys();
  
  // Nettoyer les fichiers de traduction
  const result = cleanupTranslationFiles();
  
  console.log(\n📊 RÉSULTATS:');`
  console.log(`✅ ${result.removedKeys} clés supprimées`);`
  console.log(`📂 ${result.updatedNamespaces.length} namespaces mis à jour`);
  
  if (result.errors.length > 0) {
    console.log(\n❌ Erreurs:');`
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log(\n⚠️ Avertissements:');`
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  // Générer le rapport d'optimisation
  generateOptimizationReport();
  
  console.log(\n🎉 Nettoyage terminé !');
}

// Exécuter le script
if (require.main === module) {
  cleanupUnusedTranslations().catch(console.error);
}

export { cleanupUnusedTranslations }; `</void>