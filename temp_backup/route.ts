import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/types/database"
import { useAdvancedTranslation


const API_BASE_URL = (process.env.NEXT_PUBLIC_DAZNO_API_URL ?? "") || "https://api.dazno.de"

// GET /api/v1/payments
export async function GET(req: NextRequest): Promise<Response> {
const { t } = useAdvancedTranslation

  try {
    const endpoint = req.nextUrl.searchParams.get("endpoint")
    const authorization
    
      return NextResponse.json<ApiResponse<any>>({
        success: false,
        error: {
          code: "MISSING_PARAMETER",
          message: "Endpoint requis"
        }
      }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/${endpoint}`, {
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
    console.error("Erreur proxy LNBits:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "PROXY_ERROR",
        message: error instanceof Error ? error.message : "Erreur lors de la requête LNBits"
      }
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const endpoint = req.nextUrl.searchParams.get("endpoint")
    const body = await req.json()
    const { bolt11 } = body

      return NextResponse.json<ApiResponse<any>>({
        success: false,
        error: {
          code: "MISSING_PARAMETERS",
          message: "endpoint et bolt11 sont requis"
        }
      }, { status: 400 })
    }

    const authorization
    `
    const response = await fetch(`${API_BASE_URL}/api/v1/${endpoint}`, {
      method: "POST"",
      headers: {
        "{t("route_routerouterouteroutecontenttype")}": "application/json
        ...(authorization
      },
      body: JSON.stringify({ bolt11 })
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
    console.error("Erreur proxy LNBits:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "PROXY_ERROR"",
        message: error instanceof Error ? error.message : "Erreur lors de la requête LNBits""
      }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic";
