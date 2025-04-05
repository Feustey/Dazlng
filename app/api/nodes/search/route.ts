import { NextResponse } from "next/server";
import { prisma, checkDatabaseConnection } from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Le paramètre de recherche est requis" },
        { status: 400 }
      );
    }

    // Validation de la longueur de la requête
    if (query.length < 3) {
      return NextResponse.json(
        { error: "La recherche doit contenir au moins 3 caractères" },
        { status: 400 }
      );
    }

    // Vérification de la connexion à la base de données
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Erreur de connexion à la base de données" },
        { status: 503 }
      );
    }

    const nodes = await prisma.node.findMany({
      where: {
        OR: [
          { alias: { contains: query, mode: "insensitive" } },
          { pubkey: { contains: query, mode: "insensitive" } },
          { platform: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        pubkey: true,
        alias: true,
        platform: true,
        version: true,
        total_capacity: true,
        active_channels: true,
        total_peers: true,
        uptime: true,
      },
      take: 10,
      orderBy: {
        total_capacity: "desc",
      },
      cacheStrategy: {
        swr: 60, // Stale-while-revalidate pendant 60 secondes
        ttl: 300, // Time-to-live de 5 minutes
      },
    });

    if (!nodes || nodes.length === 0) {
      return NextResponse.json(
        { message: "Aucun résultat trouvé", results: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(nodes);
  } catch (error) {
    console.error("Erreur lors de la recherche des nœuds:", error);

    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error) {
      if (error.name === "PrismaClientInitializationError") {
        return NextResponse.json(
          { error: "Erreur de connexion à la base de données" },
          { status: 503 }
        );
      }
      if (error.name === "PrismaClientKnownRequestError") {
        return NextResponse.json(
          { error: "Erreur lors de la requête à la base de données" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la recherche" },
      { status: 500 }
    );
  }
}
