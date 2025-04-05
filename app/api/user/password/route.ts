import { NextRequest, NextResponse } from "next/server";
import {
  getSession,
  getUserByEmail,
  validatePassword,
} from "@/app/lib/prisma-auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const session = await getSession(sessionId);
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          error:
            "Le mot de passe actuel et le nouveau mot de passe sont requis",
        },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(session.email);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const isValid = await validatePassword(user, currentPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        email: session.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
