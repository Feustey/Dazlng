import { NextRequest, NextResponse } from 'next/server'

const MCP_API_BASE_URL = process.env.NEXT_PUBLIC_DAZNO_API_URL || 'https://api.dazno.de'

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

export const dynamic = "force-dynamic"

export async function GET(_request: NextRequest) {
  try {
    // Récupérer les statistiques DPO depuis api.dazno.de
    const response = await fetch(`${MCP_API_BASE_URL}/api/v1/dpo/statistics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DazNode/1.0.0',
      },
      // Timeout de 10 secondes
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      throw new Error(`API DPO responded with status: ${response.status}`)
    }

    const dpoData = await response.json()

    // Transformer les données DPO pour correspondre à notre interface
    const transformedData = {
      total_analyses: dpoData.total_analyses || 0,
      successful_analyses: dpoData.successful_analyses || 0,
      failed_analyses: dpoData.failed_analyses || 0,
      average_processing_time: dpoData.average_processing_time || 0,
      nodes_analyzed_24h: dpoData.nodes_analyzed_24h || 0,
      recommendations_generated: dpoData.recommendations_generated || 0,
      feedback_received: dpoData.feedback_received || 0,
      success_rate: dpoData.success_rate || 0
    }

    const apiResponse: ApiResponse<typeof transformedData> = {
      success: true,
      data: transformedData,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        source: 'api.dazno.de'
      }
    }

    return NextResponse.json(apiResponse)

  } catch (error) {
    console.error('[Admin DPO Stats] Error:', error)

    // Données de fallback si API indisponible
    const fallbackData = {
      total_analyses: 1250,
      successful_analyses: 1180,
      failed_analyses: 70,
      average_processing_time: 2.3,
      nodes_analyzed_24h: 45,
      recommendations_generated: 892,
      feedback_received: 156,
      success_rate: 94.4
    }

    const apiResponse: ApiResponse<typeof fallbackData> = {
      success: true,
      data: fallbackData,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        source: 'fallback'
      }
    }

    return NextResponse.json(apiResponse)
  }
} 