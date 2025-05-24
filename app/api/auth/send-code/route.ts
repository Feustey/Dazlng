import { sendEmail } from '@/utils/email';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request): Promise<Response> {
  const { email } = await req.json();
  if (!email) return new Response('Email requis', { status: 400 });

  // Générer un code à 6 chiffres
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = Date.now() + 10 * 60 * 1000;

  // Stocker ou mettre à jour le code dans Supabase
  const { error } = await supabase
    .from('otp_codes')
    .upsert({ email, code, expires_at });
  if (error) {
    console.log('[SEND-CODE] Erreur Supabase', { error });
    return new Response('Erreur stockage code', { status: 500 });
  }
  console.log('[SEND-CODE] Code généré et stocké', { email, code, expires_at });

  await sendEmail({
    to: email,
    subject: 'Votre code de connexion',
    html: `<p>Votre code de connexion est : <b>${code}</b></p><p>Ce code expire dans 10 minutes.</p>`
  });
  console.log('[SEND-CODE] Email envoyé', { email });

  return new Response(null, { status: 200 });
}

// Pour la vérification, on utilisera le même otpStore dans verify-code. 