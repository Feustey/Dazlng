import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALBY_WEBHOOK_SECRET = process.env.ALBY_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("x-alby-signature")!;

    // Vérification de la signature Alby
    if (signature !== ALBY_WEBHOOK_SECRET) {
      console.error("Signature webhook invalide");
      return new NextResponse("Signature webhook invalide", { status: 400 });
    }

    const event = JSON.parse(body);

    // Gestion du paiement réussi
    if (event.type === "payment.received") {
      const { amount, metadata } = event.data;

      // Récupération de l'utilisateur à partir des métadonnées
      const user = await prisma.user.findUnique({
        where: {
          id: metadata.userId,
        },
      });

      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      // Mise à jour de l'utilisateur avec les informations d'abonnement
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          subscriptionStatus: "active",
          subscriptionTier: amount >= 100000 ? "yearly" : "one-shot", // 100000 sats = 1€
          subscriptionStartDate: new Date(),
          subscriptionEndDate:
            amount >= 100000
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 an
              : null,
        },
      });

      // Déterminer la page de redirection en fonction du type d'abonnement
      const redirectUrl = amount >= 100000 ? "/dashboard" : "/recommendations";

      return NextResponse.json({
        success: true,
        redirectUrl,
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Erreur webhook:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
