import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/prisma-auth";

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    const response = NextResponse.json(
      { message: "Déconnexion réussie" },
      { status: 200 }
    );

    // Supprimer le cookie de session
    response.cookies.delete("sessionId");

    return response;
  } catch (error: any) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
