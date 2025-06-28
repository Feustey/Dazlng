import { Resend } from 'resend';

export interface DazBoxOrderConfirmationParams {
  to: string;
  orderRef: string;
  customerName: string;
  deliveryAddress: string;
  product: {
    name: string;
    price: number;
    plan: string;
  };
  estimatedDelivery: string;
}

export interface InternalDazBoxNotificationParams {
  orderRef: string;
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
  };
  deliveryAddress: string;
  product: {
    name: string;
    plan: string;
  };
}

export class EmailService {
  private resend: Resend | null = null;
  private readonly INTERNAL_EMAIL = 'commandes@daznode.com';
  private readonly FROM_EMAIL = 'contact@daznode.com';

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY ?? "");
  }

  /**
   * Envoie un email de confirmation de commande DazBox au client
   */
  async sendDazBoxOrderConfirmation(params: DazBoxOrderConfirmationParams): Promise<void> {
    try {
      await (this ?? Promise.reject(new Error("this is null"))).resend?.emails.send({
        from: this.FROM_EMAIL,
        to: params.to,
        subject: `🎉 Confirmation de votre commande DazBox #${params.orderRef}`,
        html: `
          <h1>Merci pour votre commande DazBox !</h1>
          <p>Bonjour ${params.customerName},</p>
          <p>Nous avons bien reçu votre commande et votre paiement a été confirmé.</p>
          
          <h2>Détails de votre commande :</h2>
          <ul>
            <li><strong>Référence :</strong> #${params.orderRef}</li>
            <li><strong>Produit :</strong> ${params.product.name}</li>
            <li><strong>Plan :</strong> ${params.product.plan}</li>
            <li><strong>Prix :</strong> ${params.product.price} sats</li>
          </ul>

          <h2>Adresse de livraison :</h2>
          <p>${params.deliveryAddress}</p>

          <h2>Délai de livraison estimé :</h2>
          <p>${params.estimatedDelivery}</p>

          <p>Nous vous enverrons un email avec le numéro de suivi dès que votre colis sera expédié.</p>

          <p>Si vous avez des questions, n'hésitez pas à nous contacter à ${this.FROM_EMAIL}</p>

          <p>Merci de votre confiance !</p>
          <p>L'équipe DazNode</p>
        `
      });
    } catch (error) {
      console.error('❌ EmailService - Erreur envoi confirmation DazBox:', error);
      throw error;
    }
  }

  /**
   * Envoie une notification interne pour une nouvelle commande DazBox
   */
  async sendInternalDazBoxNotification(params: InternalDazBoxNotificationParams): Promise<void> {
    try {
      await (this ?? Promise.reject(new Error("this is null"))).resend?.emails.send({
        from: this.FROM_EMAIL,
        to: this.INTERNAL_EMAIL,
        subject: `🚨 Nouvelle commande DazBox #${params.orderRef}`,
        html: `
          <h1>Nouvelle commande DazBox à traiter</h1>
          
          <h2>Détails de la commande :</h2>
          <ul>
            <li><strong>Référence :</strong> #${params.orderRef}</li>
            <li><strong>Produit :</strong> ${params.product.name}</li>
            <li><strong>Plan :</strong> ${params.product.plan}</li>
          </ul>

          <h2>Client :</h2>
          <ul>
            <li><strong>Nom :</strong> ${params.customerDetails.name}</li>
            <li><strong>Email :</strong> ${params.customerDetails.email}</li>
            ${params.customerDetails.phone ? `<li><strong>Téléphone :</strong> ${params.customerDetails.phone}</li>` : ''}
          </ul>

          <h2>Adresse de livraison :</h2>
          <p>${params.deliveryAddress}</p>

          <p>⚡ Cette commande doit être traitée dans les 24h.</p>
        `
      });
    } catch (error) {
      console.error('❌ EmailService - Erreur envoi notification interne DazBox:', error);
      throw error;
    }
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  cc?: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  try {
    await resend.emails.send({
      from: 'DazNode <no-reply@dazno.de>',
      to: params.to,
      ...(params.cc && { cc: params.cc }),
      subject: params.subject,
      html: params.html
    });
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
}
