import { Resend } from 'resend';
import 'dotenv/config';

if (!process.env.RESEND_API_KEY) {
  throw new Error('La clé API Resend n\'est pas définie dans les variables d\'environnement');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = 'contact@daznode.com' }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      // console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw new Error('Échec de l\'envoi de l\'email');
    }

    return data;
  } catch (error) {
    // console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Échec de l\'envoi de l\'email');
  }
} 