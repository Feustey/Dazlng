import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { getSession } from '@/app/lib/edge-auth';

// Marquer cette route comme dynamique
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json(session);
  } catch (error) {
    // console.error("Error checking session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
