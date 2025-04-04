import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/app/lib/db";
import { Session } from "@/app/lib/models/Session";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

export async function GET() {
  try {
    const sessionId = cookies().get("session_id")?.value;

    if (!sessionId) {
      return successResponse({ isAuthenticated: false });
    }

    await connectToDatabase();

    const session = await Session.findOne({
      sessionId,
      expiresAt: { $gt: new Date() },
    });

    return successResponse({ isAuthenticated: !!session });
  } catch (error) {
    console.error("Erreur lors de la vérification de la session:", error);
    return errorResponse("Erreur lors de la vérification de la session");
  }
}
