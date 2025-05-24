import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest): Promise<Response> {
  const { pubkey, message, signature } = await req.json();
  if (!pubkey || !message || !signature) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  // Vérification de la signature secp256k1
  try {
    const msgHash = await crypto.subtle.digest('SHA-256', utf8ToBytes(message));
    const sigBytes = hexToBytes(signature.replace(/^0x/, ''));
    const pubkeyBytes = hexToBytes(pubkey.replace(/^0x/, ''));
    // La signature doit être 64 ou 65 bytes (DER ou compact)
    const isValid = secp256k1.verify(sigBytes, new Uint8Array(msgHash), pubkeyBytes);
    if (!isValid) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Erreur de vérification de signature' }, { status: 400 });
  }

  // Vérifier si l'utilisateur existe, sinon le créer
  let { data: user } = await supabase.from('users').select('*').eq('pubkey', pubkey).single();
  if (!user) {
    const { data: newUser, error: createError } = await supabase.from('users').insert([{ pubkey }]).select().single();
    if (createError) {
      return NextResponse.json({ error: 'Erreur création utilisateur' }, { status: 500 });
    }
    user = newUser;
  }

  // Générer un JWT simple (id, pubkey)
  const token = jwt.sign({ id: user.id, pubkey: user.pubkey }, JWT_SECRET, { expiresIn: '24h' });
  return NextResponse.json({ token, user: { id: user.id, pubkey: user.pubkey } });
} 