import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest): Promise<Response> {
  const { email, code } = await req.json();
  
  console.log('[VERIFY-CODE] Tentative de vérification', { 
    email, 
    code: code ? `${code.length} caractères` : 'null',
    codeRaw: code 
  });
  
  if (!email || !code) {
    console.log('[VERIFY-CODE] Email ou code manquant', { email, code });
    return new Response('Email et code requis', { status: 400 });
  }

  // Normaliser le code (supprimer les espaces et caractères invisibles)
  const normalizedCode = code.toString().trim().replace(/\s+/g, '');
  console.log('[VERIFY-CODE] Code normalisé:', { original: code, normalized: normalizedCode });

  // Récupérer le code depuis Supabase
  const { data: otpEntry, error: otpError } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .single();
    
  console.log('[VERIFY-CODE] Entrée otp_codes', { 
    otpEntry: otpEntry ? { 
      email: otpEntry.email, 
      code: otpEntry.code,
      expires_at: otpEntry.expires_at,
      expires_date: new Date(otpEntry.expires_at).toISOString()
    } : null, 
    otpError 
  });
  
  if (otpError || !otpEntry) {
    console.log('[VERIFY-CODE] Aucun code trouvé pour cet email', { email, error: otpError });
    return new Response('Code invalide ou expiré', { status: 401 });
  }
  
  // Normaliser le code stocké aussi
  const storedCode = otpEntry.code.toString().trim();
  
  if (storedCode !== normalizedCode) {
    console.log('[VERIFY-CODE] Code incorrect', { 
      code_recu: normalizedCode, 
      code_attendu: storedCode,
      match: storedCode === normalizedCode
    });
    return new Response('Code invalide ou expiré', { status: 401 });
  }
  
  const now = Date.now();
  if (otpEntry.expires_at < now) {
    console.log('[VERIFY-CODE] Code expiré', { 
      expiration: otpEntry.expires_at, 
      now: now,
      expired_since: now - otpEntry.expires_at
    });
    return new Response('Code invalide ou expiré', { status: 401 });
  }
  
  // Supprimer le code après usage
  const { error: deleteError } = await supabase.from('otp_codes').delete().eq('email', email);
  if (deleteError) {
    console.warn('[VERIFY-CODE] Erreur lors de la suppression du code:', deleteError);
  }
  console.log('[VERIFY-CODE] Code validé et supprimé pour', email);

  // Vérifier si l'utilisateur existe, sinon le créer
  let { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user) {
    const { data: newUser, error: createError } = await supabase.from('users').insert([{ email }]).select().single();
    if (createError) {
      console.log('[VERIFY-CODE] Erreur création utilisateur', { createError });
      return new Response('Erreur création utilisateur', { status: 500 });
    }
    user = newUser;
    console.log('[VERIFY-CODE] Nouvel utilisateur créé', { user: { id: user.id, email: user.email } });
  }

  // Générer un JWT simple (id, email, name)
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  console.log('[VERIFY-CODE] Connexion réussie, JWT généré pour', user.email);
  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } });
} 