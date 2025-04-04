import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { connectToDatabase } from "@/app/lib/db";
import { VerificationCode } from "@/app/lib/models/VerificationCode";
import { Session } from "@/app/lib/models/Session";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return errorResponse("Email and code are required", 400);
    }

    // Connexion à la base de données
    await connectToDatabase();

    // Rechercher le code de vérification
    const verificationCode = await VerificationCode.findOne({
      email,
      expiresAt: { $gt: new Date() },
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
    await VerificationCode.deleteOne({ _id: verificationCode._id });

    // Créer une session
    const sessionId = randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

    await Session.create({
      sessionId,
      email,
      expiresAt: sessionExpiresAt,
    });

    // Définir le cookie de session
    cookies().set("session_id", sessionId, {
      expires: sessionExpiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return successResponse({ success: true });
  } catch (error) {
    console.error("Error verifying code:", error);
    return errorResponse("Failed to verify code");
  }
}
