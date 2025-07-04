#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface ValidationResult {
  file: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase', 'migrations');

// Patterns de validation
const VALIDATION_PATTERNS = {
  // Vérifier la casse SQL standard
  lowercaseKeywords: /(create|alter|drop|insert|update|delete|select)\s+/gi,
  
  // Vérifier les contraintes de clés étrangères
  missingForeignKey: /CREATE TABLE.*user_id.*UUID.*NOT NULL(?!.*REFERENCES)/gi,
  
  // Vérifier les contraintes CHECK
  missingCheckConstraints: /CREATE TABLE.*status.*VARCHAR.*NOT NULL(?!.*CHECK)/gi,
  
  // Vérifier les index dupliqués
  duplicateIndexes: /CREATE INDEX.*orders_payment_hash/gi,
  
  // Vérifier les triggers problématiques
  problematicTriggers: /CREATE TRIGGER.*cleanup.*ON.*payment_logs/gi,
  
  // Vérifier les politiques RLS circulaires
  circularRLS: /payment_logs.*orders.*auth\.uid/gi,
};

function validateSqlFile(filePath: string): ValidationResult {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Vérifier la casse SQL
  const lowercaseMatches = content.match(VALIDATION_PATTERNS.lowercaseKeywords);
  if (lowercaseMatches) {
    warnings.push(`Mots-clés SQL en minuscules détectés: ${lowercaseMatches.length} occurrences`);
  }
  
  // Vérifier les clés étrangères manquantes
  if (content.includes('user_id') && !content.includes('REFERENCES')) {
    errors.push('Clé étrangère manquante pour user_id');
  }
  
  if (content.includes('order_id') && !content.includes('REFERENCES')) {
    errors.push('Clé étrangère manquante pour order_id');
  }
  
  // Vérifier les contraintes CHECK manquantes
  if (content.includes('payment_status') && !content.includes('CHECK')) {
    warnings.push('Contrainte CHECK manquante pour payment_status');
  }
  
  if (content.includes('status') && !content.includes('CHECK')) {
    warnings.push('Contrainte CHECK manquante pour status');
  }
  
  // Vérifier les index dupliqués
  const duplicateIndexMatches = content.match(VALIDATION_PATTERNS.duplicateIndexes);
  if (duplicateIndexMatches && duplicateIndexMatches.length > 1) {
    errors.push('Index dupliqués détectés');
  }
  
  // Vérifier les triggers problématiques
  if (content.includes('cleanup_old_payment_logs')) {
    warnings.push('Trigger de nettoyage automatique détecté - peut causer des blocages');
  }
  
  // Vérifier les politiques RLS circulaires
  if (content.includes('payment_logs') && content.includes('orders') && content.includes('auth.uid')) {
    warnings.push('Politique RLS potentiellement circulaire détectée');
  }
  
  // Vérifier la syntaxe de base
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Ignorer les lignes vides et commentaires
    if (!trimmedLine || trimmedLine.startsWith('--')) {
      return;
    }
    
    // Vérifier les points-virgules manquants
    if (trimmedLine && !trimmedLine.endsWith(';') && !trimmedLine.endsWith('$$')) {
      if (trimmedLine.startsWith('CREATE') || trimmedLine.startsWith('ALTER') || trimmedLine.startsWith('DROP')) {
        errors.push(`Point-virgule manquant ligne ${lineNum}: ${trimmedLine.substring(0, 50)}...`);
      }
    }
    
    // Vérifier les guillemets non fermés
    const quoteCount = (trimmedLine.match(/'/g) || []).length;
    if (quoteCount % 2 !== 0) {
      errors.push(`Guillemets non fermés ligne ${lineNum}: ${trimmedLine.substring(0, 50)}...`);
    }
  });
  
  return {
    file: fileName,
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

async function validateAllMigrations(): Promise<void> {
  console.log('🔍 Validation des migrations SQL...\n');
  
  const sqlFiles = await glob('*.sql', { cwd: MIGRATIONS_DIR });
  const results: ValidationResult[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const file of sqlFiles) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const result = validateSqlFile(filePath);
    results.push(result);
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  }
  
  // Trier par nombre d'erreurs
  results.sort((a, b) => b.errors.length - a.errors.length);
  
  console.log(`📊 Résultats de la validation:`);
  console.log(`   Fichiers analysés: ${results.length}`);
  console.log(`   Total d'erreurs: ${totalErrors}`);
  console.log(`   Total d'avertissements: ${totalWarnings}\n`);
  
  // Afficher les fichiers avec des erreurs
  const filesWithErrors = results.filter(r => r.errors.length > 0);
  
  if (filesWithErrors.length === 0) {
    console.log('✅ Aucune erreur critique détectée !');
  } else {
    console.log('🚨 Fichiers avec des erreurs:\n');
    
    filesWithErrors.forEach(result => {
      console.log(`📁 ${result.file}`);
      result.errors.forEach(error => {
        console.log(`   ❌ ${error}`);
      });
      console.log('');
    });
  }
  
  // Afficher les fichiers avec des avertissements
  const filesWithWarnings = results.filter(r => r.warnings.length > 0 && r.errors.length === 0);
  
  if (filesWithWarnings.length > 0) {
    console.log('⚠️  Fichiers avec des avertissements:\n');
    
    filesWithWarnings.forEach(result => {
      console.log(`📁 ${result.file}`);
      result.warnings.forEach(warning => {
        console.log(`   ⚠️  ${warning}`);
      });
      console.log('');
    });
  }
  
  // Statistiques
  const validFiles = results.filter(r => r.isValid).length;
  const invalidFiles = results.length - validFiles;
  
  console.log('📈 Statistiques:');
  console.log(`   Fichiers valides: ${validFiles}`);
  console.log(`   Fichiers avec problèmes: ${invalidFiles}`);
  console.log(`   Taux de réussite: ${((validFiles / results.length) * 100).toFixed(1)}%`);
  
  if (totalErrors > 0) {
    console.log('\n💡 Recommandations:');
    console.log('   1. Corriger les erreurs critiques en premier');
    console.log('   2. Standardiser la casse SQL');
    console.log('   3. Ajouter les contraintes manquantes');
    console.log('   4. Vérifier les références circulaires');
    
    process.exit(1);
  } else {
    console.log('\n🎉 Toutes les migrations sont valides !');
  }
}

// Exécuter la validation
validateAllMigrations().catch(console.error); 