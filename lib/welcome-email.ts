import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export interface WelcomeEmailData {
  email: string;
  nom?: string;
  prenom?: string;
}

export async function sendWelcomeEmail({ email, nom, prenom }: WelcomeEmailData): Promise<boolean> {
  try {
    const firstName = prenom || nom || 'Bienvenue';
    const settingsUrl = `${(process.env.NEXTAUTH_URL ?? "") || 'https://dazno.de'}/user/settings`;
    
    const emailContent = {
      from: 'DazNode <noreply@dazno.de>',
      to: email,
      subject: '🚀 Bienvenue sur DazNode ! Configurez votre nœud Lightning',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{t('welcome-email.bienvenue_sur_daznode')}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">{t('welcome-email._bienvenue_sur_daznode_')}</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">{t('welcome-email.votre_aventure_lightning_netwo')}</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2d3748; margin-top: 0;">Salut ${firstName} ! 👋</h2>
            
            <p>{t('welcome-email.flicitations_vous_venez_de_rej')}</p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4299e1;">
              <h3 style="color: #2b6cb0; margin-top: 0;">{t('welcome-email._prochaines_tapes_importantes_')}</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>{t('welcome-email.configurez_votre_nud_lightning')}</strong>{t('welcome-email._en_ajoutant_votre_cl_publique')}</li>
                <li><strong>{t('welcome-email.compltez_votre_profil')}</strong>{t('welcome-email._pour_dbloquer_toutes_les_fonc')}</li>
                <li><strong>{t('welcome-email.explorez_les_outils_doptimisat')}</strong>{t('welcome-email._automatique')}</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${settingsUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                ⚙️ Configurer mon compte
              </a>
            </div>
            
            <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f56565;">
              <h3 style="color: #c53030; margin-top: 0;">{t('welcome-email._vous_navez_pas_encore_de_nud_')}</h3>
              <p style="margin-bottom: 15px;">Pas de problème ! Découvrez notre <strong>DazBox</strong> - un nœud Lightning prêt à l'emploi, livré configuré et optimisé.</p>
              <a href="${(process.env.NEXTAUTH_URL ?? "") || 'https://dazno.de'}/checkout/dazbox" style="color: #c53030; font-weight: bold; text-decoration: none;">
                📦 Découvrir la DazBox →
              </a>
            </div>
            
            <hr style="border: none; height: 1px; background: #e2e8f0; margin: 30px 0;">
            
            <div style="text-align: center;">
              <h3 style="color: #2d3748;">{t('welcome-email._profitez_de_votre_essai_gratu')}</h3>
              <p>{t('welcome-email.explorez_toutes_les_fonctionna')}</p>
              <ul style="text-align: left; display: inline-block; margin: 0; padding-left: 20px;">
                <li>{t('welcome-email.surveillance_automatique_247')}</li>
                <li>{t('welcome-email.optimisation_ia_des_canaux')}</li>
                <li>{t('welcome-email.alertes_en_temps_rel')}</li>
                <li>{t('welcome-email.rapports_dtaills')}</li>
              </ul>
            </div>
            
            <div style="background: #f0fff4; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #2f855a;"><strong>{t('welcome-email._besoin_daide_')}</strong></p>
              <p style="margin: 10px 0 0 0; color: #68d391;">{t('welcome-email.notre_quipe_est_disponible_247')}</p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                L'équipe DazNode<br>
                <a href="https://dazno.de" style="color: #4299e1; text-decoration: none;">{t('welcome-email.daznode')}</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Bienvenue sur DazNode !
        
        Salut ${firstName} !
        
        Félicitations ! Vous venez de rejoindre la communauté DazNode.
        
        Prochaines étapes :
        1. Configurez votre nœud Lightning en ajoutant votre clé publique
        2. Complétez votre profil pour débloquer toutes les fonctionnalités
        3. Explorez les outils d'optimisation automatique
        
        Configurez votre compte : ${settingsUrl}
        
        Vous n'avez pas encore de nœud Lightning ?
        Découvrez notre DazBox : ${(process.env.NEXTAUTH_URL ?? "") || 'https://dazno.de'}/checkout/dazbox
        
        Profitez de votre essai gratuit de 7 jours !
        
        L'équipe DazNode
        dazno.de
      `
    };

    const result = await resend.emails.send(emailContent);
    
    if (result.error) {
      console.error('Erreur envoi email de bienvenue:', result.error);
      return false;
    }
    
    console.log('Email de bienvenue envoyé avec succès:', result.data?.id);
    return true;
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    return false;
  }
}
