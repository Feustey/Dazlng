import { NextRequest, NextResponse } from "next/server";
import { getSession, getUserByEmail } from "@/app/lib/prisma-auth";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const session = await getSession(sessionId);
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    const user = await getUserByEmail(session.email);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Erreur de vérification d'authentification:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
