import { sendEmail } from '@/lib/services/email-service';
import { logger } from '@/lib/logger';

export interface Subscription {
  id: string;
  pubkey: string;
  plan: string;
  billingCycle: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  status: string;
  createdAt: string;
}

export class DazNodeEmailService {
  async sendSubscriptionConfirmation(subscription: Subscription): Promise<void> {
    try {
      logger.info('📧 Envoi email confirmation souscription', { 
        subscriptionId: subscription.id, 
        email: subscription.customerEmail 
      });

      const subject = `Confirmation de votre souscription DazNode ${subscription.plan}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🎉 Confirmation de souscription DazNode</h2>
          
          <p>Bonjour ${subscription.customerName},</p>
          
          <p>Votre souscription DazNode a été confirmée avec succès !</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Détails de votre souscription :</h3>
            <ul>
              <li><strong>Plan :</strong> ${subscription.plan}</li>
              <li><strong>Cycle de facturation :</strong> ${subscription.billingCycle}</li>
              <li><strong>Montant :</strong> ${subscription.amount} sats</li>
              <li><strong>Statut :</strong> Actif</li>
            </ul>
          </div>
          
          <p>Vous pouvez maintenant accéder à toutes les fonctionnalités de votre plan DazNode.</p>
          
          <p>Merci de votre confiance !</p>
          
          <p>L'équipe DazNode</p>
        </div>
      `;

      await sendEmail({
        to: subscription.customerEmail,
        subject,
        html: htmlContent
      });

      logger.info('✅ Email confirmation envoyé avec succès', { 
        subscriptionId: subscription.id 
      });

    } catch (error) {
      logger.error('❌ Erreur envoi email confirmation:', error);
      throw error;
    }
  }

  async sendSubscriptionReminder(subscription: Subscription): Promise<void> {
    try {
      logger.info('📧 Envoi rappel souscription', { 
        subscriptionId: subscription.id, 
        email: subscription.customerEmail 
      });

      const subject = `Rappel - Votre souscription DazNode ${subscription.plan}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">⏰ Rappel de souscription DazNode</h2>
          
          <p>Bonjour ${subscription.customerName},</p>
          
          <p>Ceci est un rappel concernant votre souscription DazNode.</p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Votre souscription :</h3>
            <ul>
              <li><strong>Plan :</strong> ${subscription.plan}</li>
              <li><strong>Cycle :</strong> ${subscription.billingCycle}</li>
              <li><strong>Montant :</strong> ${subscription.amount} sats</li>
            </ul>
          </div>
          
          <p>Votre souscription est actuellement active. Merci de votre confiance !</p>
          
          <p>L'équipe DazNode</p>
        </div>
      `;

      await sendEmail({
        to: subscription.customerEmail,
        subject,
        html: htmlContent
      });

      logger.info('✅ Email rappel envoyé avec succès', { 
        subscriptionId: subscription.id 
      });

    } catch (error) {
      logger.error('❌ Erreur envoi email rappel:', error);
      throw error;
    }
  }
} 