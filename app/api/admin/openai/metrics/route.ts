import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from '@/lib/middleware';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const DAZNO_API_BASE_URL = process.env.DAZNO_API_BASE_URL ?? "" || "https://api.dazno.de";
const DAZNO_API_TOKEN = process.env.DAZNO_API_TOKEN ?? "";

async function getMetricsHandler(req: NextRequest, _user: SupabaseUser): Promise<Response> {
  try {
    // Récupérer les paramètres de la requête
    const searchParams = req.nextUrl.searchParams;
    const periodDays = searchParams.get("period_days") || "30";

    // Appeler l'API Dazno
    const response = await fetch(
      `${DAZNO_API_BASE_URL}/api/v1/backoffice/metrics?period_days=${periodDays}`,
      {
        headers: {
          Authorization: `Bearer ${DAZNO_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
};
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur API Dazno:", errorData);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des métriques" },
        { status: response.status }
};
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erreur dans l'endpoint metrics:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
};
  }
}

export const GET = withAdmin(getMetricsHandler);