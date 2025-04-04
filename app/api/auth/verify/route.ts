import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { pubkey, signature, message } = await req.json();

    // Vérifier si l'utilisateur a déjà payé
    const user = await prisma.user.findFirst({
      where: {
        pubkey,
        subscriptionStatus: "active",
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Utilisateur non trouvé ou non payé" }),
        { status: 404 }
      );
    }

    // Déterminer la page de redirection en fonction du type d'abonnement
    const redirectUrl =
      user.subscriptionTier === "yearly" ? "/dashboard" : "/recommendations";

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("Erreur de vérification:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
}
