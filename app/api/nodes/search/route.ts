import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
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
      cacheStrategy: { swr: 60, ttl: 300 }, // Cache de 5 minutes avec revalidation de 1 minute
    });

    return NextResponse.json(nodes);
  } catch (error) {
    console.error("Erreur lors de la recherche des nœuds:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la recherche" },
      { status: 500 }
    );
  }
}
