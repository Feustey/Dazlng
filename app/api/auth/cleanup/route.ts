import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import mongoose from "mongoose";

export async function POST() {
  try {
    const db = await connectToDatabase();
    // Supprimer toutes les sessions expirées
    await db.collection("sessions").deleteMany({
      expiresAt: {
        $lt: new Date(),
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
