import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from '@/lib/middleware';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const DAZNO_API_BASE_URL = (process.env.DAZNO_API_BASE_URL ?? "") || "https://api.dazno.de";
const DAZNO_API_TOKEN = process.env.DAZNO_API_TOKEN ?? "";

async function getRealtimeMetricsHandler(_req: NextRequest, _user: SupabaseUser): Promise<Response> {
  try {
    // Appeler l'API Dazno pour les métriques temps réel
    const response = await fetch(
      `${DAZNO_API_BASE_URL}/api/v1/backoffice/metrics/realtime`,
      {
        headers: {
          Authorization: `Bearer ${DAZNO_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        // Pas de cache pour les données temps réel
        cache: "no-store"
      }
    );
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur API Dazno realtime:", errorData);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des métriques temps réel" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erreur dans l'endpoint realtime metrics:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getRealtimeMetricsHandler);