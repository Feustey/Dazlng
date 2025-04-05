import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { dynamic } from "@/app/api/config";
import { generateToken } from "@/app/lib/auth";
import { Session } from "@/app/lib/models/Session";
import { VerificationCode } from "@/app/lib/models/VerificationCode";

export { dynamic };
export const runtime = "edge";

// Configuration spécifique pour le rate limiting de la vérification
const verifyCodeRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
};

export async function POST(request: Request) {
  try {
    await prisma.$connect();

    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { status: "error", message: "Email et code requis" },
        { status: 400 }
      );
    }

    const verificationCode = await VerificationCode.findOne({
      email,
      code,
      expiresAt: { gt: new Date() },
    });

    if (!verificationCode) {
      return NextResponse.json(
        { status: "error", message: "Code invalide ou expiré" },
        { status: 400 }
      );
    }

    const token = generateToken(email);

    // Créer une nouvelle session
    await Session.create({
      email,
      sessionId: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
    });

    // Supprimer le code de vérification utilisé
    await VerificationCode.deleteOne({ id: verificationCode.id });

    return NextResponse.json({
      status: "success",
      message: "Code vérifié avec succès",
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du code:", error);
    return NextResponse.json(
      { status: "error", message: "Erreur lors de la vérification du code" },
      { status: 500 }
    );
  }
}
