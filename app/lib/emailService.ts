import { Resend } from "resend";
import { EmailTemplate } from "../components/email-template";
import WelcomeEmailTemplate from "../components/emails/WelcomeEmailTemplate";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("La variable d'environnement RESEND_API_KEY est requise");
}

export class EmailService {
  private static instance: EmailService;
  private resend: Resend;
  private readonly fromEmail = "Daznode <contact@dazno.de>";

  private constructor() {
    this.resend = new Resend(RESEND_API_KEY);
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail({
    to,
    firstName,
    subject,
    message,
  }: {
    to: string;
    firstName: string;
    subject: string;
    message: string;
  }) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: subject,
        react: EmailTemplate({ firstName, message, subject }),
      });

      if (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string) {
    try {
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
      const { data, error } = await this.resend.emails.send({
        from: "DazNode <bienvenue@daznode.com>",
        to: [to],
        subject: "Bienvenue sur DazNode !",
        react: WelcomeEmailTemplate({
          firstName,
          dashboardUrl,
        }),
      });

      if (error) {
        console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
      throw error;
    }
  }

  async sendOptimizationReport(
    to: string,
    firstName: string,
    report: {
      currentScore: number;
      potentialScore: number;
      recommendations: string[];
    }
  ) {
    const recommendationsList = report.recommendations
      .map((rec) => `• ${rec}`)
      .join("\n");

    return this.sendEmail({
      to,
      firstName,
      subject: "Rapport d'optimisation de votre nœud",
      message: `Voici le rapport d'optimisation de votre nœud :

Score actuel : ${report.currentScore}
Score potentiel : ${report.potentialScore}

Recommandations :
${recommendationsList}

Connectez-vous à votre tableau de bord pour plus de détails et pour appliquer ces optimisations.`,
    });
  }

  async sendAlertEmail(
    to: string,
    firstName: string,
    alert: {
      type: string;
      message: string;
      severity: "low" | "medium" | "high";
    }
  ) {
    const severityEmoji = {
      low: "⚪️",
      medium: "🟡",
      high: "🔴",
    };

    return this.sendEmail({
      to,
      firstName,
      subject: `${severityEmoji[alert.severity]} Alerte ${alert.type}`,
      message: alert.message,
    });
  }
}

export default EmailService.getInstance();
