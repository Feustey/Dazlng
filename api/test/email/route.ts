import { NextResponse } from "next/server";

// Fonction simulée d'envoi d'email
async function sendVerificationEmail(
  email: string,
  token: string
): Promise<boolean> {
  console.log(
    `[Simulation] Email de vérification envoyé à ${email} avec le token ${token}`
  );
  return true;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email requis" },
        { status: 400 }
      );
    }

    // Génération d'un token aléatoire pour la simulation
    const token = Math.random().toString(36).substring(2, 15);

    // Appel de la fonction simulée
    const success = await sendVerificationEmail(email, token);

    return NextResponse.json({
      success: true,
      message: `Email de vérification envoyé à ${email}`,
      token: token, // En production, ne jamais renvoyer le token
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
