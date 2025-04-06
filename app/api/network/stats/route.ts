"use server";

import { NextRequest, NextResponse } from "next/server";
import { prismaService } from "@/app/services/prismaService";
import { rateLimit } from "@/app/middleware/rateLimit";
import Logger from "@/app/utils/logger";
import { z } from "zod";
import { checkDatabaseConnection } from "@/app/lib/db";

// Schéma de validation pour les paramètres de requête
const querySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
});

export async function GET(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Vérification de la connexion à la base de données
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      Logger.error("Database connection failed", { request: req });
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Vérification du rate limit
    const isAllowed = await rateLimit(req);
    if (!isAllowed) {
      Logger.warn("Rate limit exceeded", { request: req });
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Validation des paramètres de requête
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const validatedParams = querySchema.safeParse(searchParams);

    if (!validatedParams.success) {
      Logger.warn("Invalid query parameters", {
        request: req,
        errors: validatedParams.error.errors,
      });
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validatedParams.error.errors,
        },
        { status: 400 }
      );
    }

    // Récupération des statistiques
    Logger.info("Fetching network stats", { request: req });
    const stats = await prismaService.getNetworkStats();

    const duration = Date.now() - startTime;
    Logger.info("Network stats fetched successfully", {
      request: req,
      duration,
      statsCount: stats.totalNodes,
    });

    return NextResponse.json(stats);
  } catch (error) {
    const duration = Date.now() - startTime;
    Logger.error("Error fetching network stats", {
      request: req,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      duration,
    });

    return NextResponse.json(
      {
        error: "Failed to fetch network stats",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
