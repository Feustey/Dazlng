import { NextRequest, NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Types pour les commandes
interface Order {
  id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  user_id: string;
  total: number;
  updated_at: string;
}

// Données simulées
const mockOrders: Record<string, Order> = {
  "order-123": {
    id: "order-123",
    status: "pending",
    user_id: "user-456",
    total: 400000,
    updated_at: "2024-05-01T14:30:00Z",
  },
  "order-456": {
    id: "order-456",
    status: "processing",
    user_id: "user-789",
    total: 600000,
    updated_at: "2024-04-28T10:15:00Z",
  },
};

export async function PUT(req: NextRequest) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "ID de commande et statut requis" },
        { status: 400 }
      );
    }

    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Vérifier si la commande existe
    const order = mockOrders[orderId];
    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    // Mettre à jour le statut et la date de mise à jour
    const updatedOrder = {
      ...order,
      status,
      updated_at: new Date().toISOString(),
    };

    // Sauvegarder dans notre "base de données" simulée
    mockOrders[orderId] = updatedOrder;

    console.log(
      `Statut de la commande simulée mis à jour: ${orderId} -> ${status}`
    );

    return NextResponse.json({
      message: "Statut de la commande mis à jour avec succès",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
