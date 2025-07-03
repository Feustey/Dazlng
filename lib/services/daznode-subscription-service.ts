import { DazNodeSubscription, DazNodeSubscriptionSchema } from '@/types/daznode';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { createLightningService } from '@/lib/services/lightning-service';
import { sendEmail } from '@/lib/services/email-service';

export class DazNodeSubscriptionService {
  private supabase = getSupabaseAdminClient();
  private lightning = createLightningService();

  // Prix en sats
  private readonly MONTHLY_PRICE = 50000;
  private readonly YEARLY_PRICE = 500000; // 10 mois

  async createSubscription(data: {
    email: string;
    pubkey: string;
    plan_type: 'monthly' | 'yearly';
    yearly_discount: boolean;
  }): Promise<{ payment_hash: string; subscription_id: string }> {
    try {
      // Validation des données
      const validated = DazNodeSubscriptionSchema.parse(data);

      // Calcul du montant
      const amount = validated.yearly_discount ? this.YEARLY_PRICE : this.MONTHLY_PRICE;

      // Création de la facture Lightning
      const invoice = await this.lightning.generateInvoice({
        amount,
        description: `DazNode ${validated.yearly_discount ? 'Annuel' : 'Mensuel'} - ${validated.email}`
      });

      // Création de l'abonnement en base
      const { data: subscription, error } = await this.supabase
        .from('daznode_subscriptions')
        .insert({
          email: validated.email,
          pubkey: validated.pubkey,
          plan_type: validated.plan_type,
          amount,
          payment_hash: invoice.paymentHash,
          payment_status: 'pending',
          recommendations_sent: false,
          admin_validated: false
        })
        .select()
        .single();

      if (error) throw error;

      // Envoi email admin
      await this.notifyAdmin({
        email: validated.email,
        pubkey: validated.pubkey,
        plan_type: validated.plan_type,
        subscription_id: subscription.id
      });

      return {
        payment_hash: invoice.paymentHash,
        subscription_id: subscription.id
      };
    } catch (error) {
      console.error('❌ Erreur création abonnement:', error);
      throw error;
    }
  }

  async confirmPayment(payment_hash: string): Promise<void> {
    try {
      // Vérification du paiement
      const status = await this.lightning.checkInvoiceStatus(payment_hash);
      const isPaid = status.status === 'settled';
      if (!isPaid) {
        throw new Error('Paiement non reçu');
      }

      // Mise à jour du statut
      const { data: subscription, error: fetchError } = await this.supabase
        .from('daznode_subscriptions')
        .select()
        .eq('payment_hash', payment_hash)
        .single();
      if (fetchError) throw fetchError;

      const { data: updatedSubscription, error } = await this.supabase
        .from('daznode_subscriptions')
        .update({
          payment_status: 'paid',
          start_date: new Date().toISOString(),
          end_date: this.calculateEndDate(subscription.plan_type)
        })
        .eq('payment_hash', payment_hash)
        .select()
        .single();

      if (error) throw error;

      // Envoi email confirmation client
      await this.sendConfirmationEmail(updatedSubscription);

    } catch (error) {
      console.error('❌ Erreur confirmation paiement:', error);
      throw error;
    }
  }

  private async notifyAdmin(data: {
    email: string;
    pubkey: string;
    plan_type: string;
    subscription_id: string;
  }) {
    await sendEmail({
      to: 'admin@dazno.de',
      subject: '🚀 Nouvelle souscription DazNode',
      html: `
        <h2>Nouvelle souscription DazNode</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Pubkey:</strong> ${data.pubkey}</p>
        <p><strong>Plan:</strong> ${data.plan_type}</p>
        <p><strong>ID:</strong> ${data.subscription_id}</p>
        <p>Veuillez valider les recommandations dans le dashboard admin.</p>
      `
    });
  }

  private async sendConfirmationEmail(subscription: DazNodeSubscription) {
    await sendEmail({
      to: subscription.email,
      cc: 'admin@dazno.de',
      subject: '✨ Bienvenue sur DazNode !',
      html: `
        <h2>Bienvenue sur DazNode !</h2>
        <p>Votre abonnement a été activé avec succès.</p>
        <p>Nos experts vont analyser votre nœud et vous envoyer des recommandations personnalisées très prochainement.</p>
        <p><strong>Plan:</strong> ${subscription.plan_type}</p>
        <p><strong>Nœud:</strong> ${subscription.pubkey}</p>
        <p>À très vite !</p>
      `
    });
  }

  private calculateEndDate(plan_type: 'monthly' | 'yearly'): string {
    const date = new Date();
    if (plan_type === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString();
  }

  async getActiveSubscription(pubkey: string): Promise<DazNodeSubscription | null> {
    const { data: subscription, error } = await this.supabase
      .from('daznode_subscriptions')
      .select()
      .eq('pubkey', pubkey)
      .eq('payment_status', 'paid')
      .gt('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Erreur récupération abonnement:', error);
      throw new Error('Erreur lors de la récupération de l\'abonnement');
    }

    return subscription;
  }

  async markRecommendationsSent(subscriptionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('daznode_subscriptions')
      .update({ recommendations_sent: true })
      .eq('id', subscriptionId);

    if (error) {
      console.error('❌ Erreur mise à jour recommendations_sent:', error);
      throw new Error('Erreur lors de la mise à jour du statut des recommandations');
    }
  }

  async validateSubscription(subscriptionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('daznode_subscriptions')
      .update({ admin_validated: true })
      .eq('id', subscriptionId);

    if (error) {
      console.error('❌ Erreur validation admin:', error);
      throw new Error('Erreur lors de la validation admin');
    }
  }
}

// Export une instance par défaut du service
export const dazNodeSubscriptionService = new DazNodeSubscriptionService(); 