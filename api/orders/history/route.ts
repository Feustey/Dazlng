import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  HttpStatus,
} from "../../../api/responses";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Configuration de la revalidation
export const revalidate = 60; // Revalidation chaque minute pour les données plus récentes

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
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  created_at: string;
  updated_at: string;
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
    total: 400000,
    status: "delivered",
    payment_status: "paid",
    created_at: "2024-04-15T10:30:00Z",
    updated_at: "2024-04-18T14:20:00Z",
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
    total: 600000,
    status: "processing",
    payment_status: "paid",
    created_at: "2024-05-01T16:45:00Z",
    updated_at: "2024-05-01T16:50:00Z",
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
    total: 800000,
    status: "shipped",
    payment_status: "paid",
    created_at: "2024-04-20T09:15:00Z",
    updated_at: "2024-04-22T11:30:00Z",
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return errorResponse("ID utilisateur requis", {
        status: HttpStatus.BAD_REQUEST,
      });
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

    console.log(`Historique simulé récupéré pour l'utilisateur: ${userId}`);

    return successResponse(
      { orders: userOrders },
      {
        headers: {
          "Cache-Control": "private, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'historique des commandes:",
      error
    );
    return errorResponse("Erreur interne du serveur", {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
