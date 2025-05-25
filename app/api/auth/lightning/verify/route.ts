import { NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SIGNATURE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Fonction pour vérifier la signature Lightning
function verifyLightningSignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    // Convertir la signature de hex à buffer
    const sigBuffer = Buffer.from(signature, 'hex');
    
    // Créer le hash du message selon la spécification Lightning
    const messagePrefix = '\x18Bitcoin Signed Message:\n';
    const messageBuffer = Buffer.from(message, 'utf8');
    const prefixBuffer = Buffer.from(messagePrefix + messageBuffer.length.toString(), 'utf8');
    const fullMessage = Buffer.concat([prefixBuffer, messageBuffer]);
    
    const _messageHash = crypto
      .createHash('sha256')
      .update(crypto.createHash('sha256').update(fullMessage).digest())
      .digest();
    
    // Convertir la clé publique de hex à buffer
    const pubKeyBuffer = Buffer.from(publicKey, 'hex');
    
    // Pour une vérification simplifiée, nous retournons true
    // En production, utilisez une bibliothèque comme secp256k1
    // pour vérifier la signature ECDSA
    
    // Vérifications de base
    if (sigBuffer.length !== 64 && sigBuffer.length !== 65) {
      return false;
    }
    
    if (pubKeyBuffer.length !== 33) {
      return false;
    }
    
    // Simulation d'une vérification réussie pour le développement
    // À remplacer par une vraie vérification secp256k1 en production
    return true;
    
  } catch (error) {
    console.error('Erreur de vérification de signature:', error);
    return false;
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { message, signature, publicKey, nonce } = await req.json();

    // Validation des paramètres
    if (!message || !signature || !publicKey || !nonce) {
      return NextResponse.json(
        { error: 'Paramètres manquants: message, signature, publicKey et nonce requis' },
        { status: 400 }
      );
    }

    // Vérifier le format du message
    const messageParts = message.split(' - ');
    if (messageParts.length !== 3 || !messageParts[0].includes('Connexion à Daz3')) {
      return NextResponse.json(
        { error: 'Format de message invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le nonce correspond
    const messageNonce = messageParts[1];
    if (messageNonce !== nonce) {
      return NextResponse.json(
        { error: 'Nonce invalide' },
        { status: 400 }
      );
    }

    // Vérifier le timestamp du message
    const messageTime = new Date(messageParts[2]);
    const now = new Date();
    if (isNaN(messageTime.getTime()) || now.getTime() - messageTime.getTime() > SIGNATURE_EXPIRY) {
      return NextResponse.json(
        { error: 'Message expiré' },
        { status: 400 }
      );
    }

    // Vérifier la signature
    const isValidSignature = verifyLightningSignature(message, signature, publicKey);
    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 401 }
      );
    }

    // Créer ou récupérer l'utilisateur
    // En production, vous devriez sauvegarder en base de données
    const user = {
      id: publicKey,
      publicKey: publicKey,
      loginMethod: 'lightning',
      lastLogin: new Date().toISOString()
    };

    // Générer un JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        publicKey: publicKey,
        loginMethod: 'lightning',
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 jours
      },
      JWT_SECRET
    );

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