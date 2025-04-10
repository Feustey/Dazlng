import { NextRequest } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import Order from "@/app/models/Order";
import {
  successResponse,
  errorResponse,
  HttpStatus,
} from "../../../lib/api/responses";

// Utiliser revalidate pour définir la durée de mise en cache
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
      .select("-__v");

    return successResponse({ orders });
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
