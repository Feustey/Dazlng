import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { connectToDatabase } from "../../lib/mongodb";
import { authOptions } from "../../lib/auth";
import { getToken } from "next-auth/jwt";
import CheckoutSession from "@/models/CheckoutSession";

// Marquer cette route comme dynamique
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { plan, billingCycle, amount, deliveryInfo, paymentMethod } = data;

    // Validate required fields
    if (!plan || !billingCycle || !amount || !deliveryInfo || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate plan and billing cycle
    if (
      !["oneshot", "monthly", "yearly"].includes(plan) ||
      !["once", "monthly", "yearly"].includes(billingCycle)
    ) {
      return NextResponse.json(
        { error: "Invalid plan or billing cycle" },
        { status: 400 }
      );
    }

    // Validate amount
    let expectedAmount = 0;
    if (plan === "oneshot" && billingCycle === "once") {
      expectedAmount = 10000; // 10,000 sats
    } else if (plan === "monthly" && billingCycle === "monthly") {
      expectedAmount = 5000; // 5,000 sats
    } else if (plan === "yearly" && billingCycle === "yearly") {
      expectedAmount = 50000; // 50,000 sats
    }

    if (amount !== expectedAmount) {
      return NextResponse.json(
        { error: "Invalid amount for selected plan" },
        { status: 400 }
      );
    }

    // Create payment URL (simulated for now)
    const paymentUrl =
      "lightning:LNURL1DP68GURN8GHJ7MRWW4EXCTNXD9SHG6NPVCHXXMMD9AKXUATJDSKHW6T5DPJ8YCTH8AEX2UT99E3K7MF0D3H82UNVWP5HGCT884KX7EMFDCNXKVFA89JH2CTWYPJKZURNVE3K7MF0";

    // Create new checkout session
    const newCheckoutSession = new CheckoutSession({
      userId: token.sub,
      plan,
      billingCycle,
      amount,
      deliveryInfo,
      paymentMethod,
      paymentUrl,
      status: "pending",
    });

    await newCheckoutSession.save();

    return NextResponse.json({
      sessionId: newCheckoutSession._id,
      paymentUrl,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
