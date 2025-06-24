import { NextRequest, NextResponse } from 'next/server'
import { createDaznoApiClient } from '@/lib/services/dazno-api'
import { ApiResponse } from '@/types/database'
import { DaznoCompleteResponse, DaznoPriorityRequest } from '@/types/dazno-api'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url)
    const context = searchParams.get('context') as DaznoPriorityRequest['context'] || 'intermediate'
    const goals = searchParams.getAll('goals') as DaznoPriorityRequest['goals'] || ['increase_revenue']

    const resolvedParams = await params
    const pubkey = resolvedParams.pubkey

    const daznoApi = createDaznoApiClient()
    await daznoApi.initialize()

    if (!daznoApi.isValidPubkey(pubkey)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_PUBKEY',
          message: 'Clé publique invalide'
        }
      }, { status: 400 })
    }

    const data = await daznoApi.getCompleteNodeAnalysis(pubkey, context, goals)

    return NextResponse.json<ApiResponse<DaznoCompleteResponse>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })

  } catch (error) {
    console.error('Erreur analyse complète nœud:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'EXTERNAL_API_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'analyse du nœud'
      }
    }, { status: 500 })
  }
}
