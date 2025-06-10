#!/usr/bin/env tsx

/**
 * Test DazNode Lightning avec torify (wrapper Tor pour Node.js)
 */

import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';

// Configuration depuis l'URL LNDConnect
const CONFIG = {
  cert: 'MIICJDCCAcugAwIBAgIRAJ-fns518h7AJFfDysGkJvgwCgYIKoZIzj0EAwIwODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMB4XDTI0MDgyMDE2NTk1NloXDTI1MTAxNTE2NTk1NlowODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyXC2SABV_r3fofM2X4A7vu23Y4OhuXUMVsWTQaqz4k5N5asFKfvM8PAYhy3A1B13uG0RG2y3vOv0u6vcrNrdAqOBtTCBsjAOBgNVHQ8BAf8EBAMCAqQwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDwYDVR0TAQH_BAUwAwEB_zAdBgNVHQ4EFgQUO36dre3JP1A93Cl698OBDAVTBAgwWwYDVR0RBFQwUoIJbG9jYWxob3N0ggx1bWJyZWwubG9jYWyCBHVuaXiCCnVuaXhwYWNrZXSCB2J1ZmNvbm6HBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAoVFQkwCgYIKoZIzj0EAwIDRwAwRAIgFtRk0TZmISho7hRfsu4Sdzz2OenJMIjijGwShjvn-owCIAiEVl-nVBUqFs3KvUIYaDu3aFPaKokat9TPxjpNxGLt',
  macaroon: 'AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh-P8KRYP_8',
  socket: 'xyfhsbompwmbzgyannjy5dpsjrcjbvwgfgawtulwv2ty4by2bxskxjid.onion:10009'
};

console.log('🧅 TEST DAZNODE LIGHTNING AVEC TORIFY');
console.log('=====================================');
console.log('⚠️  Ce script doit être exécuté avec: torify npm run test:daznode-torify');
console.log('');

async function testConnection() {
  console.log('🔧 Configuration DazNode Lightning...');
  
  // Variables d'environnement
  process.env.DAZNODE_TLS_CERT = CONFIG.cert;
  process.env.DAZNODE_ADMIN_MACAROON = CONFIG.macaroon;
  process.env.DAZNODE_SOCKET = CONFIG.socket;
  
  console.log('✅ Configuration chargée');
  console.log(`   Socket: ${CONFIG.socket}`);
  console.log(`   Cert: ${CONFIG.cert.length} chars`);
  console.log(`   Macaroon: ${CONFIG.macaroon.length} chars`);
  
  try {
    console.log('\n🚀 Création service Lightning...');
    const service = createDazNodeLightningService();
    
    console.log('\n💓 Health check du nœud...');
    const startTime = Date.now();
    const health = await service.healthCheck();
    const duration = Date.now() - startTime;
    
    if (health.isOnline) {
      console.log('🎉 CONNEXION RÉUSSIE !');
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
        description: 'Test DazNode via Torify',
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
      console.log('✅ Connexion Tor stable');
      
      return { success: true, duration, invoice, status };
      
    } else {
      console.log('❌ Health check failed');
      return { success: false, health };
    }
    
  } catch (error) {
    console.log('❌ Erreur:', (error as Error).message);
    
    if ((error as Error).message.includes('Name resolution failed')) {
      console.log('\n💡 PROBLÈME DE RÉSOLUTION DNS');
      console.log('Solutions:');
      console.log('1. Utilisez: torify npm run test:daznode-torify');
      console.log('2. Ou tunnel SSH: ssh -L 10009:your.onion:10009 server');
      console.log('3. Ou adresse clearnet alternative');
    }
    
    return { success: false, error: (error as Error).message };
  }
}

async function main() {
  console.log('🔍 Vérification environnement Tor...');
  
  // Check si on utilise Tor
  const usingTor = process.env.TORSOCKS_CONF_FILE || 
                   process.env.SOCKS_SERVER || 
                   process.argv.includes('torify');
  
  if (usingTor) {
    console.log('✅ Détection Tor proxy');
  } else {
    console.log('⚠️  Tor non détecté - Utilisez: torify npm run test:daznode-torify');
  }
  
  console.log('\n🧪 Démarrage test connexion...');
  const result = await testConnection();
  
  if (result.success) {
    console.log('\n🎉 CONFIGURATION DAZNODE LIGHTNING COMPLÈTE !');
    console.log('🚀 Prêt pour déploiement production');
    
    console.log('\n📈 Statistiques:');
    console.log(`   Temps connexion: ${result.duration}ms`);
    console.log(`   Facture ID: ${result.invoice?.id}`);
    console.log(`   Statut: ${result.status?.status}`);
    
  } else {
    console.log('\n❌ Test échoué');
    console.log('💡 Essayez: torify npm run test:daznode-torify');
  }
  
  return result.success;
}

// Exécution
if (require.main === module) {
  main()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Erreur critique:', error);
      process.exit(1);
    });
} 