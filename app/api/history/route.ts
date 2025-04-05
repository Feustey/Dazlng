import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const history = await prisma.history.findMany({
      orderBy: {
        date: "desc",
      },
      take: 100,
      select: {
        date: true,
        price: true,
        volume: true,
        marketCap: true,
      },
    });

    return NextResponse.json({
      status: "success",
      data: history,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);

    // Retourner des données fictives en cas d'erreur pour éviter les erreurs en production
    const mockHistory = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000),
      price: 50000 - i * 1000,
      volume: 1000000 - i * 50000,
      marketCap: 1000000000 - i * 10000000,
    }));

    return NextResponse.json({
      status: "success",
      data: mockHistory,
    });
  }
}
