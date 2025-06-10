#!/usr/bin/env tsx

/**
 * Décodage de l'URL LNDConnect et configuration du service Lightning
 */

const LNDCONNECT_URL = `lndconnect://xyfhsbompwmbzgyannjy5dpsjrcjbvwgfgawtulwv2ty4by2bxskxjid.onion:10009?cert=MIICJDCCAcugAwIBAgIRAJ-fns518h7AJFfDysGkJvgwCgYIKoZIzj0EAwIwODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMB4XDTI0MDgyMDE2NTk1NloXDTI1MTAxNTE2NTk1NlowODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyXC2SABV_r3fofM2X4A7vu23Y4OhuXUMVsWTQaqz4k5N5asFKfvM8PAYhy3A1B13uG0RG2y3vOv0u6vcrNrdAqOBtTCBsjAOBgNVHQ8BAf8EBAMCAqQwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDwYDVR0TAQH_BAUwAwEB_zAdBgNVHQ4EFgQUO36dre3JP1A93Cl698OBDAVTBAgwWwYDVR0RBFQwUoIJbG9jYWxob3N0ggx1bWJyZWwubG9jYWyCBHVuaXiCCnVuaXhwYWNrZXSCB2J1ZmNvbm6HBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAoVFQkwCgYIKoZIzj0EAwIDRwAwRAIgFtRk0TZmISho7hRfsu4Sdzz2OenJMIjijGwShjvn-owCIAiEVl-nVBUqFs3KvUIYaDu3aFPaKokat9TPxjpNxGLt&macaroon=AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh-P8KRYP_8`;

console.log('🔗 DÉCODAGE URL LNDCONNECT');
console.log('=========================');

function decodeLndConnect(url: string) {
  try {
    // Parser l'URL
    const urlObj = new URL(url);
    
    console.log('📋 INFORMATIONS EXTRAITES:');
    console.log('===========================');
    
    // Extraire les informations de base
    const hostname = urlObj.hostname;
    const port = urlObj.port;
    const socket = `${hostname}:${port}`;
    
    console.log(`✅ Hostname: ${hostname}`);
    console.log(`✅ Port: ${port}`);
    console.log(`✅ Socket: ${socket}`);
    
    // Vérifier le type d'adresse
    if (hostname.endsWith('.onion')) {
      const onionLength = hostname.replace('.onion', '').length;
      if (onionLength === 56) {
        console.log(`✅ Type: Adresse Tor v3 (${onionLength} chars)`);
      } else if (onionLength === 16) {
        console.log(`✅ Type: Adresse Tor v2 (${onionLength} chars)`);
      } else {
        console.log(`⚠️  Type: Adresse Tor non standard (${onionLength} chars)`);
      }
    } else {
      console.log(`✅ Type: Adresse clearnet`);
    }
    
    // Extraire le certificat
    const certParam = urlObj.searchParams.get('cert');
    console.log(`✅ Certificat TLS: ${certParam ? 'Présent' : 'Manquant'} (${certParam?.length || 0} chars)`);
    
    // Extraire le macaroon
    const macaroonParam = urlObj.searchParams.get('macaroon');
    console.log(`✅ Macaroon: ${macaroonParam ? 'Présent' : 'Manquant'} (${macaroonParam?.length || 0} chars)`);
    
    console.log('\n🔧 CONFIGURATION POUR DAZNODE:');
    console.log('===============================');
    
    console.log('# Variables d\'environnement à ajouter dans .env');
    console.log(`DAZNODE_TLS_CERT=${certParam}`);
    console.log(`DAZNODE_ADMIN_MACAROON=${macaroonParam}`);
    console.log(`DAZNODE_SOCKET=${socket}`);
    
    console.log('\n💡 NOTES IMPORTANTES:');
    console.log('=====================');
    
    if (hostname.endsWith('.onion')) {
      console.log('⚠️  Adresse Tor détectée - Proxy Tor requis:');
      console.log('   1. Installer Tor: brew install tor');
      console.log('   2. Démarrer Tor: tor &');
      console.log('   3. Proxy SOCKS5 sur localhost:9050');
      console.log('   4. Ou utiliser tunnel SSH/VPN');
    }
    
    if (hostname.includes('umbrel')) {
      console.log('🟣 Nœud Umbrel détecté');
      console.log('   - Configuration standard LND');
      console.log('   - Certificat auto-généré');
    }
    
    return {
      socket,
      cert: certParam,
      macaroon: macaroonParam,
      hostname,
      port,
      isTor: hostname.endsWith('.onion')
    };
    
  } catch (error) {
    console.error('❌ Erreur décodage URL:', error);
    return null;
  }
}

// Test de connexion avec les informations décodées
import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';

async function testWithDecodedInfo() {
  console.log('\n🧪 TEST CONNEXION AVEC INFORMATIONS DÉCODÉES');
  console.log('=============================================');
  
  const config = decodeLndConnect(LNDCONNECT_URL);
  
  if (!config) {
    console.log('❌ Impossible de décoder l\'URL');
    return;
  }
  
  // Configuration des variables d'environnement
  process.env.DAZNODE_TLS_CERT = config.cert!;
  process.env.DAZNODE_ADMIN_MACAROON = config.macaroon!;
  process.env.DAZNODE_SOCKET = config.socket;
  
  console.log('✅ Variables d\'environnement configurées');
  console.log(`   Socket: ${config.socket}`);
  console.log(`   Cert length: ${config.cert?.length}`);
  console.log(`   Macaroon length: ${config.macaroon?.length}`);
  
  try {
    console.log('\n🔧 Création du service Lightning...');
    const service = createDazNodeLightningService();
    
    if (config.isTor) {
      console.log('⚠️  Adresse Tor détectée - La connexion échouera sans proxy Tor');
      console.log('   Testez avec: torify node ou proxy SOCKS5');
    }
    
    console.log('\n💓 Test de connectivité...');
    const health = await service.healthCheck();
    
    if (health.isOnline) {
      console.log('🎉 CONNEXION RÉUSSIE !');
      console.log('📊 Informations du nœud:');
      console.log(`   - Public Key: ${health.walletInfo?.publicKey?.substring(0, 20)}...`);
      console.log(`   - Alias: ${health.walletInfo?.alias}`);
      console.log(`   - Block Height: ${health.walletInfo?.blockHeight}`);
      
      // Test génération facture
      console.log('\n📄 Test génération facture...');
      const invoice = await service.generateInvoice({
        amount: 1000,
        description: 'Test depuis URL LNDConnect décodée',
        expiry: 3600
      });
      
      console.log('✅ Facture générée avec succès !');
      console.log(`   - ID: ${invoice.id}`);
      console.log(`   - Amount: ${invoice.amount} sats`);
      console.log(`   - Payment Request: ${invoice.paymentRequest.substring(0, 50)}...`);
      
      console.log('\n🚀 CONFIGURATION COMPLÈTE ET FONCTIONNELLE !');
      
    } else {
      console.log('❌ Connexion échouée');
    }
    
  } catch (error) {
    console.log('❌ Erreur:', (error as Error).message);
    
    if ((error as Error).message.includes('Name resolution failed')) {
      console.log('\n💡 SOLUTION PROXY TOR:');
      console.log('1. Installer Tor: brew install tor');
      console.log('2. Démarrer Tor: tor &');
      console.log('3. Utiliser proxy: HTTPS_PROXY=socks5://localhost:9050');
      console.log('4. Ou tunnel SSH: ssh -L 10009:localhost:10009 user@server');
    }
  }
}

// Écriture du fichier .env
function writeEnvFile() {
  const config = decodeLndConnect(LNDCONNECT_URL);
  if (!config) return;
  
  console.log('\n📝 GÉNÉRATION FICHIER .env');
  console.log('===========================');
  
  const envContent = `
# Configuration Lightning DazNode
# Générée automatiquement depuis URL LNDConnect

# Certificat TLS (requis)
DAZNODE_TLS_CERT=${config.cert}

# Macaroon admin (requis)  
DAZNODE_ADMIN_MACAROON=${config.macaroon}

# Socket de connexion (requis)
DAZNODE_SOCKET=${config.socket}

# Configuration Tor (si nécessaire)
# HTTPS_PROXY=socks5://localhost:9050
# ALL_PROXY=socks5://localhost:9050

# Informations du nœud
# Hostname: ${config.hostname}
# Port: ${config.port}
# Type: ${config.isTor ? 'Tor Hidden Service' : 'Clearnet'}
`;

  console.log('Contenu .env généré:');
  console.log(envContent);
  
  return envContent;
}

// Exécution
if (require.main === module) {
  console.log('🎯 DÉCODAGE COMPLET URL LNDCONNECT');
  console.log('URL fournie:', LNDCONNECT_URL.substring(0, 100) + '...');
  
  // Décodage
  decodeLndConnect(LNDCONNECT_URL);
  
  // Génération .env
  writeEnvFile();
  
  // Test de connexion
  testWithDecodedInfo()
    .then(() => {
      console.log('\n✅ Décodage et test terminés');
    })
    .catch((error) => {
      console.error('\n❌ Erreur:', error);
    });
} 