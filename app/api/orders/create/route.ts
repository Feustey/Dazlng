import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import Order from "@/app/models/Order";
import { Product } from "@/app/models/Product";

export async function POST(req: NextRequest) {
  try {
    const { userId, items, total } = await req.json();

    if (!userId || !items || !total) {
      return NextResponse.json(
        { error: "Données de commande incomplètes" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Vérifier que tous les produits existent
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Produit non trouvé: ${item.productId}` },
          { status: 404 }
        );
      }
    }

    // Créer la commande
    const order = await Order.create({
      userId,
      items: items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      status: "pending",
    });

    return NextResponse.json({
      message: "Commande créée avec succès",
      order,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
