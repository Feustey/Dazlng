import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Stockage temporaire des challenges (en production, utiliser Redis)
declare global {
  // eslint-disable-next-line no-var
  var authChallenges: Map<string, { 
    timestamp: number; 
    k1: string; 
    pubkey?: string; 
    authenticated?: boolean 
  }> | undefined;
}

if (!global.authChallenges) {
  global.authChallenges = new Map();
}

const authChallenges = global.authChallenges;

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get('challenge');
  const k1 = searchParams.get('k1');
  const sig = searchParams.get('sig');
  const key = searchParams.get('key');

  // Étape 1: Générer le challenge initial
  if (challenge && !k1) {
    const k1Value = crypto.randomBytes(32).toString('hex');
    authChallenges.set(challenge, {
      timestamp: Date.now(),
      k1: k1Value
    });

    console.log('[LNURL-AUTH] Challenge généré:', { challenge, k1: k1Value });

    return NextResponse.json({
      tag: 'login',
      k1: k1Value,
      action: 'auth',
      domain: req.headers.get('host') || 'dazno.de',
      url: `${req.nextUrl.origin}/api/auth/lnurl-auth?challenge=${challenge}&k1=${k1Value}`
    });
  }

  // Étape 2: Vérifier la signature et authentifier
  if (challenge && k1 && sig && key) {
    const challengeData = authChallenges.get(challenge);
    
    if (!challengeData || challengeData.k1 !== k1) {
      console.log('[LNURL-AUTH] Challenge invalide ou expiré');
      return NextResponse.json({ status: 'ERROR', reason: 'Challenge invalide' }, { status: 400 });
    }

    // Vérifier que le challenge n'est pas trop ancien (5 minutes max)
    if (Date.now() - challengeData.timestamp > 5 * 60 * 1000) {
      authChallenges.delete(challenge);
      return NextResponse.json({ status: 'ERROR', reason: 'Challenge expiré' }, { status: 400 });
    }

    try {
      // Vérifier la signature LNURL-auth
      const messageToSign = k1;
      const isValidSignature = await verifyLNURLSignature(messageToSign, sig, key);
      
      if (!isValidSignature) {
        console.log('[LNURL-AUTH] Signature invalide');
        return NextResponse.json({ status: 'ERROR', reason: 'Signature invalide' }, { status: 400 });
      }

      // Marquer comme authentifié
      challengeData.pubkey = key;
      challengeData.authenticated = true;
      authChallenges.set(challenge, challengeData);

      console.log('[LNURL-AUTH] Authentification réussie pour pubkey:', key.substring(0, 10) + '...');

      // Créer ou mettre à jour l'utilisateur
      const { error: userError } = await supabase
        .from('profiles')
        .upsert({
          pubkey: key,
          last_node_sync: new Date().toISOString(),
          nom: `Lightning User ${key.substring(0, 8)}`,
          email: `${key.substring(0, 8)}@lightning.local`
        }, { 
          onConflict: 'pubkey',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (userError) {
        console.error('[LNURL-AUTH] Erreur création utilisateur:', userError);
        return NextResponse.json({ status: 'ERROR', reason: 'Erreur base de données' }, { status: 500 });
      }

      return NextResponse.json({ 
        status: 'OK',
        event: 'LOGGED_IN',
        pubkey: key
      });
    } catch (error) {
      console.error('[LNURL-AUTH] Erreur de vérification:', error);
      return NextResponse.json({ status: 'ERROR', reason: 'Erreur de vérification' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 'ERROR', reason: 'Paramètres manquants' }, { status: 400 });
}

// Endpoint pour vérifier si l'authentification est terminée
export async function POST(req: NextRequest): Promise<Response> {
  const { challenge } = await req.json();
  
  const challengeData = authChallenges.get(challenge);
  
  if (!challengeData || !challengeData.authenticated) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    // Générer le JWT pour l'utilisateur authentifié
    const token = jwt.sign(
      { 
        pubkey: challengeData.pubkey,
        type: 'lightning',
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Nettoyer le challenge utilisé
    authChallenges.delete(challenge);

    return NextResponse.json({ 
      authenticated: true, 
      token,
      pubkey: challengeData.pubkey 
    });
  } catch (error) {
    console.error('[LNURL-AUTH] Erreur génération token:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

async function verifyLNURLSignature(message: string, signature: string, pubkey: string): Promise<boolean> {
  try {
    // Utiliser la crypto native de Node.js pour vérifier la signature secp256k1
    const { secp256k1 } = await import('ethereum-cryptography/secp256k1');
    const { hexToBytes, utf8ToBytes } = await import('ethereum-cryptography/utils');
    
    const msgHash = await crypto.subtle.digest('SHA-256', utf8ToBytes(message));
    const sigBytes = hexToBytes(signature.replace(/^0x/, ''));
    const pubkeyBytes = hexToBytes(pubkey.replace(/^0x/, ''));
    
    return secp256k1.verify(sigBytes, new Uint8Array(msgHash), pubkeyBytes);
  } catch (error) {
    console.error('[LNURL-AUTH] Erreur vérification signature:', error);
    return false;
  }
} 