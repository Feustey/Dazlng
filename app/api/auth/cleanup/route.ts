import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import mongoose from "mongoose";

export async function POST() {
  try {
    const db = await connectToDatabase();
    await db.collection("sessions").deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors du nettoyage des sessions:", error);
    return NextResponse.json(
      { error: "Erreur lors du nettoyage des sessions" },
      { status: 500 }
    );
  }
}
