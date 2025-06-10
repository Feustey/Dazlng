#!/usr/bin/env tsx

/**
 * Test connexion DazNode Lightning avec proxy Tor
 */

import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';

// Configuration depuis l'URL LNDConnect décodée
const DAZNODE_CONFIG = {
  cert: 'MIICJDCCAcugAwIBAgIRAJ-fns518h7AJFfDysGkJvgwCgYIKoZIzj0EAwIwODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMB4XDTI0MDgyMDE2NTk1NloXDTI1MTAxNTE2NTk1NlowODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyXC2SABV_r3fofM2X4A7vu23Y4OhuXUMVsWTQaqz4k5N5asFKfvM8PAYhy3A1B13uG0RG2y3vOv0u6vcrNrdAqOBtTCBsjAOBgNVHQ8BAf8EBAMCAqQwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDwYDVR0TAQH_BAUwAwEB_zAdBgNVHQ4EFgQUO36dre3JP1A93Cl698OBDAVTBAgwWwYDVR0RBFQwUoIJbG9jYWxob3N0ggx1bWJyZWwubG9jYWyCBHVuaXiCCnVuaXhwYWNrZXSCB2J1ZmNvbm6HBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAoVFQkwCgYIKoZIzj0EAwIDRwAwRAIgFtRk0TZmISho7hRfsu4Sdzz2OenJMIjijGwShjvn-owCIAiEVl-nVBUqFs3KvUIYaDu3aFPaKokat9TPxjpNxGLt',
  macaroon: 'AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh-P8KRYP_8',
  socket: 'xyfhsbompwmbzgyannjy5dpsjrcjbvwgfgawtulwv2ty4by2bxskxjid.onion:10009'
};

console.log('🧅 TEST DAZNODE LIGHTNING AVEC PROXY TOR');
console.log('=========================================');

async function testTorConnection() {
  // Configuration proxy Tor
  process.env.HTTPS_PROXY = 'socks5://127.0.0.1:9050';
  process.env.ALL_PROXY = 'socks5://127.0.0.1:9050';
  
  // Configuration DazNode
  process.env.DAZNODE_TLS_CERT = DAZNODE_CONFIG.cert;
  process.env.DAZNODE_ADMIN_MACAROON = DAZNODE_CONFIG.macaroon;
  process.env.DAZNODE_SOCKET = DAZNODE_CONFIG.socket;
  
  console.log('✅ Configuration Tor proxy: socks5://127.0.0.1:9050');
  console.log('✅ Variables d\'environnement DazNode configurées');
  console.log(`   Socket: ${DAZNODE_CONFIG.socket}`);
  console.log(`   Cert length: ${DAZNODE_CONFIG.cert.length}`);
  console.log(`   Macaroon length: ${DAZNODE_CONFIG.macaroon.length}`);
  
  try {
    console.log('\n🔧 Création service Lightning...');
    const service = createDazNodeLightningService();
    
    console.log('\n💓 Test de connectivité via Tor...');
    const startTime = Date.now();
    const health = await service.healthCheck();
    const duration = Date.now() - startTime;
    
    if (health.isOnline) {
      console.log('🎉 CONNEXION RÉUSSIE VIA TOR !');
      console.log(`⚡ Temps de connexion: ${duration}ms`);
      console.log('\n📊 Informations du nœud:');
      console.log(`   - Alias: ${health.walletInfo?.alias || 'N/A'}`);
      console.log(`   - Public Key: ${health.walletInfo?.publicKey?.substring(0, 20)}...`);
      console.log(`   - Block Height: ${health.walletInfo?.blockHeight}`);
      console.log(`   - Version: ${health.walletInfo?.version}`);
      console.log(`   - Active Channels: ${health.walletInfo?.activeChannelsCount}`);
      console.log(`   - Peers: ${health.walletInfo?.peersCount}`);
      console.log(`   - Synced to Graph: ${health.walletInfo?.syncedToGraph}`);
      console.log(`   - Synced to Chain: ${health.walletInfo?.syncedToChain}`);
      
      console.log('\n📄 Test génération facture...');
      const invoice = await service.generateInvoice({
        amount: 1000,
        description: 'Test facture depuis nœud Tor DazNode',
        expiry: 3600
      });
      
      console.log('✅ Facture générée avec succès !');
      console.log(`   - ID: ${invoice.id}`);
      console.log(`   - Amount: ${invoice.amount} sats`);
      console.log(`   - Description: ${invoice.description}`);
      console.log(`   - Expires: ${new Date(invoice.expiresAt).toLocaleString()}`);
      console.log(`   - Payment Request: ${invoice.paymentRequest.substring(0, 60)}...`);
      
      console.log('\n📋 Test vérification facture...');
      const status = await service.checkInvoiceStatus(invoice.id);
      console.log('✅ Statut facture récupéré :');
      console.log(`   - ID: ${invoice.id}`);
      console.log(`   - Status: ${status.status}`);
      console.log(`   - Amount: ${status.amount} sats`);
      
      console.log('\n🚀 TOUS LES TESTS RÉUSSIS !');
      console.log('🎯 Configuration DazNode complètement fonctionnelle');
      console.log('⚡ Paiements Lightning opérationnels');
      
      return true;
      
    } else {
      console.log('❌ Health check failed');
      console.log('Health result:', health);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', (error as Error).message);
    console.log('\n🔍 Diagnostics:');
    
    if ((error as Error).message.includes('Name resolution failed')) {
      console.log('❌ Résolution DNS échouée - Proxy Tor non configuré correctement');
      console.log('💡 Solutions:');
      console.log('1. Vérifier que Tor est démarré: brew services list | grep tor');
      console.log('2. Vérifier port 9050: lsof -i :9050');
      console.log('3. Test manuel: curl --socks5 localhost:9050 http://check.torproject.org');
    }
    
    if ((error as Error).message.includes('ECONNREFUSED')) {
      console.log('❌ Connexion refusée - Service Tor non démarré');
      console.log('💡 Redémarrer Tor: brew services restart tor');
    }
    
    if ((error as Error).message.includes('timeout')) {
      console.log('❌ Timeout - Connexion Tor trop lente');
      console.log('💡 Attendre et réessayer');
    }
    
    return false;
  }
}

async function testTorService() {
  console.log('\n🔍 Test service Tor...');
  
  try {
    // Test si Tor est accessible
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);
    
    // Test port Tor
    const { stdout } = await execAsync('lsof -i :9050');
    if (stdout.includes('tor')) {
      console.log('✅ Service Tor actif sur port 9050');
    } else {
      console.log('❌ Service Tor non trouvé sur port 9050');
    }
    
  } catch (error) {
    console.log('⚠️  Impossible de vérifier le service Tor');
  }
}

// Test avec retry
async function testWithRetry(maxRetries = 3) {
  console.log(`🔄 Test avec retry (max: ${maxRetries})`);
  
  for (let i = 1; i <= maxRetries; i++) {
    console.log(`\n📝 Tentative ${i}/${maxRetries}`);
    
    await testTorService();
    
    const success = await testTorConnection();
    
    if (success) {
      console.log(`\n🎉 SUCCÈS à la tentative ${i} !`);
      return true;
    }
    
    if (i < maxRetries) {
      console.log(`⏳ Attente 5s avant tentative ${i + 1}...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('\n❌ Échec après toutes les tentatives');
  return false;
}

// Exécution
if (require.main === module) {
  testWithRetry()
    .then((success) => {
      if (success) {
        console.log('\n✅ CONFIGURATION DAZNODE LIGHTNING COMPLÈTE !');
        console.log('🚀 Prêt pour la production');
      } else {
        console.log('\n❌ Configuration incomplète');
        console.log('💡 Vérifier proxy Tor et connectivité réseau');
      }
    })
    .catch((error) => {
      console.error('\n💥 Erreur critique:', error);
    });
} 