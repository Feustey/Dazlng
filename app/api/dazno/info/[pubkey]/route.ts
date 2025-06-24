import { NextRequest, NextResponse } from 'next/server'
import { createDaznoApiClient } from '@/lib/services/dazno-api'
import { ApiResponse } from '@/types/database'
import { DaznoNodeInfoDetailed } from '@/types/dazno-api'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params
    const pubkey = resolvedParams.pubkey

    const daznoApi = createDaznoApiClient()
    await daznoApi.initialize()

    const data = await daznoApi.getNodeInfo(pubkey)

    return NextResponse.json<ApiResponse<DaznoNodeInfoDetailed>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })

  } catch (error) {
    console.error('Erreur informations nœud:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'EXTERNAL_API_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des informations du nœud'
      }
    }, { status: 500 })
  }
}
