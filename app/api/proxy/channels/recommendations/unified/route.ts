import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types/database'
import { logger } from '@/lib/logger'
import { MCPLightAPI } from '@/lib/services/dazno-api'

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Récupérer le body de la requête
    const body = await req.json()
    
    // Récupérer les headers d'autorisation
    const authorization = req.headers.get('authorization')
    const apiKey = authorization?.replace('Bearer ', '')
    
    // Créer l'instance de l'API avec la clé d'API si disponible
    const daznoApi = new MCPLightAPI({
      apiKey
    })

    // Récupérer les recommandations unifiées
    const data = await daznoApi.getUnifiedRecommendations(body)

    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })

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
