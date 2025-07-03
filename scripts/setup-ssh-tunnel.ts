#!/usr/bin/env tsx

/**
 * Configuration et gestion du tunnel SSH pour accès au nœud Lightning Tor
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration du tunnel
const TUNNEL_CONFIG = {
  localPort: 10009,
  remoteHost: 'xyfhsbompwmbzgyannjy5dpsjrcjbvwgfgawtulwv2ty4by2bxskxjid.onion',
  remotePort: 10009,
  // À configurer selon votre serveur
  sshUser: process.env.SSH_USER || 'ubuntu', 
  sshHost: process.env.SSH_HOST || 'your-server.com',
  sshPort: process.env.SSH_PORT || '22',
  sshKey: process.env.SSH_KEY || '~/.ssh/id_rsa'
};

console.log('🔗 CONFIGURATION TUNNEL SSH POUR NŒUD LIGHTNING TOR');
console.log('===================================================');

async function _checkSshConnection() {
  console.log('🔍 Vérification connexion SSH...');
  
  try {
    const { stdout } = await execAsync(`ssh -p ${TUNNEL_CONFIG.sshPort} -i ${TUNNEL_CONFIG.sshKey} -o ConnectTimeout=10 ${TUNNEL_CONFIG.sshUser}@${TUNNEL_CONFIG.sshHost} 'echo "SSH OK"'`);
    
    if (stdout.includes('SSH OK')) {
      console.log('✅ Connexion SSH fonctionnelle');
      return true;
    } else {
      console.log('❌ Connexion SSH échouée');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur SSH:', (error as Error).message);
    console.log('\n💡 Solutions:');
    console.log('1. Configurer les variables SSH:');
    console.log('   export SSH_USER=your-username');
    console.log('   export SSH_HOST=your-server.com');
    console.log('   export SSH_KEY=~/.ssh/your-key');
    console.log('2. Vérifier les clés SSH: ssh-add ~/.ssh/your-key');
    console.log('3. Tester manuellement: ssh user@server');
    return false;
  }
}

async function _checkLocalPortFree() {
  console.log(`🔍 Vérification port local ${TUNNEL_CONFIG.localPort}...`);
  
  try {
    const { stdout } = await execAsync(`lsof -i :${TUNNEL_CONFIG.localPort}`);
    if (stdout.trim()) {
      console.log(`⚠️  Port ${TUNNEL_CONFIG.localPort} déjà utilisé:`);
      console.log(stdout);
      console.log(`💡 Libérer avec: sudo lsof -ti:${TUNNEL_CONFIG.localPort} | xargs kill -9`);
      return false;
    } else {
      console.log(`✅ Port ${TUNNEL_CONFIG.localPort} disponible`);
      return true;
    }
  } catch (error) {
    // Port libre (lsof retourne erreur si rien trouvé)
    console.log(`✅ Port ${TUNNEL_CONFIG.localPort} disponible`);
    return true;
  }
}

function _createTunnel(): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('🚇 Création du tunnel SSH...');
    console.log(`   Local: localhost:${TUNNEL_CONFIG.localPort}`);
    console.log(`   Remote: ${TUNNEL_CONFIG.remoteHost}:${TUNNEL_CONFIG.remotePort}`);
    console.log(`   Via: ${TUNNEL_CONFIG.sshUser}@${TUNNEL_CONFIG.sshHost}`);
    
    const sshArgs = [
      '-L', `${TUNNEL_CONFIG.localPort}:${TUNNEL_CONFIG.remoteHost}:${TUNNEL_CONFIG.remotePort}`,
      '-p', TUNNEL_CONFIG.sshPort,
      '-i', TUNNEL_CONFIG.sshKey,
      '-N', // Pas de commande distante
      '-T', // Pas de TTY
      '-o', 'ServerAliveInterval=60',
      '-o', 'ServerAliveCountMax=3',
      '-o', 'ExitOnForwardFailure=yes',
      `${TUNNEL_CONFIG.sshUser}@${TUNNEL_CONFIG.sshHost}`
    ];
    
    console.log(`Commande SSH: ssh ${sshArgs.join(' ')}`);
    
    const tunnel = spawn('ssh', sshArgs);
    
    tunnel.stdout?.on('data', (data) => {
      console.log('SSH stdout:', data.toString());
    });
    
    tunnel.stderr?.on('data', (data) => {
      const message = data.toString();
      console.log('SSH stderr:', message);
      
      if (message.includes('bind: Address already in use')) {
        console.log('❌ Port déjà utilisé');
        resolve(false);
      } else if (message.includes('Connection established')) {
        console.log('✅ Tunnel établi');
        resolve(true);
      }
    });
    
    tunnel.on('error', (error) => {
      console.log('❌ Erreur tunnel:', error.message);
      resolve(false);
    });
    
    tunnel.on('exit', (code, signal) => {
      console.log(`🔚 Tunnel fermé (code: ${code}, signal: ${signal})`);
      resolve(false);
    });
    
    // Test de connectivité après 3 secondes
    setTimeout(async () => {
      try {
        const { stdout } = await execAsync(`nc -z localhost ${TUNNEL_CONFIG.localPort} && echo "TUNNEL_OK" || echo "TUNNEL_FAIL"`);
        if (stdout.includes('TUNNEL_OK')) {
          console.log('✅ Tunnel SSH opérationnel !');
          resolve(true);
        } else {
          console.log('❌ Tunnel non fonctionnel');
          tunnel.kill();
          resolve(false);
        }
      } catch (error) {
        console.log('❌ Test tunnel échoué');
        tunnel.kill();
        resolve(false);
      }
    }, 3000);
  });
}

async function _testLightningViaTunnel() {
  console.log('\n⚡ Test connexion Lightning via tunnel...');
  
  // Configuration temporaire pour localhost
  process.env.DAZNODE_TLS_CERT = 'MIICJDCCAcugAwIBAgIRAJ-fns518h7AJFfDysGkJvgwCgYIKoZIzj0EAwIwODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMB4XDTI0MDgyMDE2NTk1NloXDTI1MTAxNTE2NTk1NlowODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyXC2SABV_r3fofM2X4A7vu23Y4OhuXUMVsWTQaqz4k5N5asFKfvM8PAYhy3A1B13uG0RG2y3vOv0u6vcrNrdAqOBtTCBsjAOBgNVHQ8BAf8EBAMCAqQwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDwYDVR0TAQH_BAUwAwEB_zAdBgNVHQ4EFgQUO36dre3JP1A93Cl698OBDAVTBAgwWwYDVR0RBFQwUoIJbG9jYWxob3N0ggx1bWJyZWwubG9jYWyCBHVuaXiCCnVuaXhwYWNrZXSCB2J1ZmNvbm6HBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAoVFQkwCgYIKoZIzj0EAwIDRwAwRAIgFtRk0TZmISho7hRfsu4Sdzz2OenJMIjijGwShjvn-owCIAiEVl-nVBUqFs3KvUIYaDu3aFPaKokat9TPxjpNxGLt';
  process.env.DAZNODE_ADMIN_MACAROON = 'AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh-P8KRYP_8';
  process.env.DAZNODE_SOCKET = `localhost:${TUNNEL_CONFIG.localPort}`;
  
  try {
    // Import dynamique pour éviter les erreurs de compilation
    const { createDazNodeLightningService } = await import('../lib/services/daznode-lightning-service');
    
    console.log('🔧 Création service Lightning (via tunnel)...');
    const service = createDazNodeLightningService();
    
    console.log('💓 Health check...');
    const startTime = Date.now();
    const health = await service.healthCheck();
    const duration = Date.now() - startTime;
    
    if (health.isOnline) {
      console.log('🎉 CONNEXION LIGHTNING RÉUSSIE VIA TUNNEL !');
      console.log(`⚡ Durée: ${duration}ms`);
      console.log('\n📊 Informations du nœud:');
      console.log(`   Provider: ${health.provider}`);
      console.log(`   Status: En ligne`);
      // Test facture
      console.log('\n📄 Test génération facture...');
      const invoice = await service.generateInvoice({
        amount: 1000,
        description: 'Test via tunnel SSH',
        expiry: 3600
      });
      console.log('✅ Facture générée via tunnel !');
      console.log(`   ID: ${invoice.id}`);
      console.log(`   Amount: ${invoice.amount} sats`);
      return true;
    } else {
      console.log('❌ Health check échoué');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Erreur test Lightning:', (error as Error).message);
    return false;
  }
}

async function generateEnvConfig() {
  console.log('\n📝 Génération configuration .env pour tunnel...');
  
  const envConfig = `
# Configuration Lightning DazNode via tunnel SSH
# Tunnel: localhost:${TUNNEL_CONFIG.localPort} -> ${TUNNEL_CONFIG.remoteHost}:${TUNNEL_CONFIG.remotePort}

DAZNODE_TLS_CERT=MIICJDCCAcugAwIBAgIRAJ-fns518h7AJFfDysGkJvgwCgYIKoZIzj0EAwIwODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMB4XDTI0MDgyMDE2NTk1NloXDTI1MTAxNTE2NTk1NlowODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyXC2SABV_r3fofM2X4A7vu23Y4OhuXUMVsWTQaqz4k5N5asFKfvM8PAYhy3A1B13uG0RG2y3vOv0u6vcrNrdAqOBtTCBsjAOBgNVHQ8BAf8EBAMCAqQwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDwYDVR0TAQH_BAUwAwEB_zAdBgNVHQ4EFgQUO36dre3JP1A93Cl698OBDAVTBAgwWwYDVR0RBFQwUoIJbG9jYWxob3N0ggx1bWJyZWwubG9jYWyCBHVuaXiCCnVuaXhwYWNrZXSCB2J1ZmNvbm6HBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAoVFQkwCgYIKoZIzj0EAwIDRwAwRAIgFtRk0TZmISho7hRfsu4Sdzz2OenJMIjijGwShjvn-owCIAiEVl-nVBUqFs3KvUIYaDu3aFPaKokat9TPxjpNxGLt

DAZNODE_ADMIN_MACAROON=AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh-P8KRYP_8

# Socket via tunnel SSH (UTILISER CETTE LIGNE)
DAZNODE_SOCKET=localhost:${TUNNEL_CONFIG.localPort}

# Configuration SSH pour tunnel
SSH_USER=${TUNNEL_CONFIG.sshUser}
SSH_HOST=${TUNNEL_CONFIG.sshHost}
SSH_PORT=${TUNNEL_CONFIG.sshPort}
SSH_KEY=${TUNNEL_CONFIG.sshKey}
`;

  console.log('Configuration .env générée:');
  console.log(envConfig);
  
  return envConfig;
}

async function main() {
  console.log('🚀 CONFIGURATION TUNNEL SSH POUR NŒUD LIGHTNING');
  console.log('================================================');
  
  // Affichage de la configuration
  console.log('📋 Configuration actuelle:');
  console.log(`   SSH User: ${TUNNEL_CONFIG.sshUser}`);
  console.log(`   SSH Host: ${TUNNEL_CONFIG.sshHost}`);
  console.log(`   SSH Port: ${TUNNEL_CONFIG.sshPort}`);
  console.log(`   SSH Key: ${TUNNEL_CONFIG.sshKey}`);
  console.log(`   Local Port: ${TUNNEL_CONFIG.localPort}`);
  console.log(`   Remote: ${TUNNEL_CONFIG.remoteHost}:${TUNNEL_CONFIG.remotePort}`);
  
  // Génération config pour démo
  await generateEnvConfig();
  
  console.log('\n💡 ÉTAPES POUR CONFIGURER LE TUNNEL:');
  console.log('=====================================');
  console.log('1. Configurer les variables SSH:');
  console.log('   export SSH_USER=your-username');
  console.log('   export SSH_HOST=your-server.com');
  console.log('   export SSH_KEY=~/.ssh/your-key');
  console.log('');
  console.log('2. Tester la connexion SSH:');
  console.log('   ssh user@your-server.com');
  console.log('');
  console.log('3. Installer Tor sur le serveur (si nécessaire):');
  console.log('   sudo apt-get install tor');
  console.log('');
  console.log('4. Exécuter ce script avec les bonnes variables');
  console.log('');
  console.log('5. Ou créer manuellement le tunnel:');
  console.log(`   ssh -L ${TUNNEL_CONFIG.localPort}:${TUNNEL_CONFIG.remoteHost}:${TUNNEL_CONFIG.remotePort} user@server -N`);
  
  return true;
}

// Exécution
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✅ Configuration tunnel générée');
    })
    .catch((error) => {
      console.error('\n💥 Erreur:', error);
      process.exit(1);
    });
} 