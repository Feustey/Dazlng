import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Adresses email de test
const TEST_SENDER = "onboarding@resend.dev";
const TEST_ADMIN = "feustey@pm.me";
const TEST_USER = "feustey@pm.me";

export async function GET() {
  try {
    console.log("Démarrage du test d'envoi d'emails...");
    console.log(
      "Clé Resend:",
      process.env.RESEND_API_KEY ? "Présente" : "Manquante"
    );

    const testData = {
      firstName: "Test",
      lastName: "Utilisateur",
      email: TEST_USER,
      companyName: "DazNode Test",
      jobTitle: "Testeur",
      companyPhone: "+33 123456789",
      companyWebsite: "https://dazno.de",
      interest: "Test Email",
      message: "Ceci est un test du système d'envoi d'email.",
    };

    console.log("Données de test:", testData);

    const emailContent = `
      Nouveau message de contact (TEST):
      
      Nom: ${testData.firstName} ${testData.lastName}
      Email: ${testData.email}
      Entreprise: ${testData.companyName}
      Fonction: ${testData.jobTitle}
      Téléphone: ${testData.companyPhone}
      Site web: ${testData.companyWebsite}
      Sujet: ${testData.interest}
      
      Message:
      ${testData.message}
    `;

    const userEmailContent = `
      Bonjour ${testData.firstName},
      
      Nous avons bien reçu votre message concernant "${testData.interest}".
      Notre équipe vous répondra dans les plus brefs délais.
      
      Cordialement,
      L'équipe DazNode
    `;

    let results = {
      plainEmail: null,
      adminEmail: null,
      userEmail: null,
    };

    if (process.env.RESEND_API_KEY) {
      console.log("Envoi de l'email texte brut...");
      // Email texte brut pour l'admin
      results.plainEmail = await resend.emails.send({
        from: TEST_SENDER,
        to: TEST_ADMIN,
        subject: `[TEST] Nouveau message de contact - ${testData.interest}`,
        text: emailContent,
        replyTo: testData.email,
      });
      console.log("Résultat email texte:", results.plainEmail);

      console.log("Envoi de l'email admin...");
      // Email pour l'admin
      results.adminEmail = await resend.emails.send({
        from: TEST_SENDER,
        to: TEST_ADMIN,
        subject: `[TEST] [Contact DazNode] ${testData.interest} - ${testData.firstName} ${testData.lastName}`,
        text: emailContent,
      });
      console.log("Résultat email admin:", results.adminEmail);

      console.log("Envoi de l'email utilisateur...");
      // Email de confirmation pour l'utilisateur
      results.userEmail = await resend.emails.send({
        from: TEST_SENDER,
        to: testData.email,
        subject: "[TEST] Confirmation de votre message - DazNode",
        text: userEmailContent,
      });
      console.log("Résultat email utilisateur:", results.userEmail);
    } else {
      console.log("Mode simulation (pas de clé API Resend)");
      console.log("Email simulé (admin):", emailContent);
      console.log("Email simulé (user):", userEmailContent);
    }

    return NextResponse.json(
      {
        message: "Emails de test envoyés avec succès",
        details: {
          from: TEST_SENDER,
          admin: TEST_ADMIN,
          user: TEST_USER,
        },
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur détaillée lors de l'envoi des emails de test:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur lors de l'envoi des emails de test",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
