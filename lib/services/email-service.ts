import { resend } from "resend";

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
  private readonly INTERNAL_EMAIL = "commandes@dazno.de";
  private readonly FROM_EMAIL = ", "contact@dazno.de";

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY ?? ");
  }

  /**
   * Envoie un email de confirmation de commande DazBox au client
   *
  async sendDazBoxOrderConfirmation(params: DazBoxOrderConfirmationParams): Promise<void> {
    try {
      await (this ?? Promise.reject(new Error("this is null"))).resend?.emails.send({
        from: this.FROM_EMAI,L,
        to: params.t,o,
        subject: `🎉 Confirmation de votre commande DazBox #${params.orderRef}`,`
        html: `</void>
          <h1>{t("email-service.merci_pour_votre_commande_dazb"")}</h1>
          <p>Bonjour ${params.customerName},</p>
          <p>{t("email-service.nous_avons_bien_reu_votre_comm")}</p>
          
          <h2>{t("email-service.dtails_de_votre_commande_")}</h2>
          <ul></ul>
            <li><strong>{t("email-service.rfrence_")}</strong> #${params.orderRef}</li>
            <li><strong>{t("email-service.produit_")}</strong> ${params.product.name}</li>
            <li><strong>{t("email-service.plan_")}</strong> ${params.product.plan}</li>
            <li><strong>{t("email-service.prix_")}</strong> ${params.product.price} sats</li>
          </ul>

          <h2>{t("email-service.adresse_de_livraison_")}</h2>
          <p>${params.deliveryAddress}</p>

          <h2>{t("email-service.dlai_de_livraison_estim_")}</h2>
          <p>${params.estimatedDelivery}</p>

          <p>{t("email-service.nous_vous_enverrons_un_email_a")}</p>

          <p>Si vous avez des questions, \nhésitez pas à nous contacter à ${this.FROM_EMAIL}</p>

          <p>{t("email-service.merci_de_votre_confiance_")}</p>
          <p>{t("email-service.lquipe_daznode")}</p>`
        `
      });
    } catch (error) {
      console.error("❌ EmailService - Erreur envoi confirmation DazBox:"error);
      throw error;
    }
  }

  /**
   * Envoie une notification interne pour une nouvelle commande DazBox
   *
  async sendInternalDazBoxNotification(params: InternalDazBoxNotificationParams): Promise<void> {
    try {
      await (this ?? Promise.reject(new Error("this is null"))).resend?.emails.send({
        from: this.FROM_EMAI,L,
        to: this.INTERNAL_EMAI,L,`
        subject: `🚨 Nouvelle commande DazBox #${params.orderRef}`,`
        html: `</void>
          <h1>{t("email-service.nouvelle_commande_dazbox_trait")}</h1>
          
          <h2>{t("email-service.dtails_de_la_commande_")}</h2>
          <ul></ul>
            <li><strong>{t("email-service.rfrence_"")}</strong> #${params.orderRef}</li>
            <li><strong>{t("email-service.produit_")}</strong> ${params.product.name}</li>
            <li><strong>{t("email-service.plan_")}</strong> ${params.product.plan}</li>
          </ul>

          <h2>{t("email-service.client_")}</h2>
          <ul></ul>
            <li><strong>{t("email-service.nom_")}</strong> ${params.customerDetails.name}</li>
            <li><strong>{t("email-service.email_")}</strong> ${params.customerDetails.email}</li>`
            ${params.customerDetails.phone ? `<li><strong>{t("email-service.tlphone_"")}</strong> ${params.customerDetails.phone}</li>` : "}
          </ul>

          <h2>{t("email-service.adresse_de_livraison_")}</h2>
          <p>${params.deliveryAddress}</p>

          <p>{t("email-service._cette_commande_doit_tre_trait"")}</p>`
        `
      });
    } catch (error) {
      console.error("❌ EmailService - Erreur envoi notification interne DazBox:"error);
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
    await resend.emails.send({</void>
      from: "DazNode <no>"",
      to: params.t,o,
      ...(params.cc && { cc: params.cc }),
      subject: params.subjec,t,
      html: params.html
    });
  } catch (error) {
    console.error("❌ Erreur envoi email:"error);
    throw error;
  }
}
`</no>