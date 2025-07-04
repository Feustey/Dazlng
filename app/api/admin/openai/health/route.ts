import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from '@/lib/middleware';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const DAZNO_API_BASE_URL = (process.env.DAZNO_API_BASE_URL ?? "") || "https://api.dazno.de";
const DAZNO_API_TOKEN = process.env.DAZNO_API_TOKEN ?? "";

async function getHealthHandler(_req: NextRequest, _user: SupabaseUser): Promise<Response> {
  try {
    // Appeler l'API Dazno pour l'état de santé détaillé
    const response = await fetch(
      `${DAZNO_API_BASE_URL}/api/v1/backoffice/health/detailed`,
      {
        headers: {
          Authorization: `Bearer ${DAZNO_API_TOKEN}`,
          "admin.adminadmincontenttype": "application/json",
        },
        // Pas de cache pour l'état de santé
        cache: "no-store"
      }
    );
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur API Dazno health:", errorData);
      return NextResponse.json(
        { error: "Erreur lors de la récupération de l'état de santé" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erreur dans l'endpoint health:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getHealthHandler);

export const dynamic = "force-dynamic";