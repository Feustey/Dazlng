#!/usr/bin/env tsx

/**
 * Test de connexion pour adresses Tor/onion Lightning
 */

console.log('🧄 DIAGNOSTIC ADRESSE TOR/ONION');
console.log('===============================');

const host = 'xyfhsompwmbzgyannjyt';
const port = '10009';

console.log(`Host analysé: ${host}`);
console.log(`Port: ${port}`);

// Vérification si c'est une adresse onion
if (host.length === 20 && host.match(/^[a-z2-7]+$/)) {
  console.log('✅ Format détecté: Adresse Tor v2 probable');
} else if (host.length === 56 && host.match(/^[a-z2-7]+$/)) {
  console.log('✅ Format détecté: Adresse Tor v3 probable'); 
} else {
  console.log('⚠️  Format non standard pour une adresse Tor');
}

console.log('\n💡 SOLUTIONS POUR CONNEXION TOR:');
console.log('1. Utiliser un proxy Tor (recommandé)');
console.log('2. Utiliser Tailscale/ZeroTier pour tunnel');
console.log('3. Utiliser lndconnect avec proxy');
console.log('4. Configuration VPN/proxy HTTP');

// Test avec proxy Tor
import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';

async function testTorConnection() {
  console.log('\n🧪 TEST DIFFÉRENTES CONFIGURATIONS');
  console.log('===================================');
  
  const configs = [
    {
      name: 'Configuration directe (échouera probablement)',
      socket: `${host}:${port}`,
      useProxy: false
    },
    {
      name: 'Configuration avec .onion',
      socket: `${host}.onion:${port}`,
      useProxy: false
    },
    {
      name: 'Configuration localhost (si tunnel configuré)',
      socket: `localhost:${port}`,
      useProxy: false
    }
  ];
  
  const macaroon = 'AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghmZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh+P8KRYP/8=';
  const cert = Buffer.from('LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...', 'base64').toString('base64');
  
  for (const config of configs) {
    console.log(`\n🔧 Test: ${config.name}`);
    console.log(`   Socket: ${config.socket}`);
    
    try {
      // Configuration temporaire
      process.env.DAZNODE_TLS_CERT = cert;
      process.env.DAZNODE_ADMIN_MACAROON = macaroon;
      process.env.DAZNODE_SOCKET = config.socket;
      
      const service = createDazNodeLightningService();
      const health = await service.healthCheck();
      
      if (health.isOnline) {
        console.log('   ✅ CONNEXION RÉUSSIE !');
        console.log('   📊 Informations:', health.walletInfo?.alias);
        break; // Arrêter au premier succès
      } else {
        console.log('   ❌ Connexion échouée');
      }
      
    } catch (error) {
      const err = error as Error;
      console.log('   ❌ Erreur:', err.message.substring(0, 100) + '...');
      
      if (err.message.includes('Name resolution failed')) {
        console.log('   💡 Résolution DNS échouée - Tor proxy requis');
      } else if (err.message.includes('certificate')) {
        console.log('   💡 Problème de certificat TLS');
      } else if (err.message.includes('UNAVAILABLE')) {
        console.log('   💡 Service indisponible - vérifier proxy/tunnel');
      }
    }
  }
}

// Guide de configuration Tor
function showTorSetupGuide() {
  console.log('\n📚 GUIDE CONFIGURATION TOR POUR LIGHTNING');
  console.log('==========================================');
  
  console.log('\n🔧 Option 1: Proxy Tor local');
  console.log('1. Installer Tor: brew install tor');
  console.log('2. Démarrer Tor: tor');
  console.log('3. Configurer proxy SOCKS5: localhost:9050');
  
  console.log('\n🔧 Option 2: Tunnel SSH');
  console.log('1. Créer tunnel: ssh -L 10009:localhost:10009 user@server');
  console.log('2. Utiliser localhost:10009 dans la configuration');
  
  console.log('\n🔧 Option 3: LND Connect avec proxy');
  console.log('1. Utiliser lndconnect avec --onion');
  console.log('2. Configurer proxy dans l\'application');
  
  console.log('\n🔧 Option 4: Clearnet expose');
  console.log('1. Exposer le nœud via clearnet (non recommandé)');
  console.log('2. Utiliser un VPS/proxy public');
  
  console.log('\n⚠️  IMPORTANT:');
  console.log('- Les adresses Tor nécessitent un proxy Tor');
  console.log('- Vérifiez que Tor browser/service fonctionne');
  console.log('- Testez d\'abord avec curl/wget via proxy');
}

// LND Connect URL decoder
function decodeLndConnectUrl() {
  console.log('\n🔗 DÉCODAGE LNDCONNECT URL');
  console.log('==========================');
  
  // L'URL que je vois dans l'interface: lndconnect://xyfhsompwmbzgyannjyt...
  const baseUrl = `lndconnect://${host}:${port}`;
  console.log(`URL de base: ${baseUrl}`);
  
  console.log('\n💡 Pour utiliser LNDConnect:');
  console.log('1. Copiez l\'URL complète depuis l\'interface');
  console.log('2. Utilisez avec Zeus, BlueWallet, etc.');
  console.log('3. Ou décodez manuellement cert + macaroon');
  
  console.log('\n🔧 Configuration équivalente:');
  console.log(`Host: ${host}`);
  console.log(`Port: ${port}`);
  console.log('Macaroon: [celui que vous avez fourni]');
  console.log('Cert: [à obtenir depuis l\'interface]');
}

// Exécution
if (require.main === module) {
  console.log('🎯 OBJECTIF: Connecter DazNode à votre nœud Lightning');
  
  testTorConnection()
    .then(() => {
      showTorSetupGuide();
      decodeLndConnectUrl();
      
      console.log('\n📋 RÉSUMÉ CONFIGURATION ACTUELLE:');
      console.log('================================');
      console.log('✅ Macaroon: converti et prêt');
      console.log('⚠️  Certificat TLS: à obtenir depuis l\'interface');
      console.log('⚠️  Connexion réseau: proxy Tor requis');
      
      console.log('\n🎯 PROCHAINES ÉTAPES:');
      console.log('1. Obtenir le certificat TLS réel');
      console.log('2. Configurer proxy Tor ou tunnel');
      console.log('3. Tester la connexion');
      console.log('4. Intégrer dans DazNode');
    })
    .catch(console.error);
} 