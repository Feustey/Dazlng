import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requêtes par minute

export async function rateLimit(req: NextRequest) {
  const ip = req.ip || "unknown";
  const route = req.nextUrl.pathname;

  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_SIZE);

    // Récupérer ou créer l'entrée de rate limit
    let rateLimit = await prisma.rateLimit.findFirst({
      where: {
        ip,
        route,
        resetAt: {
          gt: now,
        },
      },
    });

    if (!rateLimit) {
      rateLimit = await prisma.rateLimit.create({
        data: {
          ip,
          route,
          count: 1,
          resetAt: new Date(now.getTime() + WINDOW_SIZE),
        },
      });
      return true;
    }

    // Vérifier si on a dépassé la limite
    if (rateLimit.count >= MAX_REQUESTS) {
      return false;
    }

    // Incrémenter le compteur
    await prisma.rateLimit.update({
      where: { id: rateLimit.id },
      data: { count: rateLimit.count + 1 },
    });

    return true;
  } catch (error) {
    console.error("Rate limit error:", error);
    return true; // En cas d'erreur, on laisse passer la requête
  }
}
