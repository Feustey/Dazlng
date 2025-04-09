import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import Order from "@/app/models/Order";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'historique des commandes:",
      error
    );
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
