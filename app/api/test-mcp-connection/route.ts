import { NextResponse } from "next/server";

export async function GET() {
  const API_URL = process.env.MCP_API_URL;

  // Vérifier que l'URL de l'API est définie
  if (!API_URL) {
    return new NextResponse(
      JSON.stringify({
        message: "La variable d'environnement MCP_API_URL n'est pas définie",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Tentative de connexion à l'API
    const response = await fetch(`${API_URL}/status`);

    // Informations de débogage
    const debug = {
      url: `${API_URL}/status`,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      envVars: {
        MCP_API_URL: process.env.MCP_API_URL,
      },
    };

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json({
        message: "Connexion à l'API MCP réussie",
        debug,
        data,
      });
    } else {
      return NextResponse.json(
        {
          message: `Erreur de connexion à l\'API MCP: ${response.status} ${response.statusText}`,
          debug,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    // Capture toutes les erreurs de connexion
    return NextResponse.json(
      {
        message: "Erreur lors de la tentative de connexion à l'API MCP",
        error: error instanceof Error ? error.message : String(error),
        envVars: {
          MCP_API_URL: process.env.MCP_API_URL,
        },
      },
      { status: 500 }
    );
  }
}
