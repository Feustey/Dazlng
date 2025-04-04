import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/app/lib/db";
import { Session } from "@/app/lib/models/Session";

export async function POST() {
  try {
    const sessionId = cookies().get("session_id")?.value;

    if (sessionId) {
      await connectToDatabase();
      await Session.deleteOne({ sessionId });
    }

    // Supprimer le cookie de session
    cookies().delete("session_id");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json(
      { error: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}
