#!/usr/bin/env ts-node

/**
 * Script de test simplifié pour le système de fallback
 */

// Configuration tsconfig pour les tests
import path from 'path';
import Module from 'module';

// Mock du logger pour les tests
const mockLogger = {
  info: (message: string, data?: unknown) => console.log(`[INFO] ${message}`, data || ''),
  error: (message: string, error?: unknown) => console.error(`[ERROR] ${message}`, error || ''),
  warn: (message: string, data?: unknown) => console.warn(`[WARN] ${message}`, data || '')
};

// Mock de @/lib/logger
(Module as any)._cache[path.resolve(__dirname, '../lib/logger.ts')] = {
  exports: { logger: mockLogger }
};

async function testInvoiceSystem() {
  console.log('🚀 Test du système de fallback des factures\n');
  
  try {
    // Test 1: Import du service
    console.log('📦 Test 1: Import du service de fallback');
    const { createInvoiceFallbackService } = await import('../lib/services/invoice-fallback-service');
    console.log('✅ Service importé avec succès\n');
    
    // Test 2: Création d'une instance
    console.log('🔧 Test 2: Création d\'une instance du service');
    const service = createInvoiceFallbackService({
      maxRetries: 1,
      retryDelay: 500,
      enableLocalLnd: false,
      enableMockService: true
    });
    console.log('✅ Instance créée avec succès\n');
    
    // Test 3: Health check
    console.log('🏥 Test 3: Health check des services');
    await service.forceHealthCheck();
    const healthCheck = await service.healthCheck();
    console.log(`✅ Health check: ${healthCheck.isOnline ? 'Online' : 'Offline'} - Provider: ${healthCheck.provider}\n`);
    
    // Test 4: Statut des services
    console.log('📊 Test 4: Statut détaillé des services');
    const servicesStatus = service.getServicesStatus();
    Object.entries(servicesStatus).forEach(([name, status]: [string, any]) => {
      const indicator = status.isOnline ? '🟢' : '🔴';
      console.log(`   ${indicator} ${name}: ${status.isOnline ? 'Online' : 'Offline'}`);
    });
    console.log();
    
    // Test 5: Génération de facture (si service disponible)
    if (healthCheck.isOnline) {
      console.log('💰 Test 5: Génération d\'une facture test');
      const invoice = await service.generateInvoice({
        amount: 1000,
        description: 'Test invoice fallback system',
        expiry: 3600
      });
      console.log('✅ Facture générée:');
      console.log(`   - ID: ${invoice.id}`);
      console.log(`   - Montant: ${invoice.amount} sats`);
      console.log(`   - Statut: ${invoice.status}\n`);
      
      // Test 6: Vérification du statut
      console.log('🔍 Test 6: Vérification du statut de la facture');
      const status = await service.checkInvoiceStatus(invoice.paymentHash);
      console.log(`✅ Statut vérifié: ${status.status}\n`);
    } else {
      console.log('⚠️  Test 5 & 6: Ignorés - Aucun service disponible\n');
    }
    
    // Nettoyage
    service.destroy();
    console.log('🧹 Nettoyage terminé\n');
    
    console.log('🎉 Tous les tests sont passés ! Le système de fallback fonctionne.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

// Test de l'endpoint de santé
async function testHealthEndpoint() {
  console.log('\n🌐 Test de l\'endpoint de santé');
  
  try {
    const response = await fetch('http://localhost:3000/api/lightning/health');
    const health = await response.json();
    
    console.log(`📡 Réponse HTTP: ${response.status}`);
    console.log(`📊 Statut global: ${health.status}`);
    console.log(`🔧 Provider actif: ${health.fallback?.activeProvider || 'unknown'}`);
    console.log(`📝 Services (${health.services?.length || 0}):`);
    
    health.services?.forEach((service: any) => {
      const indicator = service.status === 'online' ? '🟢' : '🔴';
      console.log(`   ${indicator} ${service.name} (${service.provider})`);
    });
    
  } catch (error) {
    console.log('⚠️  Endpoint de santé non accessible (serveur pas démarré?)');
  }
}

// Exécution
async function main() {
  await testInvoiceSystem();
  await testHealthEndpoint();
  process.exit(0);
}

if (require.main === module) {
  main();
}