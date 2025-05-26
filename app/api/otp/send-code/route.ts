import { sendEmail } from '@/utils/email';
import { OTPService } from '@/lib/services/OTPService';
import { RateLimitService } from '@/lib/services/RateLimitService';

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, name, pubkey, source } = await req.json();
    
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

    // Déterminer la source de la demande
    const requestSource = source || 'otp_login';
    const userAgent = req.headers.get('user-agent') || '';

    // Log des données reçues pour l'inscription
    console.log('[SEND-CODE] Données reçues:', { 
      email, 
      name: name || 'non fourni', 
      pubkey: pubkey ? `${pubkey.substring(0, 10)}...` : 'non fourni',
      source: requestSource
    });

    // Créer le code OTP avec tracking amélioré
    const otpService = new OTPService();
    const code = await otpService.createOTPAttempt(email, requestSource, userAgent);

    // Récupérer les stats de l'utilisateur pour personnaliser l'email
    const emailStats = await otpService.getEmailStats(email);
    const isReturningUser = emailStats && (emailStats.total_logins || 0) > 0;

    // En développement, simuler l'envoi d'email
    if (process.env.NODE_ENV === 'development') {
      console.log('[SEND-CODE] 🚀 EMAIL SIMULÉ - Code OTP:', code);
      console.log('[SEND-CODE] 📧 Destinataire:', email);
      console.log('[SEND-CODE] ⏰ Expire dans 15 minutes');
              console.log('[SEND-CODE] 👤 Utilisateur récurrent:', isReturningUser);
        if (emailStats) {
          console.log('[SEND-CODE] 📊 Stats:', {
            totalLogins: emailStats.total_logins || 0,
            conversionStatus: emailStats.conversion_status
          });
        }
    } else {
      // En production, envoyer l'email réel avec contenu personnalisé
      try {
        const welcomeMessage = isReturningUser 
          ? `Bon retour ! C'est votre ${(emailStats?.total_logins || 0) + 1}ème connexion.`
          : 'Bienvenue sur DAZ Node !';

        const encouragementMessage = emailStats && (emailStats.total_logins || 0) >= 2
          ? '<p style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;"><strong>💡 Astuce :</strong> Vous utilisez souvent DAZ Node ! Créez un compte complet pour sauvegarder vos données et accéder à plus de fonctionnalités.</p>'
          : '';

        await sendEmail({
          to: email,
          subject: isReturningUser ? 'Votre code de retour - DAZ Node' : 'Votre code de connexion - DAZ Node',
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
                .welcome { background: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>DAZ Node</h1>
              </div>
              <div class="content">
                <div class="welcome">
                  <h2>${welcomeMessage}</h2>
                </div>
                <p>Utilisez le code ci-dessous pour vous connecter à votre compte :</p>
                <div class="code">${code}</div>
                <p><strong>Ce code expire dans 15 minutes.</strong></p>
                ${encouragementMessage}
                <p>Si vous n'avez pas demandé ce code, ignorez cet email ou contactez notre support.</p>
              </div>
              <div class="footer">
                <p>© 2024 DAZ Node. Tous droits réservés.</p>
              </div>
            </body>
            </html>
          `
        });
        console.log('[SEND-CODE] Email personnalisé envoyé à', email);
      } catch (emailError) {
        console.error('[SEND-CODE] Erreur envoi email:', emailError);
        // En cas d'erreur email, on continue quand même (le code est créé)
        console.log('[SEND-CODE] 🚀 EMAIL FAILED - Code OTP (fallback):', code);
      }
    }
    
    console.log('[SEND-CODE] Email envoyé avec succès à', email);
    
    // Réponse avec informations de tracking (pour analytics côté client)
    return new Response(JSON.stringify({ 
      success: true,
      remaining: rateLimit.remaining,
      userInfo: {
        isReturningUser,
        totalLogins: emailStats?.total_logins || 0,
        conversionStatus: emailStats?.conversion_status || 'new'
      }
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