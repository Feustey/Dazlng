const fs = require('fs');
const path = require('path');

// Liste des fichiers à corriger
const filesToFix = [
  'app/api/crm/campaigns/route.ts',
  'lib/email/resend-service.ts'
];

// Pattern à remplacer
const oldPattern = `const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Variables d\\'environnement Supabase manquantes');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);`;

const newPattern = `const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ⚠️ Mode développement : permettre le build même sans service key
const isDevelopment = process.env.NODE_ENV === 'development';
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

if (!supabaseUrl || (!supabaseServiceKey && !isDevelopment && !isBuild)) {
  throw new Error('Variables d\\'environnement Supabase manquantes');
}

// Utiliser une clé factice en développement si nécessaire
const effectiveServiceKey = supabaseServiceKey || (isDevelopment || isBuild ? 'dummy-key-for-build' : '');

const supabase = createClient(supabaseUrl!, effectiveServiceKey);`;

console.log('🔧 Correction des fichiers avec problèmes de configuration Supabase...');

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Variante pour les fichiers sans const supabase
    const altPattern = `const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Variables d\\'environnement Supabase manquantes');
}`;

    const altNewPattern = `const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ⚠️ Mode développement : permettre le build même sans service key
const isDevelopment = process.env.NODE_ENV === 'development';
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

if (!supabaseUrl || (!supabaseServiceKey && !isDevelopment && !isBuild)) {
  throw new Error('Variables d\\'environnement Supabase manquantes');
}

// Utiliser une clé factice en développement si nécessaire
const effectiveServiceKey = supabaseServiceKey || (isDevelopment || isBuild ? 'dummy-key-for-build' : '');`;

    if (content.includes(oldPattern)) {
      content = content.replace(oldPattern, newPattern);
      console.log(`✅ Corrigé: ${filePath} (pattern complet)`);
    } else if (content.includes(altPattern)) {
      content = content.replace(altPattern, altNewPattern);
      // Correction supplémentaire pour les createClient
      content = content.replace(/createClient\(supabaseUrl, supabaseServiceKey\)/g, 'createClient(supabaseUrl!, effectiveServiceKey)');
      console.log(`✅ Corrigé: ${filePath} (pattern alternatif)`);
    } else {
      console.log(`⚠️  Pattern non trouvé dans: ${filePath}`);
    }
    
    fs.writeFileSync(filePath, content);
  } else {
    console.log(`❌ Fichier non trouvé: ${filePath}`);
  }
});

console.log('🎉 Correction terminée!'); 