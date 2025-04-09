import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { User } from "@/app/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pubkey } = body;

    if (!pubkey) {
      return NextResponse.json(
        { error: "Clé publique requise" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ pubkey });
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        pubkey: user.pubkey,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
