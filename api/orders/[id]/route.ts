import { NextRequest, NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Type pour les commandes
interface Order {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  tracking_number?: string;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  shipping_address: {
    name: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

// Données simulées pour les commandes
const mockOrders: Record<string, Order> = {
  "order-123": {
    id: "order-123",
    product_id: "dazbox-basic",
    product_name: "Dazbox Basic",
    quantity: 1,
    total_price: 400000,
    status: "processing",
    payment_status: "paid",
    user_id: "user-456",
    created_at: "2024-05-01T14:30:00Z",
    updated_at: "2024-05-01T14:35:00Z",
    shipping_address: {
      name: "Jean Dupont",
      address: "123 Rue de Paris",
      city: "Paris",
      postal_code: "75001",
      country: "France",
    },
  },
  "order-456": {
    id: "order-456",
    product_id: "dazbox-pro",
    product_name: "Dazbox Pro",
    quantity: 1,
    total_price: 600000,
    status: "shipped",
    payment_status: "paid",
    tracking_number: "LP00987654321",
    user_id: "user-789",
    created_at: "2024-04-28T10:15:00Z",
    updated_at: "2024-04-29T09:20:00Z",
    shipping_address: {
      name: "Marie Martin",
      address: "456 Avenue des Champs",
      city: "Lyon",
      postal_code: "69000",
      country: "France",
    },
    notes: "Livraison express demandée",
  },
};

// GET /api/orders/[id] - Récupérer une commande spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 100));

    const order = mockOrders[orderId];

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    console.log(`Commande simulée récupérée: ${orderId}`);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/orders/[id] - Mettre à jour une commande
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await req.json();
    const { status, paymentStatus, trackingNumber, notes } = body;

    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 100));

    const order = mockOrders[orderId];

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    // Mettre à jour les données
    const updatedOrder = { ...order };
    if (status) updatedOrder.status = status;
    if (paymentStatus) updatedOrder.payment_status = paymentStatus;
    if (trackingNumber !== undefined)
      updatedOrder.tracking_number = trackingNumber;
    if (notes !== undefined) updatedOrder.notes = notes;
    updatedOrder.updated_at = new Date().toISOString();

    // Sauvegarder dans notre "base de données" simulée
    mockOrders[orderId] = updatedOrder;

    console.log(`Commande simulée mise à jour: ${orderId}`);
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Supprimer une commande
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 100));

    const order = mockOrders[orderId];

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier si la commande peut être supprimée
    if (order.status !== "cancelled" && order.status !== "delivered") {
      return NextResponse.json(
        {
          error:
            "Seules les commandes annulées ou livrées peuvent être supprimées",
        },
        { status: 400 }
      );
    }

    // Supprimer de notre "base de données" simulée
    delete mockOrders[orderId];

    console.log(`Commande simulée supprimée: ${orderId}`);
    return NextResponse.json(
      { message: "Commande supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
