import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  verifyUser,
  createSession,
  getUserByEmail,
  validatePassword,
  createVerificationCode,
} from "@/app/lib/prisma-auth";

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, code, name } = await request.json();

    switch (action) {
      case "register":
        if (!email || !password) {
          return NextResponse.json(
            { error: "Email et mot de passe requis" },
            { status: 400 }
          );
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          return NextResponse.json(
            { error: "Cet email est déjà utilisé" },
            { status: 400 }
          );
        }

        await createUser(email, password, name);
        await createVerificationCode(email);

        return NextResponse.json(
          { message: "Code de vérification envoyé" },
          { status: 200 }
        );

      case "verify":
        if (!email || !code) {
          return NextResponse.json(
            { error: "Email et code requis" },
            { status: 400 }
          );
        }

        await verifyUser(email, code);
        const session = await createSession(email);

        return NextResponse.json(
          { sessionId: session.sessionId },
          { status: 200 }
        );

      case "login":
        if (!email || !password) {
          return NextResponse.json(
            { error: "Email et mot de passe requis" },
            { status: 400 }
          );
        }

        const user = await getUserByEmail(email);
        if (!user) {
          return NextResponse.json(
            { error: "Email ou mot de passe incorrect" },
            { status: 401 }
          );
        }

        const isValid = await validatePassword(user, password);
        if (!isValid) {
          return NextResponse.json(
            { error: "Email ou mot de passe incorrect" },
            { status: 401 }
          );
        }

        const loginSession = await createSession(email);
        return NextResponse.json(
          { sessionId: loginSession.sessionId },
          { status: 200 }
        );

      default:
        return NextResponse.json(
          { error: "Action non valide" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Erreur d'authentification:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
