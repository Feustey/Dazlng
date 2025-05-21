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
      <img src=\"https://dazno.de/assets/images/logo-daznode-white.svg\" alt=\"Daznode Logo\" class=\"logo\">
    </div>
    <div class=\"content\">
      <h1 class=\"title\">${title}</h1>
      <p class=\"text\">${username ? `Cher(e) ${username},` : ''}</p>
      <p class=\"text\">${mainContent}</p>
      <div class=\"reassurance\">
        <h3 class=\"reassurance-title\">Pourquoi nous faire confiance?</h3>
        <p class=\"reassurance-text\">Daznode est l'expert français en solutions Lightning Network pour particuliers et entreprises. Notre plateforme sécurisée garantit une expérience utilisateur optimale, soutenue par une équipe dédiée disponible 7j/7.</p>
      </div>
      ${subtitle ? `<h2 class=\"subtitle\">${subtitle}</h2>` : ''}
      ${detailedContent ? `<p class=\"text\">${detailedContent}</p>` : ''}
      ${ctaText && ctaLink ? `<a href=\"${ctaLink}\" class=\"cta-button\">${ctaText}</a>` : ''}
      <div class=\"token-section\">
        <h3 class=\"token-title\">Découvrez Token For Good</h3>
        <p>La blockchain au service de l'impact social et environnemental positif. Rejoignez notre communauté engagée et contribuez à des causes qui comptent.</p>
        <a href=\"https://dazno.de/token-for-good\" style=\"color: #FFFFFF; text-decoration: underline; font-weight: 600;\">En savoir plus →</a>
      </div>
      <div class=\"dazdocs-section\">
        <h3 class=\"dazdocs-title\">Consultez DazDocs</h3>
        <p>Votre base documentaire complète pour tout comprendre sur l'écosystème Daz. Guides, tutoriels et ressources à votre disposition.</p>
        <a href=\"https://docs.dazno.de\" style=\"color: #181825; text-decoration: underline; font-weight: 600;\">Accéder à DazDocs →</a>
      </div>
    </div>
    <div class=\"footer\">
      <div class=\"social-links\">
        <a href=\"nostr:d2d8186182cce5d40e26e7db23ea38d3bf4e10dd98642cc4f5b1fb38efaf438e\" class=\"social-icon\"><img src=\"https://dazno.de/assets/images/social/nostr.svg\" alt=\"Nostr\" width=\"20\" height=\"20\"></a>
        <a href=\"https://t.me/daznode_bot\" class=\"social-icon\"><img src=\"https://dazno.de/assets/images/social/telegram.svg\" alt=\"Telegram\" width=\"20\" height=\"20\"></a>
        <a href=\"https://linkedin.com/company/daznode\" class=\"social-icon\"><img src=\"https://dazno.de/assets/images/social/linkedin.svg\" alt=\"LinkedIn\" width=\"20\" height=\"20\"></a>
      </div>
      <div class=\"footer-links\">
        <a href=\"https://dazno.de/about\" class=\"footer-link\">À propos</a>
        <a href=\"https://dazno.de/contact\" class=\"footer-link\">Contact</a>
        <a href=\"https://dazno.de/terms\" class=\"footer-link\">Conditions</a>
        <a href=\"https://dazno.de/unsubscribe\" class=\"footer-link\">Désabonnement</a>
      </div>
      <p class=\"copyright\">© 2025 Dazno.de - Tous droits réservés | Réalisé avec 💙 par <a href=\"https://inoval.io\" style=\"color: #A1A1AA;\">Inoval</a></p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendEmail({ to, subject, html, from = 'contact@daznode.com' }: SendEmailParams) {
  let finalHtml = html;
  if (!html?.includes('<!DOCTYPE html>')) {
    finalHtml = generateEmailTemplate({
      title: subject,
      mainContent: html
    });
  }
  try {
    const { data, error } = await resend.emails.send({
      from,
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