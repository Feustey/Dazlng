import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { authOptions } from "../../lib/auth";
import { getToken } from "next-auth/jwt";
import { supabase } from "../../lib/supabase";

// Marquer cette route comme dynamique
export const dynamic = "force-dynamic";

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

export async function GET(req: Request) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "ID de session requis" },
        { status: 400 }
      );
    }

    const { data: checkoutSession, error } = await supabase
      .from("checkout_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("userId", token.sub)
      .single();

    if (error) {
      throw error;
    }

    if (!checkoutSession) {
      return NextResponse.json(
        { error: "Session de paiement non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: checkoutSession,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la session de paiement:",
      error
    );
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération de la session" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { sessionId, status } = data;

    if (!sessionId || !status) {
      return NextResponse.json(
        { error: "ID de session et statut requis" },
        { status: 400 }
      );
    }

    const { data: checkoutSession, error } = await supabase
      .from("checkout_sessions")
      .update({ status })
      .eq("id", sessionId)
      .eq("userId", token.sub)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!checkoutSession) {
      return NextResponse.json(
        { error: "Session de paiement non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: checkoutSession,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la session de paiement:",
      error
    );
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour de la session" },
      { status: 500 }
    );
  }
}
