import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/app/lib/db";
import { Session } from "@/app/lib/models/Session";
import { dynamic, errorResponse, successResponse } from "@/app/api/config";

export { dynamic };
export const runtime = "edge" as const;

export async function GET() {
  try {
    const sessionId = cookies().get("session_id")?.value;

    if (!sessionId) {
      return errorResponse("Non authentifié", 401);
    }

    await connectToDatabase();

    const session = await Session.findOne({
      sessionId,
      expiresAt: { gt: new Date() },
    });

    if (!session) {
      return errorResponse("Session expirée", 401);
    }

    return successResponse({ authenticated: true });
  } catch (error) {
    console.error("Erreur lors de la vérification de la session:", error);
    return errorResponse("Erreur interne du serveur");
  }
}
