import { NextRequest, NextResponse } from 'next/server'
import { daznoAPI } from '@/lib/services/dazno-api'
import { ApiResponse } from '@/types/database'
import { DaznoNodeInfoDetailed } from '@/types/dazno-api'

export async function GET(
  req: NextRequest,
  { params }: { params: { pubkey: string } }
): Promise<Response> {
  try {
    const pubkey = params.pubkey

    if (!daznoAPI.isValidPubkey(pubkey)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_PUBKEY',
          message: 'Clé publique invalide'
        }
      }, { status: 400 })
    }

    const data = await daznoAPI.getNodeInfo(pubkey)

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