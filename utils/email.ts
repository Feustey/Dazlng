import { Resend } from 'resend';
import 'dotenv/config';

// Lazy initialization pour éviter les erreurs côté client
let resend: Resend | null = null;

function getResendInstance(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('La clé API Resend n\'est pas définie dans les variables d\'environnement');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailTemplateParams {
  title: string;
  subtitle?: string;
  username?: string;
  mainContent: string;
  detailedContent?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function generateEmailTemplate({
  title,
  subtitle = '',
  username = '',
  mainContent,
  detailedContent = '',
  ctaText = '',
  ctaLink = ''
}: EmailTemplateParams): string {
  if (title.toLowerCase().includes('code de connexion') || mainContent.toLowerCase().includes('code de connexion')) {
    return `<!DOCTYPE html>
<html lang=\"fr\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <title>Dazno.de</title>
  <style>body{background:#f9fafb;font-family:sans-serif;margin:0;padding:0}.container{max-width:480px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px 24px}.logo{text-align:center;margin-bottom:24px}.title{font-size:1.5rem;font-weight:700;margin-bottom:12px;text-align:center}.content{font-size:1.1rem;text-align:center;margin-bottom:24px}.footer{font-size:0.9rem;color:#a1a1aa;text-align:center;margin-top:32px}</style>
</head>
<body>
  <div class=\"container\">
    <div class=\"logo\">
      <img src=\"https://www.dazno.de/assets/images/logo-daznode.svg\" alt=\"Daznode Logo\" height=\"48\" />
    </div>
    <div class=\"title\">${title}</div>
    <div class=\"content\">${mainContent}</div>
  </div>
</body>
</html>`;
  }
  return `<!DOCTYPE html>
<html lang=\"fr\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <title>Dazno.de</title>
  <style>/* ... (styles du template fourni plus haut) ... */</style>
</head>
<body>
  <div class=\"email-container\">
    <div class=\"header\">
      <img src=\"https://www.dazno.de/assets/images/logo-daznode.svg\" alt=\"Daznode Logo\" class=\"logo\">
    </div>
    <div class=\"content\">
      <h1 class=\"title\">${title}</h1>
      <p class=\"text\">${username ? `Cher(e) ${username},` : ''}</p>
      <p class=\"text\">${mainContent}</p>
      ${subtitle ? `<h2 class=\"subtitle\">${subtitle}</h2>` : ''}
      ${detailedContent ? `<p class=\"text\">${detailedContent}</p>` : ''}
      ${ctaText && ctaLink ? `<a href=\"${ctaLink}\" class=\"cta-button\">${ctaText}</a>` : ''}
      <div class=\"footer\">
        <div class=\"footer-links\">
          <a href=\"https://dazno.de/about\" class=\"footer-link\">À propos</a>
          <a href=\"https://dazno.de/contact\" class=\"footer-link\">Contact</a>
          <a href=\"https://dazno.de/terms\" class=\"footer-link\">Conditions</a>
          <a href=\"https://dazno.de/unsubscribe\" class=\"footer-link\">Désabonnement</a>
        </div>
        <p class=\"copyright\">© 2025 Dazno.de - Tous droits réservés | Réalisé avec 💙 par <a href=\"https://inoval.io\" style=\"color: #A1A1AA;\">Inoval</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<any> {
  let finalHtml = html;
  if (!html?.includes('<!DOCTYPE html>')) {
    finalHtml = generateEmailTemplate({
      title: subject,
      mainContent: html
    });
  }
  try {
    const resendInstance = getResendInstance();
    const { data, error } = await resendInstance.emails.send({
      from: from || 'contact@dazno.de',
      to,
      subject,
      html: finalHtml,
    });
    if (error) {
      throw new Error('Échec de l\'envoi de l\'email');
    }
    return data;
  } catch (error) {
    throw new Error('Échec de l\'envoi de l\'email');
  }
} 