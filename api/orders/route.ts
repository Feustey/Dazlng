import { NextRequest, NextResponse } from "next/server";

// Marquer cette route comme dynamique
export const dynamic = "force-dynamic";

// Types pour les commandes
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

// Données simulées
const mockOrders: Order[] = [
  {
    id: "order-001",
    user_id: "user-123",
    items: [
      {
        product_id: "dazbox-basic",
        product_name: "Dazbox Basic",
        quantity: 1,
        price: 400000,
      },
    ],
    total_amount: 400000,
    status: "delivered",
    created_at: "2024-04-15T10:30:00Z",
  },
  {
    id: "order-002",
    user_id: "user-123",
    items: [
      {
        product_id: "dazbox-pro",
        product_name: "Dazbox Pro",
        quantity: 1,
        price: 600000,
      },
    ],
    total_amount: 600000,
    status: "processing",
    created_at: "2024-05-01T16:45:00Z",
  },
  {
    id: "order-003",
    user_id: "user-456",
    items: [
      {
        product_id: "dazbox-basic",
        product_name: "Dazbox Basic",
        quantity: 2,
        price: 400000,
      },
    ],
    total_amount: 800000,
    status: "shipped",
    created_at: "2024-04-20T09:15:00Z",
  },
];

// Fonction utilitaire pour générer un ID unique
function generateOrderId(): string {
  return `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// GET /api/orders - Récupérer toutes les commandes d'un utilisateur
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Filtrer les commandes par userId
    const userOrders = mockOrders.filter((order) => order.user_id === userId);

    // Trier par date de création (la plus récente d'abord)
    userOrders.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    console.log(`Commandes simulées récupérées pour l'utilisateur: ${userId}`);
    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Créer une nouvelle commande
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, totalAmount } = body;

    if (!userId || !items || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Créer une nouvelle commande simulée
    const newOrder: Order = {
      id: generateOrderId(),
      user_id: userId,
      items,
      total_amount: totalAmount,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // Ajouter la commande à notre "base de données" simulée
    mockOrders.push(newOrder);

    console.log(`Nouvelle commande simulée créée: ${newOrder.id}`);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
