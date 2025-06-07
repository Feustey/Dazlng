import { NextRequest, NextResponse } from 'next/server'
import { daznoAPI } from '@/lib/services/dazno-api'
import { ApiResponse } from '@/types/database'
import { DaznoPriorityRequest, DaznoPriorityResponse } from '@/types/dazno-api'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params
    const pubkey = resolvedParams.pubkey
    
    if (!daznoAPI.isValidPubkey(pubkey)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_PUBKEY',
          message: 'Clé publique invalide'
        }
      }, { status: 400 })
    }

    const body: DaznoPriorityRequest = await req.json()
    
    // Validation des paramètres
    if (!body.context || !body.goals) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'Paramètres manquants: context et goals sont requis'
        }
      }, { status: 400 })
    }

    const data = await daznoAPI.getPriorityActions(pubkey, body)

    return NextResponse.json<ApiResponse<DaznoPriorityResponse>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })

  } catch (error) {
    console.error('Erreur actions prioritaires:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'EXTERNAL_API_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de la génération des actions prioritaires'
      }
    }, { status: 500 })
  }
} 