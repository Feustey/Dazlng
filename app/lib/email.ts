import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour envoyer un email de vérification
export async function sendVerificationEmail(email: string, code: string) {
  try {
    await resend.emails.send({
      from: "Daznode <onboarding@resend.dev>",
      to: email,
      subject: "Vérification de votre email",
      html: `
        <h1>Votre code de vérification</h1>
        <p>Voici votre code de vérification : <strong>${code}</strong></p>
        <p>Ce code expirera dans 10 minutes.</p>
      `,
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
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return false;
  }
}
