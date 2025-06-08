import { NextRequest, NextResponse } from 'next/server'

const MCP_API_BASE_URL = process.env.MCP_LIGHT_API_URL || 'https://api.dazno.de'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    version: string
    source?: string
  }
}

interface Alert {
  type: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  suggested_action: string
  channel_id?: string
  metric_value: number
  threshold: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params
    const { pubkey } = resolvedParams
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get('severity')

    // Validation de la clé publique
    if (!pubkey || pubkey.length !== 66 || !/^[0-9a-fA-F]{66}$/.test(pubkey)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Format de clé publique invalide'
        }
      }, { status: 400 })
    }

    // Headers pour l'authentification avec l'API MCP-Light
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'DazNode/1.0',
    }

    // Ajouter l'authentification si disponible
    if (process.env.MCP_LIGHT_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.MCP_LIGHT_API_TOKEN}`
    }

    // Construire l'URL avec les paramètres
    const url = new URL(`${MCP_API_BASE_URL}/api/v1/node/${pubkey}/alerts`)
    if (severity) {
      url.searchParams.set('severity', severity)
    }

    // Appel à l'endpoint des alertes MCP-Light v2.0
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(url.toString(), {
      headers,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json<ApiResponse<Alert[]>>({
          success: true,
          data: [],
          meta: {
            timestamp: new Date().toISOString(),
            version: '2.0',
            source: 'empty'
          }
        })
      }

      if (response.status === 429) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Trop de requêtes, veuillez réessayer plus tard'
          }
        }, { status: 429 })
      }

      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const alertsData = await response.json()
    const alerts: Alert[] = Array.isArray(alertsData) ? alertsData : []

    return NextResponse.json<ApiResponse<Alert[]>>({
      success: true,
      data: alerts,
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        source: 'mcp-light-alerts'
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error)

    // Alertes de fallback
    const fallbackAlerts: Alert[] = [
      {
        type: 'api_unavailable',
        severity: 'warning',
        message: 'Service d\'alertes temporairement indisponible',
        suggested_action: 'Vérifiez votre connexion et réessayez plus tard',
        metric_value: 0,
        threshold: 1
      }
    ]

    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'

    return NextResponse.json<ApiResponse<Alert[]>>({
      success: false,
      data: fallbackAlerts,
      error: {
        code: 'EXTERNAL_API_ERROR',
        message: 'Service d\'alertes temporairement indisponible',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        source: 'fallback'
      }
    }, { status: 503 })
  }
} 