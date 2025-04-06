import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, interest, message } =
      await request.json();

    // Envoyer l'email de contact
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: "contact@dazno.de",
      subject: `[Contact DazNode] ${interest} - ${firstName} ${lastName}`,
      html: `
        <h1>Nouveau message de contact</h1>
        <p><strong>Nom :</strong> ${firstName} ${lastName}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Intérêt :</strong> ${interest}</p>
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `,
    });

    // Envoyer un email de confirmation à l'utilisateur
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Confirmation de votre message - DazNode",
      html: `
        <h1>Merci de nous avoir contacté !</h1>
        <p>Cher/Chère ${firstName},</p>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <p>Cordialement,<br>L'équipe DazNode</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "Failed to send contact email" },
      { status: 500 }
    );
  }
}
