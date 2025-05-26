import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/utils/email';

interface ConversionEmailData {
  email: string;
  name?: string;
  loginCount: number;
  daysSinceFirstLogin: number;
  conversionStatus: string;
}

export class EmailConversionService {
  /**
   * Envoie un email de bienvenue personnalisé selon le profil utilisateur
   */
  async sendWelcomeEmail(emailData: ConversionEmailData): Promise<boolean> {
    try {
      const { email, name, loginCount, conversionStatus } = emailData;
      
      // Template selon le statut de conversion
      let subject: string;
      let htmlContent: string;

      if (conversionStatus === 'new') {
        subject = 'Bienvenue sur DAZ Node !';
        htmlContent = this.getNewUserTemplate(email, name);
      } else if (conversionStatus === 'conversion_candidate') {
        subject = 'Créez votre compte permanent DAZ Node';
        htmlContent = this.getConversionTemplate(email, name, loginCount);
      } else {
        subject = 'Bon retour sur DAZ Node !';
        htmlContent = this.getReturningUserTemplate(email, name, loginCount);
      }

      await sendEmail({
        to: email,
        subject,
        html: htmlContent
      });

      console.log('[EMAIL-CONVERSION] Email envoyé:', { email, conversionStatus });
      return true;

    } catch (error) {
      console.error('[EMAIL-CONVERSION] Erreur envoi email:', error);
      return false;
    }
  }

  /**
   * Envoie un email de proposition de conversion après 3+ connexions
   */
  async sendConversionProposal(email: string, name?: string, loginCount: number = 0): Promise<boolean> {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .cta-button { background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .benefits { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://nextjs-boilerplate-1l6z3th4v-feusteys-projects.vercel.app/assets/images/logo-daznode-white.svg" alt="DAZ Node" height="40" style="margin-bottom: 10px;" />
            <h1 style="margin: 0; font-size: 24px;">DAZ Node</h1>
          </div>
          <div class="content">
            <h2>🎉 Félicitations ${name || 'utilisateur'} !</h2>
            <p>Vous avez utilisé DAZ Node <strong>${loginCount} fois</strong> - nous voyons que vous appréciez nos services !</p>
            
            <div class="benefits">
              <h3>✨ Créez votre compte permanent et profitez de :</h3>
              <ul>
                <li>🔒 <strong>Sauvegarde sécurisée</strong> de vos données et configurations</li>
                <li>⚡ <strong>Synchronisation</strong> entre tous vos appareils</li>
                <li>📊 <strong>Analytics avancés</strong> de vos nodes</li>
                <li>🔔 <strong>Notifications</strong> en temps réel</li>
                <li>🎯 <strong>Support prioritaire</strong></li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/register?from=conversion&email=${encodeURIComponent(email)}" class="cta-button">
                Créer mon compte permanent
              </a>
            </div>

            <p><small>Cette proposition est basée sur votre utilisation régulière de DAZ Node. Vous pouvez continuer à utiliser le service avec des codes OTP si vous préférez.</small></p>
          </div>
          <div class="footer">
            <p>© 2024 DAZ Node. Tous droits réservés.</p>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: email,
        subject: '🚀 Transformez votre expérience DAZ Node',
        html: htmlContent
      });

      // Marquer dans le tracking que la proposition a été envoyée
      await supabase
        .from('user_email_tracking')
        .update({
          conversion_status: 'proposal_sent',
          notes: `Proposition de conversion envoyée après ${loginCount} connexions`,
          last_seen_at: new Date().toISOString()
        })
        .eq('email', email);

      console.log('[EMAIL-CONVERSION] Proposition de conversion envoyée:', { email, loginCount });
      return true;

    } catch (error) {
      console.error('[EMAIL-CONVERSION] Erreur envoi proposition:', error);
      return false;
    }
  }

  /**
   * Template pour nouveaux utilisateurs
   */
  private getNewUserTemplate(email: string, name?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .welcome { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .quick-start { background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://nextjs-boilerplate-1l6z3th4v-feusteys-projects.vercel.app/assets/images/logo-daznode-white.svg" alt="DAZ Node" height="40" style="margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 24px;">DAZ Node</h1>
        </div>
        <div class="content">
          <div class="welcome">
            <h2>🎉 Bienvenue ${name || 'sur DAZ Node'} !</h2>
            <p>Nous sommes ravis de vous accueillir dans l'écosystème DAZ Node.</p>
          </div>

          <div class="quick-start">
            <h3>🚀 Pour commencer :</h3>
            <ol>
              <li>Explorez nos produits : DazBox, DazNode et DazPay</li>
              <li>Connectez votre node Lightning si vous en avez un</li>
              <li>Découvrez les analytics en temps réel</li>
            </ol>
          </div>

          <p>💡 <strong>Astuce :</strong> Si vous utilisez régulièrement DAZ Node, nous vous proposerons bientôt de créer un compte permanent pour sauvegarder vos données.</p>
          
          <p>Des questions ? Notre équipe est là pour vous aider !</p>
        </div>
        <div class="footer">
          <p>© 2024 DAZ Node. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template pour utilisateurs candidats à la conversion
   */
  private getConversionTemplate(email: string, name?: string, loginCount: number = 0): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .cta-button { background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .stats { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://nextjs-boilerplate-1l6z3th4v-feusteys-projects.vercel.app/assets/images/logo-daznode-white.svg" alt="DAZ Node" height="40" style="margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 24px;">DAZ Node</h1>
        </div>
        <div class="content">
          <h2>🌟 ${name || 'Utilisateur'}, votre engagement nous impressionne !</h2>
          
          <div class="stats">
            <p><strong>📈 Vos statistiques :</strong></p>
            <p>✅ ${loginCount} connexions réussies<br>
            ✅ Utilisateur actif et engagé<br>
            ✅ Prêt pour les fonctionnalités avancées</p>
          </div>

          <p>Il est temps de passer au niveau supérieur avec un compte permanent !</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/register?conversion=true&email=${encodeURIComponent(email)}" class="cta-button">
              Créer mon compte DAZ Node
            </a>
          </div>
        </div>
        <div class="footer">
          <p>© 2024 DAZ Node. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template pour utilisateurs récurrents
   */
  private getReturningUserTemplate(email: string, name?: string, loginCount: number = 0): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .welcome-back { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://nextjs-boilerplate-1l6z3th4v-feusteys-projects.vercel.app/assets/images/logo-daznode-white.svg" alt="DAZ Node" height="40" style="margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 24px;">DAZ Node</h1>
        </div>
        <div class="content">
          <div class="welcome-back">
            <h2>👋 Bon retour ${name || 'sur DAZ Node'} !</h2>
            <p>C'est votre <strong>${loginCount}ème connexion</strong> - merci pour votre fidélité !</p>
          </div>

          <p>Vos données temporaires sont prêtes. Vous pouvez reprendre là où vous vous étiez arrêté.</p>
          
          <p>🔍 <strong>Nouveautés :</strong> Découvrez nos dernières améliorations dans l'interface utilisateur.</p>
        </div>
        <div class="footer">
          <p>© 2024 DAZ Node. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Envoie un email de suivi après conversion
   */
  async sendConversionSuccessEmail(email: string, name?: string): Promise<boolean> {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .success { background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; color: #155724; }
            .next-steps { background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://nextjs-boilerplate-1l6z3th4v-feusteys-projects.vercel.app/assets/images/logo-daznode-white.svg" alt="DAZ Node" height="40" style="margin-bottom: 10px;" />
            <h1 style="margin: 0; font-size: 24px;">DAZ Node</h1>
          </div>
          <div class="content">
            <div class="success">
              <h2>🎉 Félicitations ${name || 'utilisateur'} !</h2>
              <p>Votre compte permanent DAZ Node a été créé avec succès.</p>
            </div>

            <div class="next-steps">
              <h3>🚀 Prochaines étapes :</h3>
              <ul>
                <li>Configurez votre profil complet</li>
                <li>Activez les notifications</li>
                <li>Explorez toutes les fonctionnalités premium</li>
                <li>Rejoignez notre communauté</li>
              </ul>
            </div>

            <p>Merci de faire confiance à DAZ Node. Nous sommes impatients de vous accompagner dans votre parcours Lightning Network !</p>
          </div>
          <div class="footer">
            <p>© 2024 DAZ Node. Tous droits réservés.</p>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: email,
        subject: '🎉 Bienvenue dans DAZ Node Premium !',
        html: htmlContent
      });

      console.log('[EMAIL-CONVERSION] Email de succès de conversion envoyé:', email);
      return true;

    } catch (error) {
      console.error('[EMAIL-CONVERSION] Erreur email succès conversion:', error);
      return false;
    }
  }
} 