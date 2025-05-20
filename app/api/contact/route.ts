import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request): Promise<Response> {
  try {
    const {
      firstName,
      lastName,
      email,
      companyName,
      jobTitle,
      companyPhone,
      companyWebsite,
      interest,
      message,
    } = await request.json();

    // Validation stricte des champs obligatoires
    if (!firstName || !lastName || !email || !interest || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const emailContent = `
      Nouveau message de contact:
      
      Nom: ${firstName} ${lastName}
      Email: ${email}
      Entreprise: ${companyName || "Non renseigné"}
      Fonction: ${jobTitle || "Non renseigné"}
      Téléphone: ${companyPhone || "Non renseigné"}
      Site web: ${companyWebsite || "Non renseigné"}
      Sujet: ${interest}
      
      Message:
      ${message}
    `;

    // En production, nous utiliserions vraiment Resend
    // Pour le déploiement, nous simulons juste un succès
    if (process.env.NODE_ENV === "production" && process.env.RESEND_API_KEY) {
      // Envoyer l'email à l'administrateur
      await resend.emails.send({
        from: "DazNode <onboarding@resend.dev>",
        to: "contact@dazno.de",
        subject: `Nouveau message de contact - ${interest}`,
        text: emailContent,
        replyTo: email,
      });

      // Envoyer un email de confirmation à l'utilisateur
      await resend.emails.send({
        from: "DazNode <onboarding@resend.dev>",
        to: email,
        subject: "Confirmation de votre message - DazNode",
        text: `Bonjour ${firstName},\n\nNous avons bien reçu votre message concernant "${interest}". Notre équipe vous répondra dans les plus brefs délais.\n\nCordialement,\nL'équipe DazNode`,
      });
    } else {
      // En mode développement ou sans clé API, juste logger
      // console.log("Email simulé:", emailContent);
    }

    return NextResponse.json(
      { message: "Message envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
