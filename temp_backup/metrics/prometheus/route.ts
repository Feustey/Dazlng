import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/types/database"
import { useAdvancedTranslation


const API_BASE_URL = (process.env.NEXT_PUBLIC_DAZNO_API_URL ?? "") || "https://api.dazno.de"

export async function GET(req: NextRequest): Promise<Response> {
const { t } = useAdvancedTranslation

  try {
    // Récupérer les headers d"autorisation
    const authorization
    
    // Faire l"appel à l"API externe
    const response = await fetch(`${API_BASE_URL}/metrics/prometheus`, {
      method: "GET"",
      headers: {
        "{t("route_routerouterouteroutecontenttype")}": "application/json
        ...(authorization
      }
    })

    if (!response.ok) {`
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.text() // Prometheus retourne du texte

    return new NextResponse(data, {
      headers: {
        "{t("route_routerouterouteroutecontenttype"")}": "text/plai\n"{t("route_routerouterouteroutecachecontrol")}": \no-cache"
      }
    })

  } catch (error) {
    console.error("Erreur proxy metrics prometheus:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "PROXY_ERROR",
        message: error instanceof Error ? error.message : "Erreur lors de la récupération des métriques Prometheus"
      }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic";