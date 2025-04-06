import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Fonction pour envoyer un email de vérification
export async function sendVerificationEmail(email: string, code: string) {
  await transporter.sendMail({
    from: "noreply@dazno.de",
    to: email,
    subject: "Code de vérification DazNode",
    html: `
      <h1>Code de vérification DazNode</h1>
      <p>Votre code de vérification est : <strong>${code}</strong></p>
      <p>Ce code expirera dans 10 minutes.</p>
      <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: "noreply@dazno.de",
    to: email,
    subject: "Réinitialisation de mot de passe DazNode",
    html: `
      <h1>Réinitialisation de mot de passe</h1>
      <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
    `,
  });
}
