import { NextRequest, NextResponse } from "next/server";
import { getSession, getUserByEmail } from "@/app/lib/prisma-auth";
import { PrismaClient } from "@prisma/client";

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

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.email,
      },
      data: {
        name,
      },
    });

    return NextResponse.json({
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
