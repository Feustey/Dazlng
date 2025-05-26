import { sendEmail } from '@/utils/email';
import { OTPService } from '@/lib/services/OTPService';
import { RateLimitService } from '@/lib/services/RateLimitService';

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, name, pubkey } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email requis' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier le rate limiting
    const rateLimitService = new RateLimitService();
    const rateLimit = await rateLimitService.checkRateLimit(`send-code:${email}`, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000 // 15 minutes
    });

    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Trop de tentatives. Veuillez réessayer plus tard.',
        resetTime: rateLimit.resetTime.toISOString()
      }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log des données reçues pour l'inscription
    console.log('[SEND-CODE] Données reçues:', { 
      email, 
      name: name || 'non fourni', 
      pubkey: pubkey ? `${pubkey.substring(0, 10)}...` : 'non fourni' 
    });

    // Créer le code OTP
    const otpService = new OTPService();
    const code = await otpService.createOTPAttempt(email);

    // Envoyer l'email avec un template plus professionnel
    await sendEmail({
      to: email,
      subject: 'Votre code de connexion - DAZ Node',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .code { font-size: 32px; font-weight: bold; background: #fff; padding: 15px; text-align: center; margin: 20px 0; border: 2px solid #e0e0e0; border-radius: 8px; letter-spacing: 4px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://nextjs-boilerplate-1l6z3th4v-feusteys-projects.vercel.app/assets/images/logo-daznode-white.svg" alt="DAZ Node" height="40" style="margin-bottom: 10px;" />
            <h1 style="margin: 0; font-size: 24px;">DAZ Node</h1>
          </div>
          <div class="content">
            <h2>Votre code de connexion</h2>
            <p>Utilisez le code ci-dessous pour vous connecter à votre compte :</p>
            <div class="code">${code}</div>
            <p><strong>Ce code expire dans 15 minutes.</strong></p>
            <p>Si vous n'avez pas demandé ce code, ignorez cet email ou contactez notre support.</p>
          </div>
          <div class="footer">
            <p>© 2024 DAZ Node. Tous droits réservés.</p>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('[SEND-CODE] Email envoyé avec succès à', email);
    return new Response(JSON.stringify({ 
      success: true,
      remaining: rateLimit.remaining 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[SEND-CODE] Erreur:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de l\'envoi du code' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 