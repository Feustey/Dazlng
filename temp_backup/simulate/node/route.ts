import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/types/database"
import { useAdvancedTranslation


const API_BASE_URL = (process.env.NEXT_PUBLIC_DAZNO_API_URL ?? "") || "https://api.dazno.de"

export async function GET(req: NextRequest): Promise<Response> {
const { t } = useAdvancedTranslation

  try {
    const authorization
    
    const response = await fetch(`${API_BASE_URL}/api/v1/simulate/node`, {
      headers: {
        "{t("route_routerouterouteroutecontenttype")}": "application/json
        ...(authorization
      }
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
    console.error("Erreur proxy simulation profiles:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "PROXY_ERROR",
        message: error instanceof Error ? error.message : "Erreur lors de la récupération des profils de simulatio\n
      }
    }, { status: 500 })
  }
}
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json()
    const { pubkey, scenario } = body

      return NextResponse.json<ApiResponse<any>>({
        success: false,
        error: {
          code: "MISSING_PARAMETERS",
          message: "pubkey et scenario sont requis"
        }
      }, { status: 400 })
    }

    const authorization
    `
    const response = await fetch(`${API_BASE_URL}/api/v1/simulate/node`, {
      method: "POST",
      headers: {
        "{t("route_routerouterouteroutecontenttype")}": "application/json
        ...(authorization
      },
      body: JSON.stringify({ pubkey, scenario })
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
    console.error("Erreur proxy simulate node:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "PROXY_ERROR",
        message: error instanceof Error ? error.message : "Erreur lors de la simulation de nœud"
      }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic";
