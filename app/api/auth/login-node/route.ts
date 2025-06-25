import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils';

const JWT_SECRET = (process.env.JWT_SECRET ?? "") || 'your-secret-key';

export async function POST(req: NextRequest): Promise<Response> {
  const { pubkey, message, signature } = await req.json();
  
  console.log('[LOGIN-NODE] Tentative de connexion', { 
    pubkey: pubkey ? `${pubkey.substring(0, 10)}...` : 'null', 
    message,
    signature: signature ? `${signature.substring(0, 10)}...` : 'null'
  });
  
  if (!pubkey || !message || !signature) {
    console.log('[LOGIN-NODE] Paramètres manquants', { pubkey: !!pubkey, message: !!message, signature: !!signature });
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  // Vérifier le format du message (doit contenir "Connexion à Daznode")
  if (!message.includes('Connexion à Daznode')) {
    console.log('[LOGIN-NODE] Format de message invalide:', message);
    return NextResponse.json({ error: 'Format de message invalide' }, { status: 400 });
  }

  // Vérifier que le message n'est pas trop ancien (max 5 minutes)
  const messageMatch = message.match(/Connexion à Daznode - (.+)/);
  if (messageMatch) {
    try {
      const messageDate = new Date(messageMatch[1]);
      const now = new Date();
      const timeDiff = now.getTime() - messageDate.getTime();
      const maxAge = 5 * 60 * 1000; // 5 minutes en millisecondes
      
      if (timeDiff > maxAge) {
        console.log('[LOGIN-NODE] Message trop ancien', { 
          messageDate: messageDate.toISOString(), 
          now: now.toISOString(), 
          ageMinutes: Math.floor(timeDiff / 60000) 
        });
        return NextResponse.json({ error: 'Message trop ancien, veuillez réessayer' }, { status: 400 });
      }
    } catch (e) {
      console.log('[LOGIN-NODE] Erreur parsing date du message:', e);
    }
  }

  // Vérification de la signature secp256k1
  try {
    console.log('[LOGIN-NODE] Vérification de la signature...');
    
    const msgHash = await crypto.subtle.digest('SHA-256', utf8ToBytes(message));
    const sigBytes = hexToBytes(signature.replace(/^0x/, ''));
    const pubkeyBytes = hexToBytes(pubkey.replace(/^0x/, ''));
    
    console.log('[LOGIN-NODE] Longueurs:', { 
      signature: sigBytes.length, 
      pubkey: pubkeyBytes.length,
      messageHash: msgHash.byteLength
    });
    
    // La signature doit être 64 ou 65 bytes (DER ou compact)
    if (sigBytes.length !== 64 && sigBytes.length !== 65) {
      console.log('[LOGIN-NODE] Longueur de signature invalide:', sigBytes.length);
      return NextResponse.json({ error: 'Format de signature invalide' }, { status: 400 });
    }
    
    const isValid = secp256k1.verify(sigBytes, new Uint8Array(msgHash), pubkeyBytes);
    console.log('[LOGIN-NODE] Résultat vérification signature:', isValid);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
    }
  } catch (e) {
    console.error('[LOGIN-NODE] Erreur de vérification de signature:', e);
    return NextResponse.json({ error: 'Erreur de vérification de signature: ' + (e instanceof Error ? e.message : String(e)) }, { status: 400 });
  }

  // Vérifier si l'utilisateur existe, sinon le créer
  try {
    // ✅ Utiliser le client admin pour les opérations de base de données
    const supabase = getSupabaseAdminClient();
    
    let { data: user } = await supabase.from('profiles').select('*').eq('pubkey', pubkey).single();
    
    if (!user) {
      console.log('[LOGIN-NODE] Création nouvel utilisateur pour pubkey:', pubkey.substring(0, 10) + '...');
      const { data: newUser, error: createError } = await supabase.from('profiles').insert([{ pubkey }]).select().single();
      if (createError) {
        console.error('[LOGIN-NODE] Erreur création utilisateur:', createError);
        return NextResponse.json({ error: 'Erreur création utilisateur' }, { status: 500 });
      }
      user = newUser;
      console.log('[LOGIN-NODE] Nouvel utilisateur créé:', { id: user.id, pubkey: user.pubkey?.substring(0, 10) + '...' });
    } else {
      console.log('[LOGIN-NODE] Utilisateur existant trouvé:', { id: user.id, pubkey: user.pubkey?.substring(0, 10) + '...' });
    }

    // Générer un JWT simple (id, pubkey)
    const token = jwt.sign({ id: user.id, pubkey: user.pubkey }, JWT_SECRET, { expiresIn: '24h' });
    console.log('[LOGIN-NODE] Connexion réussie, JWT généré pour utilisateur:', user.id);
    
    return NextResponse.json({ token, user: { id: user.id, pubkey: user.pubkey } });
  } catch (e) {
    console.error('[LOGIN-NODE] Erreur base de données:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
