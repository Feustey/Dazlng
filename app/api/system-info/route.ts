import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Collecter des informations sur l'environnement
    const systemInfo = {
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      environmentVariables: {
        MCP_API_URL: process.env.MCP_API_URL ? "Définie" : "Non définie",
        NEXT_PUBLIC_MCP_API_URL: process.env.NEXT_PUBLIC_MCP_API_URL
          ? "Définie"
          : "Non définie",
        NODE_PUBKEY: process.env.NODE_PUBKEY ? "Définie" : "Non définie",
        MONGODB_URI: process.env.MONGODB_URI ? "Définie" : "Non définie",
      },
      userAgent: process.env.HTTP_USER_AGENT || "Non disponible",
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(
          process.memoryUsage().heapTotal / 1024 / 1024
        )} MB`,
        heapUsed: `${Math.round(
          process.memoryUsage().heapUsed / 1024 / 1024
        )} MB`,
        external: `${Math.round(
          process.memoryUsage().external / 1024 / 1024
        )} MB`,
      },
      uptime: `${Math.floor(process.uptime())} secondes`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(systemInfo);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la récupération des informations système",
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
