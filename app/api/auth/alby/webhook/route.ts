import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createHash, createHmac } from "crypto";
import { connectToDatabase } from "@/app/lib/db";
import { User } from "@/app/models/User";
import { Session } from "@/app/models/Session";

// Fonction pour vérifier la signature du webhook
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  const calculatedSignature = hmac.digest("hex");
  return calculatedSignature === signature;
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const signature = headersList.get("x-alby-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Signature manquante" },
        { status: 401 }
      );
    }

    // Récupérer le corps de la requête
    const payload = await request.text();

    // Vérifier la signature
    const isValid = verifySignature(
      payload,
      signature,
      process.env.ALBY_WEBHOOK_SECRET || ""
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Signature invalide" },
        { status: 401 }
      );
    }

    // Parser le payload
    const data = JSON.parse(payload);

    // Vérifier le type d'événement
    if (data.type === "sign_message") {
      const { pubkey, message, signature: messageSignature } = data;

      // Vérifier que le message correspond à notre format
      if (!message.startsWith("Connexion à Daznode -")) {
        return NextResponse.json(
          { error: "Message invalide" },
          { status: 400 }
        );
      }

      await connectToDatabase();

      // Rechercher ou créer l'utilisateur
      let user = await User.findOne({ pubkey });
      if (!user) {
        user = await User.create({
          pubkey,
          name: `User ${pubkey.slice(0, 8)}`,
          email: `${pubkey.slice(0, 8)}@example.com`, // Email temporaire
        });
      } else {
        user.lastLoginAt = new Date();
        await user.save();
      }

      // Créer une session pour l'utilisateur
      const session = await Session.create({
        userId: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      });

      // Retourner le token de session
      return NextResponse.json({
        token: session._id,
        user: {
          id: user._id,
          pubkey: user.pubkey,
          name: user.name,
          email: user.email,
        },
      });
    }

    return NextResponse.json(
      { error: "Type d'événement non supporté" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
