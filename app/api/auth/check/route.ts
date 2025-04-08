import { NextResponse } from "next/server";
import { getSessionFromCookie } from "../../../lib/edge-auth";

export async function GET() {
  try {
    const session = await getSessionFromCookie();

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        email: session.email,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
