import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types/database'
import { logger } from '@/lib/logger'

const API_BASE_URL = (process.env.NEXT_PUBLIC_DAZNO_API_URL ?? "") || 'https://api.dazno.de'
const FALLBACK_API_URL = 'https://fallback-api.dazno.de'

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Récupérer le body de la requête
    const body = await req.json()
    
    // Récupérer les headers d'autorisation
    const authorization = req.headers.get('authorization')
    
    // Configuration de la requête
    const requestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization })
      },
      body: JSON.stringify(body)
    }

    // Essayer l'API principale
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/channels/recommendations/unified`, requestConfig)
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json<ApiResponse<unknown>>({
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0'
          }
        })
      }
      
      logger.warn(`API principale indisponible (${response.status}), tentative avec fallback...`)
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    } catch (mainApiError) {
      // Essayer l'API de fallback
      const fallbackResponse = await fetch(`${FALLBACK_API_URL}/api/v1/channels/recommendations/unified`, requestConfig)
      
      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API Error: ${fallbackResponse.status} - ${fallbackResponse.statusText}`)
      }

      const fallbackData = await fallbackResponse.json()
      return NextResponse.json<ApiResponse<unknown>>({
        success: true,
        data: fallbackData,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          source: 'fallback'
        }
      })
    }

  } catch (error) {
    logger.error('Erreur proxy unified recommendations:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'PROXY_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des recommandations unifiées',
        details: error instanceof Error ? error.stack : undefined
      }
    }, { status: 502 })
  }
}
