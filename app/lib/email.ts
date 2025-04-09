import { Resend } from "resend";
import AuthEmailTemplate from "../components/emails/AuthEmailTemplate";
import WelcomeEmailTemplate from "../components/emails/WelcomeEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour envoyer un email de vérification
export async function sendVerificationEmail(email: string, code: string) {
  try {
    await resend.emails.send({
      from: "Daznode <onboarding@resend.dev>",
      to: email,
      subject: "Vérification de votre email",
      react: AuthEmailTemplate({
        type: "verification",
        code,
      }),
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  try {
    await resend.emails.send({
      from: "Daznode <no-reply@daznode.com>",
      to: email,
      subject: "Réinitialisation de mot de passe DazNode",
      react: AuthEmailTemplate({
        type: "reset",
        resetUrl,
      }),
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
  try {
    await resend.emails.send({
      from: "DazNode <bienvenue@daznode.com>",
      to: email,
      subject: "Bienvenue sur DazNode !",
      react: WelcomeEmailTemplate({
        firstName,
        dashboardUrl,
      }),
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
    return false;
  }
}
