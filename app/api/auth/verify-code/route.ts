import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { connectToDatabase } from "@/app/lib/db";
import { VerificationCode } from "@/app/lib/models/VerificationCode";
import { Session } from "@/app/lib/models/Session";
import { SESSION_CONFIG, getSessionExpiry } from "@/app/config/session";
import { rateLimit } from "@/app/middleware/rateLimit";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

// Configuration spécifique pour le rate limiting de la vérification
const verifyCodeRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par fenêtre
  keyPrefix: "verify-code",
};

export async function POST(request: Request) {
  try {
    // Appliquer le rate limiting
    const rateLimitResponse = await rateLimit(request, verifyCodeRateLimit);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { email, code } = await request.json();

    if (!email || !code) {
      return errorResponse("Email and code are required", 400);
    }

    // Connexion à la base de données
    await connectToDatabase();

    // Rechercher le code de vérification
    const verificationCode = await VerificationCode.findOne({
      email,
      expiresAt: {
        gt: new Date(),
      },
    });

    if (!verificationCode) {
      return errorResponse(
        "No verification code found or code has expired",
        400
      );
    }

    if (verificationCode.code !== code) {
      return errorResponse("Invalid verification code", 400);
    }

    // Code valide, supprimer le code de vérification
    await VerificationCode.deleteOne({
      id: verificationCode.id,
    });

    // Créer une session avec la nouvelle configuration
    const sessionId = randomBytes(32).toString("hex");
    const sessionExpiresAt = getSessionExpiry();

    await Session.create({
      sessionId,
      email,
      expiresAt: sessionExpiresAt,
    });

    // Définir le cookie de session avec les nouvelles options de sécurité
    cookies().set("session_id", sessionId, {
      ...SESSION_CONFIG.cookieOptions,
      expires: sessionExpiresAt,
    });

    return successResponse({ success: true });
  } catch (error) {
    console.error("Error verifying code:", error);
    return errorResponse("Failed to verify code");
  }
}
