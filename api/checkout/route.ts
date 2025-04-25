import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Marquer cette route comme dynamique
export const dynamic = "force-dynamic";

// Mock de supabase pour le déploiement
const supabase = {
  from: (table: string) => ({
    insert: (data: any) => ({
      select: () => ({
        single: () => ({
          data: { id: `mock-${Date.now()}`, ...data },
          error: null,
        }),
      }),
    }),
    select: () => ({
      eq: () => ({
        single: () => ({
          data: {
            id: "mock-user-id",
            email: "user@example.com",
            name: "John Doe",
          },
          error: null,
        }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => ({
            data: { id: "mock-session-id", status: "completed" },
            error: null,
          }),
        }),
      }),
    }),
  }),
};

export async function POST(request: Request) {
  try {
    const { amount, description } = await request.json();

    const { data, error } = await supabase
      .from("checkout_sessions")
      .insert({
        amount,
        description,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    // Simuler une session de paiement
    return NextResponse.json({
      sessionId: `session-${Date.now()}`,
      amount: 400000, // 400,000 sats
      status: "pending",
    });
  } catch (error) {
    console.error("Error in checkout route:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "ID de session manquant" },
        { status: 400 }
      );
    }

    // Simuler la mise à jour d'une session
    return NextResponse.json({
      sessionId,
      status: "completed",
    });
  } catch (error) {
    console.error("Error updating payment session:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
