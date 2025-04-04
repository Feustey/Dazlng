import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { connectToDatabase } from "@/app/lib/db";
import { VerificationCode } from "@/app/lib/models/VerificationCode";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

export async function POST(request: Request) {
  try {
    console.log("Début de la requête send-code");
    const { email } = await request.json();

    if (!email) {
      console.error("Email manquant dans la requête");
      return errorResponse("Email is required", 400);
    }

    console.log("Tentative de connexion à la base de données...");
    // Connexion à la base de données
    await connectToDatabase();
    console.log("Connexion à la base de données réussie");

    // Générer un code à 6 chiffres
    const code = randomInt(100000, 999999).toString();
    console.log("Code généré:", code);

    // Stocker le code avec une expiration de 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Supprimer les anciens codes pour cet email
    console.log("Suppression des anciens codes pour", email);
    await VerificationCode.deleteMany({ email });

    // Créer un nouveau code de vérification
    console.log("Création du nouveau code de vérification");
    await VerificationCode.create({
      email,
      code,
      expiresAt,
    });

    // TODO: En production, envoyez un vrai email
    console.log(`Code de vérification pour ${email}: ${code}`);

    return successResponse({ success: true });
  } catch (error) {
    console.error(
      "Erreur détaillée lors de l'envoi du code de vérification:",
      error
    );
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }
    return errorResponse("Failed to send verification code");
  }
}
