#!/usr/bin/env tsx

/**
 * Script de nettoyage des fichiers obsolètes
 * Supprime les fichiers et dossiers non utilisés depuis plus de 2 semaines
 */

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';

console.log('🧹 Analyse des fichiers obsolètes...\n');

// Fichiers et dossiers à supprimer
const obsoleteItems = [
  // Dossiers obsolètes
  {
    path: 'admin/',
    reason: 'Remplacé par app/admin/ avec architecture Next.js 13+',
    type: 'directory'
  },
  {
    path: 'mobile/',
    reason: 'Application mobile Expo non utilisée dans ce projet web',
    type: 'directory'
  },
  {
    path: 'navigation/',
    reason: 'Navigation React Native non utilisée',
    type: 'directory'
  },
  {
    path: 'contexts/',
    reason: 'Contextes anciens remplacés par providers dans app/',
    type: 'directory'
  },
  
  // Fichiers de configuration mobile
  {
    path: 'app.config.js',
    reason: 'Configuration Expo non utilisée',
    type: 'file'
  },
  {
    path: 'metro.config.cjs',
    reason: 'Metro bundler React Native non utilisé',
    type: 'file'
  },
  {
    path: 'App.tsx',
    reason: 'Point d\'entrée mobile non utilisé (projet web)',
    type: 'file'
  },
  {
    path: 'expo-env.d.ts',
    reason: 'Types Expo non utilisés',
    type: 'file'
  },
  
  // Fichiers anciens
  {
    path: 'depcheck-result.json',
    reason: 'Résultat de depcheck obsolète',
    type: 'file'
  },
  {
    path: 'declarations.d.ts',
    reason: 'Déclarations TypeScript obsolètes',
    type: 'file'
  },
  {
    path: 'types/env.d.ts',
    reason: 'Types env anciens, remplacés par ceux de Next.js',
    type: 'file'
  },
  
  // Utilitaires obsolètes
  {
    path: 'utils/supabase/',
    reason: 'Utilitaires Supabase anciens, remplacés par lib/supabase.ts',
    type: 'directory'
  },
  {
    path: 'utils/jwt-manager.ts',
    reason: 'JWT manager non utilisé',
    type: 'file'
  },
  {
    path: 'utils/storage.ts',
    reason: 'Storage utils React Native non utilisé',
    type: 'file'
  },
  
  // Composants obsolètes
  {
    path: 'components/shared/ui/ThreeHero.tsx',
    reason: 'Composant Three.js non utilisé',
    type: 'file'
  },
  {
    path: 'components/shared/ui/ProtonPayments.tsx',
    reason: 'Composant Proton obsolète',
    type: 'file'
  },
  
  // API obsolètes
  {
    path: 'app/api/cron/',
    reason: 'Tâches cron non utilisées',
    type: 'directory'
  },
  {
    path: 'app/api/daznode/stats.ts',
    reason: 'API stats obsolète',
    type: 'file'
  },
  
  // Scripts obsolètes
  {
    path: 'fix-typescript.sh',
    reason: 'Script de fix TypeScript obsolète',
    type: 'file'
  },
  {
    path: 'scripts/generate-mcp-token.ts',
    reason: 'Générateur MCP non utilisé',
    type: 'file'
  },
  
  // Middleware ancien
  {
    path: 'middleware/auth.ts',
    reason: 'Middleware auth ancien, remplacé par middleware.ts à la racine',
    type: 'file'
  }
];

// Analyser chaque élément
let totalSize = 0;
const itemsToDelete: typeof obsoleteItems = [];

for (const item of obsoleteItems) {
  if (existsSync(item.path)) {
    try {
      const stats = statSync(item.path);
      const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
      
      if (ageInDays > 14) {
        console.log(`📁 ${item.path} (${item.type})`);
        console.log(`   Raison: ${item.reason}`);
        console.log(`   Âge: ${Math.round(ageInDays)} jours`);
        
        // Calculer la taille approximative
        if (item.type === 'file') {
          totalSize += stats.size;
        } else {
          try {
            const du = execSync(`du -s "${item.path}"`, { encoding: 'utf8' });
            const sizeKb = parseInt(du.split('\t')[0]);
            totalSize += sizeKb * 1024;
          } catch (e) {
            console.log(`   ⚠️  Impossible de calculer la taille`);
          }
        }
        
        itemsToDelete.push(item);
        console.log(`   ✅ Marqué pour suppression\n`);
      } else {
        console.log(`⏭️  ${item.path} - Récent (${Math.round(ageInDays)} jours), conservé\n`);
      }
    } catch (error) {
      console.log(`❌ Erreur lors de l'analyse de ${item.path}: ${error}\n`);
    }
  } else {
    console.log(`🚫 ${item.path} - N'existe pas\n`);
  }
}

console.log(`\n📊 Résumé:`);
console.log(`   Éléments à supprimer: ${itemsToDelete.length}`);
console.log(`   Espace libéré estimé: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

console.log(`\n🤔 Pour exécuter le nettoyage, utilisez:`);
console.log(`   npm run cleanup-confirm`);

// Générer le script de confirmation
const deleteCommands = itemsToDelete.map(item => `rm -rf "${item.path}"`).join(' && ');

if (deleteCommands) {
  console.log(`\n📝 Commande de suppression générée:`);
  console.log(`   ${deleteCommands}`);
} 