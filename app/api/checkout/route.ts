import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { connectToDatabase } from "../../lib/mongodb";
import { authOptions } from "../../lib/auth";
import { getToken } from "next-auth/jwt";
import CheckoutSession from "@/models/CheckoutSession";
import { supabase } from "@lib/supabase";

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
    await connectToDatabase();

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

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { error: "ID de session invalide" },
        { status: 400 }
      );
    }

    const checkoutSession = await CheckoutSession.findOne({
      _id: sessionId,
      userId: token.sub,
    });

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
    await connectToDatabase();

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

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { error: "ID de session invalide" },
        { status: 400 }
      );
    }

    const checkoutSession = await CheckoutSession.findOneAndUpdate(
      {
        _id: sessionId,
        userId: token.sub,
      },
      { status },
      { new: true }
    );

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
