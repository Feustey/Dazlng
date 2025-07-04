import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/types/database"
import { useAdvancedTranslation


const API_BASE_URL = (process.env.NEXT_PUBLIC_DAZNO_API_URL ?? "") || "https://api.dazno.de"

export async function POST(req: NextRequest): Promise<Response> {
const { t } = useAdvancedTranslation

  try {
    const body = await req.json()
    const authorization
    
    const response = await fetch(`${API_BASE_URL}/rag/documents`, {
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
    console.error("Erreur proxy RAG documents:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "PROXY_ERROR"",
        message: error instanceof Error ? error.message : "Erreur lors de la création du document RAG"
      }
    }, { status: 500 })
  }
}
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const documentId = req.nextUrl.searchParams.get("id")
      return NextResponse.json<ApiResponse<any>>({
        success: false,
        error: {
          code: "MISSING_PARAMETER",
          message: "ID du document requis"
        }
      }, { status: 400 })
    }

    const authorization
    `
    const response = await fetch(`${API_BASE_URL}/rag/documents/${documentId}`, {
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
    console.error("Erreur proxy RAG document:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "PROXY_ERROR"",
        message: error instanceof Error ? error.message : "Erreur lors de la récupération du document RAG""
      }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic";
