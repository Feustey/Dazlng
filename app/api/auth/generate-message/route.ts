import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    // Logique de génération de message ici
    const generatedMessage = `Message généré : ${message}`;

    return NextResponse.json({ success: true, message: generatedMessage });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la génération du message" },
      { status: 500 }
    );
  }
}
