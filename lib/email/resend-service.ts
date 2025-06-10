import { Resend } from 'resend';
import { EmailCampaign, Customer, EmailSend } from '@/app/types/crm';
import { supabaseAdmin } from '@/lib/supabase-admin';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailMarketingService {
  
  /**
   * Envoie une campagne d'email à tous les destinataires
   */
  async sendCampaign(campaignId: string): Promise<{ success: number; failed: number; errors: any[] }> {
    try {
      // Récupère les détails de la campagne
      const { data: campaign, error } = await supabaseAdmin
        .from('crm_email_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error || !campaign) {
        throw new Error(`Campagne non trouvée: ${campaignId}`);
      }

      // Récupère tous les destinataires des segments
      const recipients = await this.getCampaignRecipients(campaign);

      if (recipients.length === 0) {
        throw new Error('Aucun destinataire trouvé pour cette campagne');
      }

      // Met à jour le statut de la campagne
      await supabaseAdmin
        .from('crm_email_campaigns')
        .update({ 
          status: 'sending',
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      // Envoie les emails par batch pour éviter de surcharger l'API
      const batchSize = 10;
      let success = 0;
      let failed = 0;
      const errors: any[] = [];

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const batchPromises = batch.map(recipient => 
          this.sendToCustomer(campaign, recipient)
        );

        const batchResults = await Promise.allSettled(batchPromises);
        
        for (const result of batchResults) {
          if (result.status === 'fulfilled') {
            success++;
          } else {
            failed++;
            errors.push(result.reason);
          }
        }

        // Pause entre les batches pour respecter les limites de rate
        if (i + batchSize < recipients.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Met à jour les statistiques de la campagne
      await supabaseAdmin
        .from('crm_email_campaigns')
        .update({ 
          status: 'sent',
          stats: {
            sent_count: success,
            failed_count: failed,
            total_recipients: recipients.length
          }
        })
        .eq('id', campaignId);

      return { success, failed, errors };

    } catch (error) {
      // Met à jour le statut en cas d'erreur
      await supabaseAdmin
        .from('crm_email_campaigns')
        .update({ status: 'cancelled' })
        .eq('id', campaignId);

      console.error('Erreur lors de l\'envoi de la campagne:', error);
      throw error;
    }
  }

  /**
   * Envoie un email à un client spécifique
   */
  async sendToCustomer(campaign: EmailCampaign, customer: Customer): Promise<string> {
    try {
      // Personnalise le contenu de l'email
      const personalizedContent = this.personalizeContent(campaign.content, customer);
      const personalizedSubject = this.personalizeContent(campaign.subject, customer);

      // Envoie l'email via Resend
      const result = await resend.emails.send({
        from: process.env.CRM_DEFAULT_FROM_EMAIL || 'DazNode <noreply@daznode.com>',
        to: customer.email,
        subject: personalizedSubject,
        html: personalizedContent,
        tags: [
          { name: 'campaign_id', value: campaign.id },
          { name: 'customer_id', value: customer.id },
          { name: 'type', value: 'campaign' }
        ]
      });

      // Enregistre l'envoi en base
      await this.recordEmailSend({
        campaign_id: campaign.id,
        customer_id: customer.id,
        email: customer.email,
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata: {
          resend_id: result.data?.id,
          personalized_subject: personalizedSubject
        }
      });

      return result.data?.id || 'unknown';

    } catch (error) {
      // Enregistre l'échec
      await this.recordEmailSend({
        campaign_id: campaign.id,
        customer_id: customer.id,
        email: customer.email,
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Erreur inconnue',
        metadata: { error: error }
      });

      throw error;
    }
  }

  /**
   * Personnalise le contenu d'un email avec les données du client
   */
  private personalizeContent(content: string, customer: Customer): string {
    let personalizedContent = content;

    // Variables de base
    const variables: Record<string, string> = {
      '{{prenom}}': customer.prenom || customer.nom || 'Client',
      '{{nom}}': customer.nom || '',
      '{{email}}': customer.email,
      '{{nom_complet}}': `${customer.prenom || ''} ${customer.nom || ''}`.trim() || customer.email,
      '{{t4g_tokens}}': customer.t4g_tokens?.toString() || '0',
      '{{date_inscription}}': customer.created_at ? new Date(customer.created_at).toLocaleDateString('fr-FR') : '',
      '{{statut_email}}': customer.email_verified ? 'Vérifié' : 'Non vérifié',
      '{{dashboard_url}}': `${process.env.NEXT_PUBLIC_APP_URL}/user/dashboard`,
      '{{unsubscribe_url}}': `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(customer.email)}`
    };

    // Variables Lightning Network
    if (customer.pubkey) {
      variables['{{pubkey}}'] = customer.pubkey;
      variables['{{pubkey_short}}'] = `${customer.pubkey.slice(0, 16)}...`;
    }

    if (customer.node_id) {
      variables['{{node_id}}'] = customer.node_id;
    }

    // Variables de comptes sociaux
    if (customer.compte_x) {
      variables['{{compte_x}}'] = customer.compte_x;
      variables['{{x_url}}'] = `https://x.com/${customer.compte_x}`;
    }

    if (customer.compte_nostr) {
      variables['{{compte_nostr}}'] = customer.compte_nostr;
    }

    // Remplace toutes les variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
      personalizedContent = personalizedContent.replace(regex, value || '');
    });

    return personalizedContent;
  }

  /**
   * Récupère tous les destinataires d'une campagne
   */
  private async getCampaignRecipients(campaign: EmailCampaign): Promise<Customer[]> {
    const recipients: Customer[] = [];

    // Pour chaque segment de la campagne
    for (const segmentId of campaign.segment_ids) {
      const { data: members, error } = await supabaseAdmin
        .from('crm_customer_segment_members')
        .select(`
          profiles!inner (
            id,
            email,
            nom,
            prenom,
            pubkey,
            compte_x,
            compte_nostr,
            t4g_tokens,
            node_id,
            email_verified,
            created_at
          )
        `)
        .eq('segment_id', segmentId);

      if (!error && members) {
        recipients.push(...members.map(m => m.profiles as any as Customer));
      }
    }

    // Supprime les doublons basés sur l'email
    const uniqueRecipients = recipients.reduce((acc: Customer[], current) => {
      const exists = acc.find(r => r.email === current.email);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueRecipients;
  }

  /**
   * Enregistre un envoi d'email en base de données
   */
  private async recordEmailSend(emailSend: Partial<EmailSend>): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('crm_email_sends')
        .insert(emailSend);

      if (error) {
        console.error('Erreur lors de l\'enregistrement de l\'envoi:', error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'envoi:', error);
    }
  }

  /**
   * Planifie une campagne pour envoi différé
   */
  async scheduleCampaign(campaignId: string, scheduledAt: Date): Promise<void> {
    await supabaseAdmin
      .from('crm_email_campaigns')
      .update({ 
        status: 'scheduled',
        scheduled_at: scheduledAt.toISOString()
      })
      .eq('id', campaignId);
  }

  /**
   * Envoie un email de test à une adresse spécifique
   */
  async sendTestEmail(campaignId: string, testEmail: string): Promise<void> {
    const { data: campaign, error } = await supabaseAdmin
      .from('crm_email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error || !campaign) {
      throw new Error(`Campagne non trouvée: ${campaignId}`);
    }

    // Crée un client fictif pour le test
    const testCustomer: Customer = {
      id: 'test',
      email: testEmail,
      nom: 'Test',
      prenom: 'Utilisateur',
      t4g_tokens: 1,
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      settings: {}
    };

    // Personnalise le contenu
    const personalizedContent = this.personalizeContent(campaign.content, testCustomer);
    const personalizedSubject = `[TEST] ${this.personalizeContent(campaign.subject, testCustomer)}`;

    await resend.emails.send({
      from: process.env.CRM_DEFAULT_FROM_EMAIL || 'DazNode <noreply@daznode.com>',
      to: testEmail,
      subject: personalizedSubject,
      html: personalizedContent,
      tags: [
        { name: 'campaign_id', value: campaign.id },
        { name: 'type', value: 'test' }
      ]
    });
  }

  /**
   * Traite les webhooks de Resend pour mettre à jour les statuts
   */
  async handleResendWebhook(event: any): Promise<void> {
    try {
      const { type, data } = event;
      const { email: _email, tags } = data;

      // Trouve l'envoi correspondant
      const campaignId = tags?.find((tag: any) => tag.name === 'campaign_id')?.value;
      const customerId = tags?.find((tag: any) => tag.name === 'customer_id')?.value;

      if (!campaignId || !customerId) {
        console.warn('Webhook sans tags campaign_id ou customer_id');
        return;
      }

      // Met à jour le statut selon le type d'événement
      const statusUpdates: Record<string, any> = {};

      switch (type) {
        case 'email.delivered':
          statusUpdates.status = 'delivered';
          break;
        case 'email.opened':
          statusUpdates.status = 'opened';
          statusUpdates.opened_at = new Date().toISOString();
          break;
        case 'email.clicked':
          statusUpdates.status = 'clicked';
          statusUpdates.clicked_at = new Date().toISOString();
          break;
        case 'email.bounced':
          statusUpdates.status = 'bounced';
          statusUpdates.bounced_at = new Date().toISOString();
          break;
        default:
          console.log(`Type d'événement non géré: ${type}`);
          return;
      }

      // Met à jour l'enregistrement
      await supabaseAdmin
        .from('crm_email_sends')
        .update(statusUpdates)
        .eq('campaign_id', campaignId)
        .eq('customer_id', customerId);

    } catch (error) {
      console.error('Erreur lors du traitement du webhook:', error);
    }
  }

  /**
   * Obtient les statistiques d'une campagne
   */
  async getCampaignStats(campaignId: string): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('crm_campaign_stats')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      throw error;
    }

    return data;
  }
} 