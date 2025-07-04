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
          <h2 style="color: #2563eb;">{t('daznode-email-service._confirmation_de_souscription_')}</h2>
          
          <p>Bonjour ${subscription.customerName},</p>
          
          <p>{t('daznode-email-service.votre_souscription_daznode_a_t')}</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">{t('daznode-email-service.dtails_de_votre_souscription_')}</h3>
            <ul>
              <li><strong>{t('daznode-email-service.plan_')}</strong> ${subscription.plan}</li>
              <li><strong>{t('daznode-email-service.cycle_de_facturation_')}</strong> ${subscription.billingCycle}</li>
              <li><strong>{t('daznode-email-service.montant_')}</strong> ${subscription.amount} sats</li>
              <li><strong>{t('daznode-email-service.statut_')}</strong>{t('daznode-email-service._actif')}</li>
            </ul>
          </div>
          
          <p>{t('daznode-email-service.vous_pouvez_maintenant_accder_')}</p>
          
          <p>{t('daznode-email-service.merci_de_votre_confiance_')}</p>
          
          <p>{t('daznode-email-service.lquipe_daznode')}</p>
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
          <h2 style="color: #2563eb;">{t('daznode-email-service._rappel_de_souscription_daznod')}</h2>
          
          <p>Bonjour ${subscription.customerName},</p>
          
          <p>{t('daznode-email-service.ceci_est_un_rappel_concernant_')}</p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">{t('daznode-email-service.votre_souscription_')}</h3>
            <ul>
              <li><strong>{t('daznode-email-service.plan_')}</strong> ${subscription.plan}</li>
              <li><strong>{t('daznode-email-service.cycle_')}</strong> ${subscription.billingCycle}</li>
              <li><strong>{t('daznode-email-service.montant_')}</strong> ${subscription.amount} sats</li>
            </ul>
          </div>
          
          <p>{t('daznode-email-service.votre_souscription_est_actuell')}</p>
          
          <p>{t('daznode-email-service.lquipe_daznode')}</p>
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