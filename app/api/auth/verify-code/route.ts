import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest): Promise<Response> {
  const { email, code } = await req.json();
  console.log('[VERIFY-CODE] Tentative de vérification', { email, code });
  if (!email || !code) {
    console.log('[VERIFY-CODE] Email ou code manquant', { email, code });
    return new Response('Email et code requis', { status: 400 });
  }

  // Récupérer le code depuis Supabase
  const { data: otpEntry, error: otpError } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .single();
  console.log('[VERIFY-CODE] Entrée otp_codes', { otpEntry, otpError });
  if (otpError || !otpEntry) {
    console.log('[VERIFY-CODE] Aucun code trouvé pour cet email');
    return new Response('Code invalide ou expiré', { status: 401 });
  }
  if (otpEntry.code !== code) {
    console.log('[VERIFY-CODE] Code incorrect', { code_recu: code, code_attendu: otpEntry.code });
    return new Response('Code invalide ou expiré', { status: 401 });
  }
  if (otpEntry.expires_at < Date.now()) {
    console.log('[VERIFY-CODE] Code expiré', { expiration: otpEntry.expires_at, now: Date.now() });
    return new Response('Code invalide ou expiré', { status: 401 });
  }
  // Supprimer le code après usage
  await supabase.from('otp_codes').delete().eq('email', email);
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
    console.log('[VERIFY-CODE] Nouvel utilisateur créé', { user });
  }

  // Générer un JWT simple (id, email, name)
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  console.log('[VERIFY-CODE] Connexion réussie, JWT généré');
  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } });
} 