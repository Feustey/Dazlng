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

export async function sendEmail(to: string, subject: string, content: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'noreply@daznode.com',
      to,
      subject,
      html: content,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
} 