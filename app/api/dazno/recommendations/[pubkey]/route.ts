import { NextRequest, NextResponse } from 'next/server'
import { createDaznoApiClient } from '@/lib/services/dazno-api'
import { ApiResponse } from '@/types/database'
import { DaznoRecommendationsResponse } from '@/types/dazno-api'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params
    const pubkey = resolvedParams.pubkey

    const daznoApi = createDaznoApiClient()
    const data = await daznoApi.getRecommendations(pubkey)

    return NextResponse.json<ApiResponse<DaznoRecommendationsResponse>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })

  } catch (error) {
    console.error('Erreur recommandations:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'EXTERNAL_API_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des recommandations'
      }
    }, { status: 500 })
  }
}
