import { Resend } from 'resend';
import 'dotenv/config';

if (!process.env.RESEND_API_KEY) {
  throw new Error('La clé API Resend n\'est pas définie dans les variables d\'environnement');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  html: string;
}

const DEFAULT_FROM = 'onboarding@resend.dev';

export async function sendEmail({ from = DEFAULT_FROM, to, subject, html }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error };
  }
} 