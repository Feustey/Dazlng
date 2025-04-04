import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  recipientEmail: string;
}

export async function POST(req: Request) {
  try {
    const data: ShippingInfo = await req.json();

    // Configuration du transporteur d'email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Création du contenu de l'email
    const emailContent = `
      Nouvelle commande Daznode !
      
      Informations de livraison :
      -------------------------
      Nom : ${data.name}
      Adresse : ${data.address}
      Ville : ${data.city}
      Code postal : ${data.zipCode}
      Pays : ${data.country}
      Téléphone : ${data.phone}
      Email : ${data.email}
      
      Cette commande inclut :
      - Un nœud Raspberry Pi 5 pré-configuré
      - 50 000 sats pré-chargés
      - 2 semaines de support dédié
      - 1 an d'abonnement DazIA Premium
    `;

    // Envoi de l'email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: data.recipientEmail,
      subject: "Nouvelle commande Daznode",
      text: emailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
