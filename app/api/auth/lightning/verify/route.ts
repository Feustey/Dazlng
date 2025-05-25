import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { subtle } from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const SIGNATURE_EXPIRY = 5 * 60 * 1000;

// Fonction de vérification Lightning modernisée
async function verifyLightningSignature(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    // Création du hash du message avec Web Crypto API
    const messagePrefix = '\x18Bitcoin Signed Message:\n';
    const messageData = new TextEncoder().encode(messagePrefix + message.length + message);
    const _messageHash = await subtle.digest('SHA-256', messageData);

    // Vérifications de base
    const sigBytes = hexToUint8Array(signature);
    const pubKeyBytes = hexToUint8Array(publicKey);

    if (sigBytes.length !== 64 && sigBytes.length !== 65) {
      return false;
    }

    if (pubKeyBytes.length !== 33) {
      return false;
    }

    // Note: En production, implémenter la vérification ECDSA complète
    return true;
  } catch (error) {
    console.error('Erreur de vérification de signature:', error);
    return false;
  }
}

// Fonction utilitaire pour convertir hex en Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { message, signature, publicKey, nonce } = await req.json();

    if (!message || !signature || !publicKey || !nonce) {
      return NextResponse.json(
        { error: 'Paramètres manquants: message, signature, publicKey et nonce requis' },
        { status: 400 }
      );
    }

    const messageParts = message.split(' - ');
    if (messageParts.length !== 3 || !messageParts[0].includes('Connexion à Daz3')) {
      return NextResponse.json(
        { error: 'Format de message invalide' },
        { status: 400 }
      );
    }

    const messageNonce = messageParts[1];
    if (messageNonce !== nonce) {
      return NextResponse.json(
        { error: 'Nonce invalide' },
        { status: 400 }
      );
    }

    const messageTime = new Date(messageParts[2]);
    const now = new Date();
    if (isNaN(messageTime.getTime()) || now.getTime() - messageTime.getTime() > SIGNATURE_EXPIRY) {
      return NextResponse.json(
        { error: 'Message expiré' },
        { status: 400 }
      );
    }

    const isValidSignature = await verifyLightningSignature(message, signature, publicKey);
    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 401 }
      );
    }

    const user = {
      id: publicKey,
      publicKey: publicKey,
      loginMethod: 'lightning',
      lastLogin: new Date().toISOString()
    };

    // Création du JWT avec jose
    const token = await new SignJWT({ 
      userId: user.id,
      publicKey: publicKey,
      loginMethod: 'lightning'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        publicKey: user.publicKey,
        loginMethod: user.loginMethod
      }
    });

  } catch (error) {
    console.error('Erreur de vérification Lightning:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification' },
      { status: 500 }
    );
  }
} 