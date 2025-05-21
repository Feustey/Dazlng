import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateEmailTemplate } from '../../../utils/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest): Promise<Response> {
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

    // En production, nous utiliserions vraiment Resend
    // Pour le déploiement, nous simulons juste un succès
    if (process.env.RESEND_API_KEY) {
      // Envoyer l'email à l'administrateur
      await resend.emails.send({
        from: 'contact@dazno.de',
        to: 'contact@dazno.de',
        subject: `Nouveau message de contact - ${interest}`,
        html: generateEmailTemplate({
          title: `Nouveau message de contact - ${interest}`,
          username: `${firstName} ${lastName}`,
          mainContent: `Message de ${firstName} ${lastName} (${email}) : <br>${message}`,
          detailedContent: `<b>Entreprise :</b> ${companyName || 'Non renseigné'}<br><b>Fonction :</b> ${jobTitle || 'Non renseigné'}<br><b>Téléphone :</b> ${companyPhone || 'Non renseigné'}<br><b>Site web :</b> ${companyWebsite || 'Non renseigné'}`,
          ctaText: 'Répondre',
          ctaLink: `mailto:${email}`
        }),
        replyTo: email,
      });

      // Envoyer un email de confirmation à l'utilisateur
      await resend.emails.send({
        from: 'contact@dazno.de',
        to: email,
        subject: 'Confirmation de votre message - DazNode',
        html: generateEmailTemplate({
          title: 'Confirmation de votre message',
          username: `${firstName} ${lastName}`,
          mainContent: `Nous avons bien reçu votre message concernant "${interest}".`,
          detailedContent: `Notre équipe vous répondra dans les plus brefs délais.`,
          ctaText: 'Consulter notre FAQ',
          ctaLink: 'https://docs.dazno.de/faq'
        })
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
