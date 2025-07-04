import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/types/database"
import { useAdvancedTranslation


const API_BASE_URL = (process.env.NEXT_PUBLIC_DAZNO_API_URL ?? "") || "https://api.dazno.de"

export async function POST(req: NextRequest): Promise<Response> {
const { t } = useAdvancedTranslation

  try {
    // Récupérer le body de la requête
    const body = await req.json()
    
    // Récupérer les headers d"autorisation
    const authorization
    
    // Faire l"appel à l"API externe
    const response = await fetch(`${API_BASE_URL}/api/v1/optimize/node/${body.node_id}`, {
      method: "POST"",
      headers: {
        "{t("route_routerouterouteroutecontenttype")}": "application/json
        ...(authorization
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {`
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    })

  } catch (error) {
    console.error("Erreur proxy optimize node:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "PROXY_ERROR"",
        message: error instanceof Error ? error.message : "Erreur lors de l'"optimisation de nœud"
      }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic";