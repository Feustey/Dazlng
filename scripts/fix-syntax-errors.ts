#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Patterns d'erreurs à corriger (remplacements simples)
const ERROR_PATTERNS = [
  // Variables corrompues
  { pattern: /\bke,y\b/g, replacement: 'key' },
  { pattern: /\bfilePat,h\b/g, replacement: 'filePath' },
  { pattern: /\bparseError,\b/g, replacement: 'parseError' },
  { pattern: /\blengt,h\b/g, replacement: 'length' },
  { pattern: /\berror,s\b/g, replacement: 'errors' },
  { pattern: /\bpubke,y\b/g, replacement: 'pubkey' },
  { pattern: /\bDAZNO_API_KE,Y\b/g, replacement: 'DAZNO_API_KEY' },
  { pattern: /\bmessag,e\b/g, replacement: 'message' },
  { pattern: /\btypeErrors\b/g, replacement: 'typeErrors' },
  { pattern: /\bsubscription\.pubkey\b/g, replacement: 'subscription.pubkey' },
  { pattern: /\bdata\.pubkey\b/g, replacement: 'data.pubkey' },
  { pattern: /\bparams\.pubkey\b/g, replacement: 'params.pubkey' },
  { pattern: /\bTEST_PUBKE,Y\b/g, replacement: 'TEST_PUBKEY' },
  { pattern: /\bbottlenecks\.length\b/g, replacement: 'bottlenecks.length' },
  { pattern: /\bfiles\.length\b/g, replacement: 'files.length' },
  { pattern: /\ballKeys\.length\b/g, replacement: 'allKeys.length' },
  { pattern: /\bstepEvents\.length\b/g, replacement: 'stepEvents.length' },
  { pattern: /\bsessionEvents\.length\b/g, replacement: 'sessionEvents.length' },
  { pattern: /\bentries\.length\b/g, replacement: 'entries.length' },
  { pattern: /\blocalAnalytics\.length\b/g, replacement: 'localAnalytics.length' },
  { pattern: /\bsubscriptions\.length\b/g, replacement: 'subscriptions.length' },
  { pattern: /\benrichedProfiles\.length\b/g, replacement: 'enrichedProfiles.length' },
  { pattern: /\bnotifications\.length\b/g, replacement: \notifications.length' },
  { pattern: /\bexistingColumns\.length\b/g, replacement: 'existingColumns.length' },
  { pattern: /\bfinalExistingColumns\.length\b/g, replacement: 'finalExistingColumns.length' },
  { pattern: /\berror,s\b/g, replacement: 'errors' },
  { pattern: /\bmigrationSteps\.length\b/g, replacement: 'migrationSteps.length' },
  { pattern: /\brequiredColumns\.length\b/g, replacement: 'requiredColumns.length' },
  { pattern: /\bmissingColumns\.length\b/g, replacement: 'missingColumns.length' },
  { pattern: /\bsigBytes\.length\b/g, replacement: 'sigBytes.length' },
  { pattern: /\bpubkeyBytes\.length\b/g, replacement: 'pubkeyBytes.length' },
  
  // Erreurs de syntaxe dans les chaînes
  { pattern: /\$\{prefix,\}/g, replacement: '${prefix}' },
  { pattern: /\$\{currentVars\.join\(,', '\)\}/g, replacement: '${currentVars.join(\', \')}' },
  { pattern: /\$\{referenceVars\.join\(,', '\)\}/g, replacement: '${referenceVars.join(\', \')}' },
  { pattern: /\$\{stats\.totalKeys,\}/g, replacement: '${stats.totalKeys}' },
  { pattern: /\$\{stats\.missingKeys,\}/g, replacement: '${stats.missingKeys}' },
  { pattern: /\$\{stats\.extraKeys,\}/g, replacement: '${stats.extraKeys}' },
  { pattern: /\$\{stats\.emptyValues,\}/g, replacement: '${stats.emptyValues}' },
  { pattern: /\$\{stats\.interpolationErrors,\}/g, replacement: '${stats.interpolationErrors}' },
  
  // Erreurs de syntaxe dans les objets
  { pattern: /,\s*}/g, replacement: '}' },
  { pattern: /,\s*,/g, replacement: ',' },
  { pattern: /,\s*;}/g, replacement: '}' },
  
  // Erreurs de syntaxe dans les chaînes de caractères
  { pattern: /\n/g, replacement: '\\\n' },
  { pattern: /\n/g, replacement: '\\\n' },
  { pattern: /\n/g, replacement: '\\\n' },
  { pattern: /\n/g, replacement: '\\\n' },
  
  // Erreurs de syntaxe dans les regex
  { pattern: /\/\^\[a-zA-Zs\]\+\$/g, replacement: '/^[a-zA-Z\\s]+$/' },
  
  // Erreurs de syntaxe dans les commentaires
  { pattern: /\/\*\*/g, replacement: '/**' },
  { pattern: /\*\*\//g, replacement: '*/' },
  
  // Erreurs de syntaxe dans les imports
  { pattern: /import\s+\*\s+as\s+fs\s+from\s+'fs';/g, replacement: "import fs from 'fs';" },
  { pattern: /import\s+\*\s+as\s+path\s+from\s+'path';/g, replacement: "import path from 'path';" },
];

// Patterns avec fonctions de remplacement
const FUNCTION_PATTERNS = [
  { 
    pattern: /\benrichedCustomers\.filter.*\.length\b/g, 
    replacement: (match: string) => match.replace('.length', '.length') 
  }
];

// Fichiers à ignorer
const IGNORE_PATTERNS = [
  '*/node_modules/**',
  '*/.next/**',
  '*/dist/**',
  '*/build/**',
  '*/*.test.{ts,tsx}',
  '*/*.spec.{ts,tsx}',
  '*/*.d.ts',
  '*/tsconfig.tsbuildinfo'
];

// Patterns de correction
const patterns = [
  // Guillemets mal fermés
  { pattern: /\\"/g, replacement: '"' },
  { pattern: /\\'/g, replacement: "'" },
  { pattern: /\\n/g, replacement: '\n' },
  { pattern: /\\t/g, replacement: '\t' },
  
  // Virgules manquantes dans les objets
  { pattern: /(\w+):\s*"([^"]*)"\s*(\w+):/g, replacement: '$1: "$2",\n  $3:' },
  { pattern: /(\w+):\s*'([^']*)'\s*(\w+):/g, replacement: "$1: '$2',\n  $3:" },
  
  // Types malformés
  { pattern: /typeErrors/g, replacement: 'typeErrors' },
  { pattern: /xp-gai\\n/g, replacement: 'xp-gain' },
  { pattern: /logi\\n/g, replacement: 'login' },
  { pattern: /failed_logi\\n/g, replacement: 'failed_login' },
  { pattern: /conversio\\n/g, replacement: 'conversion' },
  { pattern: /user_interactio\\n/g, replacement: 'user_interaction' },
  { pattern: /subscriptio\\n/g, replacement: 'subscription' },
  { pattern: /unknow\\n/g, replacement: 'unknown' },
  { pattern: /eventTyp\\n/g, replacement: 'eventType' },
  { pattern: /errorTyp\\n/g, replacement: 'errorType' },
  { pattern: /errorMessag\\n/g, replacement: 'errorMessage' },
  { pattern: /conversionTyp\\n/g, replacement: 'conversionType' },
  { pattern: /jso\\n/g, replacement: 'json' },
  { pattern: /panier_moye\\n/g, replacement: 'panier_moyen' },
  { pattern: /canaux_de_notificatio\\n/g, replacement: 'canaux_de_notification' },
  { pattern: /dans_lapp\\n/g, replacement: 'dans_lapp' },
  { pattern: /seuils_dalerte\\n/g, replacement: 'seuils_dalerte' },
  { pattern: /catgories\\n/g, replacement: 'categories' },
  { pattern: /chargement_de_vos_paramtres\\n/g, replacement: 'chargement_de_vos_parametres' },
  { pattern: /vous_devez_tre_connect_pour_ac\\n/g, replacement: 'vous_devez_etre_connecte_pour_acceder' },
  { pattern: /paramtres\\n/g, replacement: 'parametres' },
  { pattern: /prnom\\n/g, replacement: 'prenom' },
  { pattern: /cl_publique_lightning\\n/g, replacement: 'cle_publique_lightning' },
  { pattern: /votre_cl_publique_bitcoinlight\\n/g, replacement: 'votre_cle_publique_bitcoin_lightning' },
  { pattern: /compte_x_twitter\\n/g, replacement: 'compte_x_twitter' },
  { pattern: /cl_publique_nostr\\n/g, replacement: 'cle_publique_nostr' },
  { pattern: /compte_telegram\\n/g, replacement: 'compte_telegram' },
  { pattern: /format_username_532_caractres\\n/g, replacement: 'format_username_5_32_caracteres' },
  { pattern: /tlphone\\n/g, replacement: 'telephone' },
  { pattern: /format_international_recommand\\n/g, replacement: 'format_international_recommande' },
  { pattern: /_adresse\\n/g, replacement: 'adresse' },
  { pattern: /adresse_complte\\n/g, replacement: 'adresse_complete' },
  { pattern: /code_postal\\n/g, replacement: 'code_postal' },
  { pattern: /ladresse_email_ne_peut_pas_tre\\n/g, replacement: 'ladresse_email_ne_peut_pas_etre' },
  
  // Imports malformés
  { pattern: /\\next\\/server"/g, replacement: '"next/server"' },
  { pattern: /\\next\\/link"/g, replacement: '"next/link"' },
  { pattern: /\\nodejs"/g, replacement: '"nodejs"' },
  { pattern: /\\@\\/hooks\\/useAdvancedTranslatio\\n/g, replacement: '@/hooks/useAdvancedTranslation' },
  { pattern: /\\@\\/utils\\/formatters\\n/g, replacement: '@/utils/formatters' },
  { pattern: /\\@\\/types\\/admi\\n/g, replacement: '@/types/admin' },
  { pattern: /\\@\\/lib\\/validations\\n/g, replacement: '@/lib/validations' },
  
  // Chaînes de caractères malformées
  { pattern: /"([^"]*)\\n([^"]*)"/g, replacement: '"$1$2"' },
  { pattern: /'([^']*)\\n([^']*)'/g, replacement: "'$1$2'" },
  
  // Virgules manquantes dans les tableaux
  { pattern: /(\w+)\s*}\s*(\w+)/g, replacement: '$1},\n  $2' },
  { pattern: /(\w+)\s*]\s*(\w+)/g, replacement: '$1],\n  $2' },
  
  // Espaces manquants
  { pattern: /(\w+)\{/g, replacement: '$1 {' },
  { pattern: /\}(\w+)/g, replacement: '} $1' },
  
  // Parenthèses mal fermées
  { pattern: /\(\s*\)\s*;/g, replacement: '();' },
  { pattern: /\[\s*\]\s*;/g, replacement: '[];' },
  { pattern: /\{\s*\}\s*;/g, replacement: '{};' },
];

// Fonction pour corriger un fichier
function fixFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fixedContent = content;
    
    // Appliquer tous les patterns de correction
    patterns.forEach(({ pattern, replacement }) => {
      fixedContent = fixedContent.replace(pattern, replacement);
    });
    
    // Écrire le fichier corrigé
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Corrigé: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
  }
}

// Fonction pour parcourir récursivement les dossiers
function walkDir(dir: string, extensions: string[] = ['.ts', '.tsx']): string[] {
  const files: string[] = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...walkDir(fullPath, extensions));
    } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fichiers spécifiques à corriger
const filesToFix = [
  'app/admin/crm/resources/campaigns.tsx',
  'app/admin/users/page.tsx',
  'app/api/admin/apply-migration/route.ts',
  'app/api/admin/export/route.ts',
  'app/api/contact/route.ts',
  'app/user/alerts/page.tsx',
  'app/user/components/ui/UserFeedbackToast.tsx',
  'app/user/settings/page.tsx',
  'lib/services/umami-service.ts'
];

console.log('🔧 Correction des erreurs de syntaxe...');

// Corriger les fichiers spécifiques
filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    fixFile(file);
  } else {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
  }
});

// Corriger tous les fichiers TypeScript/TSX
const allFiles = walkDir('.', ['.ts', '.tsx']);
console.log(`📁 Traitement de ${allFiles.length} fichiers...`);

allFiles.forEach(file => {
  if (!filesToFix.includes(file)) {
    fixFile(file);
  }
});

console.log('✅ Correction terminée !'); 