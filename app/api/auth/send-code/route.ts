import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { dynamic } from "@/app/api/config";
import { VerificationCode } from "@/app/lib/models/VerificationCode";
import { sendVerificationEmail } from "@/app/lib/email";

export { dynamic };
export const runtime = "edge";

export async function POST(request: Request) {
  try {
    await prisma.$connect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email requis" },
        { status: 400 }
      );
    }

    // Générer un code de vérification à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Créer un nouveau code de vérification
    await VerificationCode.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // Envoyer l'email de vérification
    await sendVerificationEmail(email, code);

    return NextResponse.json({
      status: "success",
      message: "Code de vérification envoyé",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du code:", error);
    return NextResponse.json(
      { status: "error", message: "Erreur lors de l'envoi du code" },
      { status: 500 }
    );
  }
}
