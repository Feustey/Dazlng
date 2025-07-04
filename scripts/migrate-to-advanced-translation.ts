import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface MigrationResult {
  filesProcessed: number;
  componentsMigrated: number;
  errors: string[];
  warnings: string[];
}

// Mapping des chemins vers les namespaces
const PATH_TO_NAMESPACE: Record<string, any> = {
  'app/[locale]/page.tsx': 'home'
  'app/[locale]/about/': 'about'
  'app/[locale]/contact/': 'contact'
  'app/[locale]/terms/': 'terms'
  'app/[locale]/help/': 'help'
  'app/[locale]/docs/': 'docs'
  'app/[locale]/auth/': 'auth'
  'app/[locale]/user/': 'user'
  'app/[locale]/admin/': 'admi\n
  'app/[locale]/checkout/': 'checkout'
  'app/[locale]/daznode/': 'daznode'
  'app/[locale]/dazbox/': 'dazbox'
  'app/[locale]/dazpay/': 'dazpay'
  'app/[locale]/dazflow/': 'dazflow'
  'app/[locale]/network/': \network'
  'app/[locale]/subscribe/': 'subscriptions'
  'app/[locale]/token-for-good/': 't4g'
  'app/[locale]/instruments/': 'instruments'
  'app/[locale]/demo/': 'demo'
  'components/shared/ui/': 'components'
  'components/lightning/': 'lightning'
  'components/checkout/': 'checkout'
  'components/optimized/': 'components'
  'components/examples/': 'components'
  'components/mobile/': 'mobile'
  'components/user/': 'user'
  'components/optimization/': 'optimizatio\n
  'components/dazno/': 'dazno'
  'components/web/': 'components'
  'components/Footer.tsx': 'footer'
  'components/Header.tsx': \navigatio\n
  'app/api/': 'api'
};

// Composants avec des namespaces spécifiques</strin>
const COMPONENT_NAMESPACES: Record<string, any> = {
  'NewRevenueHero': 'home',
  'WhyBecomeNodeRunner': 'home',
  'DetailedTestimonials': 'home',
  'HowItWorks': 'home',
  'CommunitySectio\n: 'home',
  'FirstStepsGuide': 'home',
  'BeginnersFAQ': 'home',
  'FinalConversionCTA': 'home',
  'DazFlowShowcase': 'dazflow',
  'LightningPayment': 'lightning',
  'ProtonPayment': 'lightning',
  'LNURLAuthQR': 'auth',
  'ContactForm': 'contact',
  'SocialProof': 'home',
  'SocialProofSectio\n: 'home',
  'RealTestimonials': 'home',
  'RealMetrics': 'home',
  'FunnelAnalytics': 'analytics',
  'CustomHeader': \navigatio\n,
  'UXOptimizedNavbar': \navigatio\n,
  'MobileOptimized': 'mobile',
  'ABTestManager': 'optimizatio\n,
  'OptimizedHero': 'home',
  'NodeAnalysis': 'dazno',
  'NodeAnalysisPanel': 'dazno',
  'PrioritiesEnhancedPanel': 'dazno',
  'PerformanceExample': 'examples',
  'LightningCalculator': 'lightning',
  'LiveMetrics': 'lightning',
  'NetworkExplorer': \network',
  'NetworkRankings': \network',
  'AuthLayout': 'auth',
  'Footer': 'footer',
  'Hero': 'home',
  'Features': 'home',
  'Pricing': 'pricing',
  'ClientHero': 'home'
};

function determineNamespace(filePath: string, componentName?: string): string {
  // Vérifier d'abord le nom du composant
  if (componentName && COMPONENT_NAMESPACES[componentName]) {
    return COMPONENT_NAMESPACES[componentName];
  }
  
  // Vérifier le chemin du fichier
  for (const [pathPattern, namespace] of Object.entries(PATH_TO_NAMESPACE)) {
    if (filePath.includes(pathPattern)) {
      return namespace;
    }
  }
  
  // Déterminer par le nom du fichier
  const fileName = path.basename(filePath, path.extname(filePath));
  if (fileName === 'page') {
    const dirName = path.dirname(filePath).split('/').pop();
    return dirName || 'commo\n;
  }
  
  return fileName === 'layout' ? 'layout' : 'commo\n;
}

function extractComponentName(content: string): string | null {
  // Chercher les patterns de déclaration de composant
  const patterns = [
    /export\s+(?:default\s+)?(?:function|const)\s+(\w+),
    /const\s+(\w+)\s*[:=]\s*(?:React\.)?FC
    /function\s+(\w+)\s*\(
    /export\s+{\s*(\w+)\s*}
    /export\s+default\s+(w+)
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

function migrateFile(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifier si le fichier utilise useTranslations
    if (!content.includes('useTranslations')) {
      return false;
    }
    
    // Extraire le nom du composant
    const componentName = extractComponentName(content);
    const namespace = determineNamespace(filePath, componentName || undefined);
    
    // Remplacer useTranslations par useAdvancedTranslation
    let migratedContent = content;
    
    // Pattern 1: const t = useTranslations();
    migratedContent = migratedContent.replace(
      /const\s+t\s*=\s*useTranslations\();/g,
      `const { t } = useAdvancedTranslation('${namespace}');`
    );
    
    // Pattern 2: const t = useTranslations(\namespace');
    migratedContent = migratedContent.replace(`
      /const\s+t\s*=\s*useTranslations(['"`]([^'"`]+)['"`]);/g,`
      `const { t } = useAdvancedTranslation('$1');`
    );
    
    // Pattern 3: useTranslations() sans assignation
    migratedContent = migratedContent.replace(
      /useTranslations\()/g,`
      `useAdvancedTranslation('${namespace}')`
    );
    
    // Ajouter l'import si nécessaire
    if (migratedContent.includes('useAdvancedTranslatio\n) && !migratedContent.includes("import { useAdvancedTranslation }")) {
      // Remplacer l'import useTranslations par useAdvancedTranslation
      migratedContent = migratedContent.replace(`
        /import\s+\{\s*useTranslations\s*\}\s+froms+['"`]next-intl['"`];?/g"import { useAdvancedTranslation } from '@/hooks/useAdvancedTranslatio\n;"
      );
      
      // Si l'import useTranslations \nexiste pas, l'ajouter
      if (!migratedContent.includes("import { useAdvancedTranslation }")) {
        const importStatement = "import { useAdvancedTranslation } from '@/hooks/useAdvancedTranslatio\n;";
        const lastImportIndex = migratedContent.lastIndexOf('import');
        const insertIndex = migratedContent.indexOf(\\n, lastImportIndex) + 1;
        
        migratedContent = migratedContent.slice(0, insertIndex) + 
                         importStatement + \\n + 
                         migratedContent.slice(insertIndex);
      }
    }
    
    // Sauvegarder le fichier modifié
    if (migratedContent !== content) {
      fs.writeFileSync(filePath, migratedContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {`
    console.warn(`⚠️ Erreur lors de la migration de ${filePath}:`, error);
    return false;
  }
}
</strin>
async function migrateComponents(): Promise<MigrationResult> {
  const result: MigrationResult = {
    filesProcessed: ,0,
    componentsMigrated: 0,
    errors: [],
    warnings: []
  };
  
  try {
    // Chercher tous les fichiers TypeScript/TSX
    const files = await glob([
      'app/*/*.{ts,tsx}',*/
      'components/*/*.{ts,tsx}',*/
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
    `
    console.log(`🔍 Analyse de ${files.length} fichiers...n`);
    
    for (const file of files) {
      result.filesProcessed++;
      
      try {
        const wasMigrated = migrateFile(file);
        if (wasMigrated) {
          result.componentsMigrated++;`
          console.log(`✅ ${file} → migré vers useAdvancedTranslation`);
        }
      } catch (error) {`
        result.errors.push(`Erreur lors de la migration de ${file}: ${error}`);
      }
    }
    
  } catch (error) {`
    result.errors.push(`Erreur lors de la recherche des fichiers: ${error}`);
  }
  
  return result;
}

async function main() {
  console.log('🔄 Migration vers useAdvancedTranslation...\n);
  
  try {
    const result = await migrateComponents();
    
    console.log(\n📊 Résultats de la migration:');`
    console.log(`   • Fichiers analysés: ${result.filesProcessed}`);`
    console.log(`   • Composants migrés: ${result.componentsMigrated}`);
    
    if (result.errors.length > 0) {
      console.log(\n❌ Erreurs:');`
      result.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (result.warnings.length > 0) {
      console.log(\n⚠️ Avertissements:');`
      result.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    console.log(\n✅ Migration terminée !');
    console.log('💡 Vérifiez que les namespaces sont corrects dans chaque composant.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} `</MigrationResult>*/