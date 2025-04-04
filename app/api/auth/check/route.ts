import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/app/lib/db";
import { Session } from "@/app/lib/models/Session";

export async function GET() {
  try {
    const sessionId = cookies().get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.json({ isAuthenticated: false });
    }

    await connectToDatabase();

    const session = await Session.findOne({
      sessionId,
      expiresAt: { $gt: new Date() },
    });

    return NextResponse.json({ isAuthenticated: !!session });
  } catch (error) {
    console.error("Erreur lors de la vérification de la session:", error);
    return NextResponse.json({ isAuthenticated: false });
  }
}
