#!/usr/bin/env tsx

/**
 * Test DazNode Lightning avec localhost (simulation tunnel SSH)
 */

import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';

console.log('🏠 TEST DAZNODE LIGHTNING AVEC LOCALHOST');
console.log('=========================================');
console.log('🔗 Simulation tunnel SSH actif sur localhost:10009');
console.log('');

async function testWithLocalhost() {
  console.log('🔧 Configuration DazNode Lightning...');
  
  // Configuration avec localhost (simulation tunnel)
  process.env.DAZNODE_TLS_CERT = 'MIICJDCCAcugAwIBAgIRAJ-fns518h7AJFfDysGkJvgwCgYIKoZIzj0EAwIwODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMB4XDTI0MDgyMDE2NTk1NloXDTI1MTAxNTE2NTk1NlowODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyXC2SABV_r3fofM2X4A7vu23Y4OhuXUMVsWTQaqz4k5N5asFKfvM8PAYhy3A1B13uG0RG2y3vOv0u6vcrNrdAqOBtTCBsjAOBgNVHQ8BAf8EBAMCAqQwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDwYDVR0TAQH_BAUwAwEB_zAdBgNVHQ4EFgQUO36dre3JP1A93Cl698OBDAVTBAgwWwYDVR0RBFQwUoIJbG9jYWxob3N0ggx1bWJyZWwubG9jYWyCBHVuaXiCCnVuaXhwYWNrZXSCB2J1ZmNvbm6HBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAoVFQkwCgYIKoZIzj0EAwIDRwAwRAIgFtRk0TZmISho7hRfsu4Sdzz2OenJMIjijGwShjvn-owCIAiEVl-nVBUqFs3KvUIYaDu3aFPaKokat9TPxjpNxGLt';
  process.env.DAZNODE_ADMIN_MACAROON = 'AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh-P8KRYP_8';
  process.env.DAZNODE_SOCKET = 'localhost:10009';
  
  console.log('✅ Configuration chargée');
  console.log('   Socket: localhost:10009 (tunnel SSH simulé)');
  console.log('   Cert: Certificat TLS configuré');
  console.log('   Macaroon: Macaroon admin configuré');
  
  try {
    console.log('\n🚀 Création service Lightning...');
    const service = createDazNodeLightningService();
    
    console.log('\n💓 Health check du nœud...');
    console.log('⚠️  NOTE: Ce test échouera sans tunnel SSH actif');
    console.log('   Pour réussir, exécutez d\'abord:');
    console.log('   ssh -L 10009:xyfhsbompwmbzgyannjy5dpsjrcjbvwgfgawtulwv2ty4by2bxskxjid.onion:10009 user@server -N');
    
    const startTime = Date.now();
    const health = await service.healthCheck();
    const duration = Date.now() - startTime;
    
    if (health.isOnline) {
      console.log('🎉 CONNEXION RÉUSSIE VIA TUNNEL SSH !');
      console.log(`⚡ Durée: ${duration}ms`);
      console.log('\n📊 Informations du nœud:');
      console.log(`   Alias: ${health.walletInfo?.alias || 'N/A'}`);
      console.log(`   Pubkey: ${health.walletInfo?.publicKey?.substring(0, 20)}...`);
      console.log(`   Version: ${health.walletInfo?.version}`);
      console.log(`   Height: ${health.walletInfo?.blockHeight}`);
      console.log(`   Canaux: ${health.walletInfo?.activeChannelsCount}`);
      console.log(`   Peers: ${health.walletInfo?.peersCount}`);
      console.log(`   Synced Chain: ${health.walletInfo?.syncedToChain}`);
      console.log(`   Synced Graph: ${health.walletInfo?.syncedToGraph}`);
      
      console.log('\n📄 Test génération facture...');
      const invoice = await service.generateInvoice({
        amount: 2100,
        description: 'Test DazNode via tunnel SSH localhost',
        expiry: 3600
      });
      
      console.log('✅ Facture générée !');
      console.log(`   ID: ${invoice.id}`);
      console.log(`   Amount: ${invoice.amount} sats`);
      console.log(`   Expires: ${new Date(invoice.expiresAt).toLocaleString()}`);
      console.log(`   Payment Request: ${invoice.paymentRequest.substring(0, 50)}...`);
      
      console.log('\n📋 Vérification statut facture...');
      const status = await service.checkInvoiceStatus(invoice.id);
      console.log('✅ Statut récupéré :');
      console.log(`   Status: ${status.status}`);
      console.log(`   Amount: ${status.amount} sats`);
      
      console.log('\n🎯 TOUS LES TESTS RÉUSSIS !');
      console.log('✅ Service DazNode Lightning opérationnel');
      console.log('✅ Génération factures OK');
      console.log('✅ Vérification statuts OK');
      console.log('✅ Tunnel SSH fonctionnel');
      
      console.log('\n🚀 CONFIGURATION FINALE PRÊTE !');
      console.log('📋 Copier dans .env:');
      console.log('DAZNODE_SOCKET=localhost:10009');
      
      return { success: true, duration, invoice, status };
      
    } else {
      console.log('❌ Health check échoué');
      console.log('🔗 Tunnel SSH requis pour fonctionner');
      return { success: false, health };
    }
    
  } catch (error) {
    console.log('❌ Erreur:', (error as Error).message);
    
    if ((error as Error).message.includes('ECONNREFUSED')) {
      console.log('\n💡 TUNNEL SSH REQUIS');
      console.log('Le port localhost:10009 n\'est pas accessible.');
      console.log('');
      console.log('🔧 Solutions:');
      console.log('1. Créer tunnel SSH:');
      console.log('   ssh -L 10009:xyfhsbompwmbzgyannjy5dpsjrcjbvwgfgawtulwv2ty4by2bxskxjid.onion:10009 user@server -N');
      console.log('');
      console.log('2. Ou utiliser service systemd:');
      console.log('   sudo systemctl start lightning-tunnel');
      console.log('');
      console.log('3. Ou adresse clearnet:');
      console.log('   DAZNODE_SOCKET=your-public-ip:10009');
    }
    
    return { success: false, error: (error as Error).message };
  }
}

async function displayConfiguration() {
  console.log('\n📋 CONFIGURATION FINALE POUR PRODUCTION');
  console.log('========================================');
  
  console.log('\n1. 📝 Variables .env:');
  console.log('```env');
  console.log('DAZNODE_TLS_CERT=MIICJDCCAcugAwIBAgIRAJ-fns518h7AJFfDysGkJvgwCgYIKoZIzj0EAwIwODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMB4XDTI0MDgyMDE2NTk1NloXDTI1MTAxNTE2NTk1NlowODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyXC2SABV_r3fofM2X4A7vu23Y4OhuXUMVsWTQaqz4k5N5asFKfvM8PAYhy3A1B13uG0RG2y3vOv0u6vcrNrdAqOBtTCBsjAOBgNVHQ8BAf8EBAMCAqQwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDwYDVR0TAQH_BAUwAwEB_zAdBgNVHQ4EFgQUO36dre3JP1A93Cl698OBDAVTBAgwWwYDVR0RBFQwUoIJbG9jYWxob3N0ggx1bWJyZWwubG9jYWyCBHVuaXiCCnVuaXhwYWNrZXSCB2J1ZmNvbm6HBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAoVFQkwCgYIKoZIzj0EAwIDRwAwRAIgFtRk0TZmISho7hRfsu4Sdzz2OenJMIjijGwShjvn-owCIAiEVl-nVBUqFs3KvUIYaDu3aFPaKokat9TPxjpNxGLt');
  console.log('DAZNODE_ADMIN_MACAROON=AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh-P8KRYP_8');
  console.log('DAZNODE_SOCKET=localhost:10009');
  console.log('```');
  
  console.log('\n2. 🚇 Commande tunnel SSH:');
  console.log('```bash');
  console.log('ssh -L 10009:xyfhsbompwmbzgyannjy5dpsjrcjbvwgfgawtulwv2ty4by2bxskxjid.onion:10009 user@your-server.com -N');
  console.log('```');
  
  console.log('\n3. 🧪 Tests disponibles:');
  console.log('```bash');
  console.log('npm run test:daznode-lightning    # Test service standard');
  console.log('npm run test:daznode-localhost    # Test avec localhost');
  console.log('npm run test:daznode-api          # Test API endpoints');
  console.log('npm run setup-tunnel              # Configuration tunnel');
  console.log('```');
  
  console.log('\n4. 🚀 Déploiement:');
  console.log('```bash');
  console.log('npm run build                     # Build production');
  console.log('npm run start                     # Démarrage production');
  console.log('```');
}

async function main() {
  console.log('🧪 Démarrage test connexion localhost...');
  const result = await testWithLocalhost();
  
  if (result.success) {
    console.log('\n🎉 TEST RÉUSSI - TUNNEL SSH FONCTIONNEL !');
    console.log('🚀 Configuration DazNode Lightning opérationnelle');
    
    console.log('\n📈 Statistiques:');
    console.log(`   Temps connexion: ${result.duration}ms`);
    console.log(`   Facture ID: ${result.invoice?.id}`);
    console.log(`   Statut: ${result.status?.status}`);
    
    await displayConfiguration();
    
  } else {
    console.log('\n⚠️  TEST ATTENDU - TUNNEL SSH REQUIS');
    console.log('Ce résultat est normal sans tunnel actif.');
    
    await displayConfiguration();
    
    console.log('\n💡 PROCHAINES ÉTAPES:');
    console.log('1. Configurer un serveur avec accès Tor');
    console.log('2. Créer le tunnel SSH');
    console.log('3. Relancer ce test');
    console.log('4. Déployer en production');
  }
  
  return result.success;
}

// Exécution
if (require.main === module) {
  main()
    .then((success) => {
      console.log('\n✅ Test terminé');
      if (!success) {
        console.log('💡 Normal sans tunnel SSH - Configuration complète disponible');
      }
    })
    .catch((error) => {
      console.error('\n💥 Erreur:', error);
      process.exit(1);
    });
} 