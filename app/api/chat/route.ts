import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { chatRouter } from "../../services/chatService";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const result = await chatRouter
      .createCaller({ req, session })
      .sendMessage(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
