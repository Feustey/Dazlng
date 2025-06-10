#!/usr/bin/env tsx

/**
 * Script de test pour connexion au nœud Lightning réel
 * Usage: npm run test:node-connection
 */

import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';

// Configuration du nœud réel depuis l'interface
const NODE_CONFIG = {
  host: 'xyfhsompwmbzgyannjyt',
  port: '10009',
  macaroon_base64: 'AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghmZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh+P8KRYP/8='
};

async function testNodeConnection() {
  console.log('🔗 TEST DE CONNEXION AU NŒUD LIGHTNING RÉEL');
  console.log('=====================================');
  console.log(`Host: ${NODE_CONFIG.host}`);
  console.log(`Port: ${NODE_CONFIG.port}`);
  console.log(`Socket: ${NODE_CONFIG.host}:${NODE_CONFIG.port}`);
  console.log(`Macaroon length: ${NODE_CONFIG.macaroon_base64.length} chars`);
  
  try {
    // Configuration des variables d'environnement temporaires
    process.env.DAZNODE_ADMIN_MACAROON = NODE_CONFIG.macaroon_base64;
    process.env.DAZNODE_SOCKET = `${NODE_CONFIG.host}:${NODE_CONFIG.port}`;
    
    // Pour le certificat TLS, on va essayer différentes approches
    // 1. Certificat par défaut (peut marcher avec Tor/onion)
    const defaultCert = Buffer.from('LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...', 'base64').toString('base64');
    process.env.DAZNODE_TLS_CERT = defaultCert;
    
    console.log('\n📋 Configuration appliquée');
    console.log('✅ DAZNODE_ADMIN_MACAROON: configuré');
    console.log('✅ DAZNODE_SOCKET: configuré');
    console.log('⚠️  DAZNODE_TLS_CERT: certificat par défaut (peut nécessiter le vrai certificat)');
    
    console.log('\n🔧 Création du service Lightning...');
    const service = createDazNodeLightningService();
    
    console.log('\n💓 Test de connectivité...');
    const health = await service.healthCheck();
    
    if (health.isOnline) {
      console.log('✅ CONNEXION RÉUSSIE !');
      console.log('📊 Informations du wallet:');
      console.log(`   - Public Key: ${health.walletInfo?.publicKey?.substring(0, 20)}...`);
      console.log(`   - Alias: ${health.walletInfo?.alias}`);
      console.log(`   - Block Height: ${health.walletInfo?.blockHeight}`);
      
      // Test de génération de facture
      console.log('\n📄 Test de génération de facture...');
      const invoice = await service.generateInvoice({
        amount: 1000,
        description: 'Test facture depuis nœud réel',
        expiry: 3600
      });
      
      console.log('✅ FACTURE GÉNÉRÉE AVEC SUCCÈS !');
      console.log(`   - ID: ${invoice.id}`);
      console.log(`   - Payment Hash: ${invoice.paymentHash?.substring(0, 20)}...`);
      console.log(`   - Amount: ${invoice.amount} sats`);
      console.log(`   - Payment Request: ${invoice.paymentRequest.substring(0, 50)}...`);
      
      // Test de vérification de statut
      console.log('\n🔍 Test de vérification de statut...');
      const status = await service.checkInvoiceStatus(invoice.paymentHash);
      console.log(`✅ Statut vérifié: ${status.status}`);
      
      console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
      console.log('🚀 Le nœud Lightning est prêt pour la production !');
      
    } else {
      console.log('❌ CONNEXION ÉCHOUÉE');
      console.log('💡 Solutions possibles:');
      console.log('   1. Vérifier que le certificat TLS est correct');
      console.log('   2. Vérifier que le nœud est accessible');
      console.log('   3. Vérifier la configuration réseau/firewall');
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR DE CONNEXION:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('DAZNODE_TLS_CERT')) {
        console.log('\n💡 CERTIFICAT TLS REQUIS');
        console.log('Pour obtenir le certificat TLS:');
        console.log('1. Accédez à votre nœud Lightning');
        console.log('2. Téléchargez le fichier tls.cert');
        console.log('3. Convertissez en base64: base64 -w0 tls.cert');
        console.log('4. Ajoutez à DAZNODE_TLS_CERT dans .env');
      } else if (error.message.includes('connection')) {
        console.log('\n💡 PROBLÈME DE CONNEXION');
        console.log('Vérifiez:');
        console.log('- Le nœud est en ligne et accessible');
        console.log(`- L'adresse ${NODE_CONFIG.host}:${NODE_CONFIG.port} est correcte`);
        console.log('- Les paramètres réseau/proxy');
      }
    }
  }
  
  console.log('\n=====================================');
  console.log('🏁 Test terminé');
}

// Variables d'environnement pour le test
function setTestEnvironment() {
  console.log('🔧 Configuration des variables d\'environnement de test...');
  
  // Affichage de la configuration pour debug
  console.log('\n📋 Configuration détaillée:');
  console.log(`   Host: ${NODE_CONFIG.host}`);
  console.log(`   Port: ${NODE_CONFIG.port}`);
  console.log(`   Macaroon (premiers 50 chars): ${NODE_CONFIG.macaroon_base64.substring(0, 50)}...`);
  console.log(`   Socket: ${NODE_CONFIG.host}:${NODE_CONFIG.port}`);
}

// Exécution si le script est lancé directement
if (require.main === module) {
  setTestEnvironment();
  
  testNodeConnection()
    .then(() => {
      console.log('\n✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erreur fatale:', error);
      process.exit(1);
    });
}

export default testNodeConnection; 