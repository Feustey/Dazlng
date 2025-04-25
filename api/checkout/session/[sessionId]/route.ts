import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Simuler une session pour le déploiement
    const mockSession = {
      id: params.sessionId || "mock-session-id",
      amount: 10000,
      paymentUrl: "lnbc1000...",
      status: "pending",
    };

    return NextResponse.json(mockSession);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
