import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { randomBytes } from "crypto";

export async function GET() {
  try {
    const session = await auth();

    // Générer une URL de callback sécurisée
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/lnurl`;

    // Générer un challenge aléatoire
    const k1 = randomBytes(32).toString("hex");

    // Construire l'URL LNURL
    const lnurlEncoded = `lightning:${callbackUrl}?tag=login&k1=${k1}`;

    // Stocker le challenge dans la session ou un cache temporaire
    // TODO: Implémenter le stockage sécurisé du challenge

    return NextResponse.json({ lnurl: lnurlEncoded });
  } catch (error) {
    console.error("Erreur lors de la génération du LNURL:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du LNURL" },
      { status: 500 }
    );
  }
}
