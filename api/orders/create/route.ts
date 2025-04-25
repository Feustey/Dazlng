import { NextRequest, NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Types pour les commandes
interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, items, total } = await req.json();

    if (!userId || !items || !total) {
      return NextResponse.json(
        { error: "Données de commande incomplètes" },
        { status: 400 }
      );
    }

    // Vérification minimale des données
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "La commande doit contenir au moins un article" },
        { status: 400 }
      );
    }

    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Créer une commande simulée
    const order: Order = {
      id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: userId,
      items: items.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    console.log("Commande simulée créée:", order.id);

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
