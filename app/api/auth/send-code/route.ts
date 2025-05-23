import { sendEmail } from '@/utils/email';
import { otpStore } from '../otp-store';

export async function POST(req: Request): Promise<Response> {
  const { email } = await req.json();
  if (!email) return new Response('Email requis', { status: 400 });

  // Générer un code à 6 chiffres
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // Expire dans 10 minutes
  otpStore.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });

  await sendEmail({
    to: email,
    subject: 'Votre code de connexion',
    html: `<p>Votre code de connexion est : <b>${code}</b></p><p>Ce code expire dans 10 minutes.</p>`
  });

  return new Response(null, { status: 200 });
}

// Pour la vérification, on utilisera le même otpStore dans verify-code. 