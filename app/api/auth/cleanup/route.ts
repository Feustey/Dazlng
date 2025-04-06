import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST() {
  try {
    // Supprimer toutes les sessions expirées
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({ message: "Sessions nettoyées avec succès" });
  } catch (error) {
    console.error("Erreur lors du nettoyage des sessions:", error);
    return NextResponse.json(
      { error: "Erreur lors du nettoyage des sessions" },
      { status: 500 }
    );
  }
}
