// Conditional import pour éviter les erreurs côté client
const ResendModule = typeof window === 'undefined' ? require('resend') : null;

// Lazy initialization pour éviter les erreurs côté client
let resend: any = null;

function getResendInstance(): any {
  // Vérifier si on est côté serveur
  if (typeof window !== 'undefined') {
    throw new Error('L\'envoi d\'email ne peut se faire que côté serveur');
  }

  if (!resend && ResendModule) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY non définie - utilisation du mode simulation');
      // Retourner un mock de Resend pour éviter les erreurs
      return {
        emails: {
          send: async () => ({ data: { id: 'mock-email-id' }, error: null })
        }
      };
    }
    resend = new ResendModule.Resend(apiKey);
  }
  return resend || {
    emails: {
      send: async () => ({ data: { id: 'mock-email-id' }, error: null })
    }
  };
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
  // Template spécialisé pour les codes de connexion
  if (title.toLowerCase().includes('code de connexion') || mainContent.toLowerCase().includes('code de connexion')) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DazNode - ${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      min-height: 100vh;
    }
    .container {
      max-width: 480px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .logo {
      max-width: 120px;
      height: auto;
      margin-bottom: 12px;
    }
    .header-title {
      color: #ffffff;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    .content {
      padding: 32px 24px;
      text-align: center;
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #1f2937;
    }
    .text {
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 24px;
    }
    .code-box {
      background: #f8fafc;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      font-family: 'Courier New', monospace;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #4f46e5;
    }
    .footer {
      padding: 24px;
      text-align: center;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://dazno.de/assets/images/logo-daznode.svg" alt="DazNode" class="logo" />
      <p class="header-title">DazNode</p>
    </div>
    <div class="content">
      <h1 class="title">${title}</h1>
      <p class="text">${mainContent}</p>
    </div>
    <div class="footer">
      <p class="footer-text">
        Ce code expire dans 10 minutes pour votre sécurité.<br>
        L'équipe DazNode
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  // Template général pour les autres emails
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DazNode - ${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f3f4f6;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      max-width: 150px;
      height: auto;
      margin-bottom: 16px;
    }
    .header-text {
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 20px;
      text-align: center;
    }
    .subtitle {
      font-size: 22px;
      font-weight: 600;
      color: #4f46e5;
      margin: 30px 0 15px 0;
    }
    .text {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 20px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff !important;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(79, 70, 229, 0.4);
    }
    .highlight-box {
      background: linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%);
      border-left: 4px solid #4f46e5;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    .footer {
      background-color: #1f2937;
      padding: 30px;
      text-align: center;
    }
    .footer-links {
      margin-bottom: 20px;
    }
    .footer-link {
      color: #9ca3af;
      text-decoration: none;
      margin: 0 15px;
      font-size: 14px;
    }
    .footer-link:hover {
      color: #d1d5db;
    }
    .copyright {
      color: #6b7280;
      font-size: 12px;
      margin: 0;
    }
    @media (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      .content {
        padding: 30px 20px;
      }
      .header {
        padding: 30px 20px;
      }
      .title {
        font-size: 24px;
      }
      .cta-button {
        display: block;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://dazno.de/assets/images/logo-daznode.svg" alt="DazNode" class="logo">
      <p class="header-text">DazNode</p>
    </div>
    <div class="content">
      <h1 class="title">${title}</h1>
      ${username ? `<p class="text">Cher(e) <strong>${username}</strong>,</p>` : ''}
      <p class="text">${mainContent}</p>
      ${subtitle ? `<h2 class="subtitle">${subtitle}</h2>` : ''}
      ${detailedContent ? `<div class="highlight-box"><p class="text" style="margin-bottom: 0;">${detailedContent}</p></div>` : ''}
      ${ctaText && ctaLink ? `<div style="text-align: center;"><a href="${ctaLink}" class="cta-button">${ctaText}</a></div>` : ''}
    </div>
    <div class="footer">
      <div class="footer-links">
        <a href="https://dazno.de/about" class="footer-link">À propos</a>
        <a href="https://dazno.de/contact" class="footer-link">Contact</a>
        <a href="https://dazno.de/terms" class="footer-link">Conditions</a>
        <a href="https://dazno.de/user/settings" class="footer-link">Préférences</a>
      </div>
      <p class="copyright">© 2025 DazNode - Votre passerelle vers le Lightning Network</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<{ id: string } | null> {
  // Vérifier si on est côté serveur
  if (typeof window !== 'undefined') {
    throw new Error('L\'envoi d\'email ne peut se faire que côté serveur');
  }

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
      console.error('Erreur Resend:', error);
      throw new Error('Échec de l\'envoi de l\'email: ' + JSON.stringify(error));
    }
    
    console.log('Email envoyé avec succès:', { to, subject });
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi d\'email:', error);
    throw new Error('Échec de l\'envoi de l\'email: ' + (error instanceof Error ? error.message : String(error)));
  }
} 