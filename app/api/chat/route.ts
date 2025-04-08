import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth-options";
import { chatRouter } from "../../services/chatService";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const result = await chatRouter.createCaller({ session }).sendMessage(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
