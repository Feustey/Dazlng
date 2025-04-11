import { NextRequest } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import Order from "@/app/models/Order";
import {
  successResponse,
  errorResponse,
  HttpStatus,
} from "../../../lib/api/responses";

// Configuration de la revalidation
export const revalidate = 60; // Revalidation chaque minute pour les données plus récentes

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return errorResponse("ID utilisateur requis", {
        status: HttpStatus.BAD_REQUEST,
      });
    }

    await connectToDatabase();

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .limit(50); // Limiter le nombre de résultats pour optimiser les performances

    return successResponse(
      { orders },
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
