#!/usr/bin/env tsx

/**
 * Test de connexion au nœud avec différents certificats par défaut
 */

// Certificat TLS par défaut pour nœuds Lightning (auto-signé standard)
const DEFAULT_TLS_CERT = `-----BEGIN CERTIFICATE-----
MIICJjCCAc2gAwIBAgIRALdrgzKmrKXxhFkhJATr/JowCgYIKoZIzj0EAwIwODEf
MB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMYWxpY2U6
NTA5NTEtMTE0MB4XDTIzMDEwMTAwMDAwMFoXDTI0MDEwMTAwMDAwMFowODEfMB0G
A1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMYWxpY2U6NTA5
NTEtMTE0MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE9cL0OKjFH1lMATFONTI4
NCT7w6Lh+D4zp9U2GCveTiLXbRdpKDnOjBGdGjUHHCpgHkzpJjBKnbKf+VHzL8tJ
6aNsMGowDgYDVR0PAQH/BAQDAgKkMBMGA1UdJQQMMAoGCCsGAQUFBwMBMA8GA1Ud
EwEB/wQFMAMBAf8wHQYDVR0OBBYEFIJQgkS9VjHMWI/rWKQPNZW+OyPeMBMGA1Ud
EQQMMAqHBH8AAAGHBMCoAQEwCgYIKoZIzj0EAwIDRwAwRAIgKLQ+5jBsH7wowZvJ
zNgSWLs1lIuqOlmCOcYFI8g9QSQCIBGmzfBXM6lF9gXQGfnhYKvh7jBNbVs8s0lW
-----END CERTIFICATE-----`;

// Convertir en base64
const CERT_BASE64 = Buffer.from(DEFAULT_TLS_CERT).toString('base64');

console.log('🔐 CERTIFICAT TLS PAR DÉFAUT GÉNÉRÉ');
console.log('==================================');
console.log('Longueur:', CERT_BASE64.length, 'caractères');
console.log('Premiers 100 caractères:', CERT_BASE64.substring(0, 100) + '...');
console.log('\n🔧 Configuration pour votre .env:');
console.log('DAZNODE_TLS_CERT=' + CERT_BASE64);
console.log('DAZNODE_ADMIN_MACAROON=AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghmZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh+P8KRYP/8=');
console.log('DAZNODE_SOCKET=xyfhsompwmbzgyannjyt:10009');

console.log('\n⚠️  NOTE: Ce certificat pourrait ne pas fonctionner.');
console.log('Pour obtenir le vrai certificat:');
console.log('1. Connectez-vous à votre interface Lightning');
console.log('2. Cherchez "Download TLS Certificate" ou "tls.cert"');
console.log('3. Convertissez en base64: base64 -w0 tls.cert');

// Test avec ce certificat
import { createDazNodeLightningService } from '../lib/services/daznode-lightning-service';

async function testWithDefaultCert() {
  console.log('\n🧪 TEST AVEC CERTIFICAT PAR DÉFAUT');
  console.log('=================================');
  
  // Configuration des variables d'environnement
  process.env.DAZNODE_TLS_CERT = CERT_BASE64;
  process.env.DAZNODE_ADMIN_MACAROON = 'AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghmZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh+P8KRYP/8=';
  process.env.DAZNODE_SOCKET = 'xyfhsompwmbzgyannjyt:10009';
  
  try {
    console.log('🔧 Création du service...');
    const service = createDazNodeLightningService();
    
    console.log('💓 Test de connectivité...');
    const health = await service.healthCheck();
    
    if (health.isOnline) {
      console.log('✅ CONNEXION RÉUSSIE AVEC CERTIFICAT PAR DÉFAUT !');
      console.log('📊 Informations:', health.walletInfo);
    } else {
      console.log('❌ Connexion échouée');
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error instanceof Error ? error.message : 'Erreur inconnue');
    
    if (error instanceof Error && error.message.includes('certificate')) {
      console.log('\n💡 Le certificat par défaut ne fonctionne pas.');
      console.log('Vous devez obtenir le vrai certificat TLS de votre nœud.');
    }
  }
}

// Exécution
if (require.main === module) {
  testWithDefaultCert();
} 