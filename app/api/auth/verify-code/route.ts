import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { otpStore } from '../otp-store';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest): Promise<Response> {
  const { email, code } = await req.json();
  if (!email || !code) return new Response('Email et code requis', { status: 400 });

  const entry = otpStore.get(email);
  if (!entry || entry.code !== code || entry.expires < Date.now()) {
    return new Response('Code invalide ou expiré', { status: 401 });
  }
  otpStore.delete(email);

  // Vérifier si l'utilisateur existe, sinon le créer
  let { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user) {
    const { data: newUser, error: createError } = await supabase.from('users').insert([{ email }]).select().single();
    if (createError) return new Response('Erreur création utilisateur', { status: 500 });
    user = newUser;
  }

  // Générer un JWT simple (id, email, name)
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } });
} 