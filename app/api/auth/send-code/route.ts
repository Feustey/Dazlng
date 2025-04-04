import { randomInt } from "crypto";
import { connectToDatabase } from "@/app/lib/db";
import { VerificationCode } from "@/app/lib/models/VerificationCode";
import { dynamic, errorResponse, successResponse } from "@/app/api/config";

export { dynamic };
export const runtime = "edge" as const;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return errorResponse("Email is required", 400);
    }

    // Générer un code à 6 chiffres
    const code = randomInt(100000, 999999).toString();

    await connectToDatabase();

    // Sauvegarder le code dans la base de données
    await VerificationCode.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // TODO: Envoyer l'email avec le code
    // Pour l'instant, on retourne le code dans la réponse
    return successResponse({ message: "Verification code sent", code });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return errorResponse("Failed to send verification code");
  }
}
