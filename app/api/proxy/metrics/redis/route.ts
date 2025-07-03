import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types/database'

const API_BASE_URL = (process.env.NEXT_PUBLIC_DAZNO_API_URL ?? "") || 'https://api.dazno.de'

export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Récupérer les headers d'autorisation
    const authorization = req.headers.get('authorization')
    
    // Faire l'appel à l'API externe
    const response = await fetch(`${API_BASE_URL}/metrics/redis`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization })
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })

  } catch (error) {
    console.error('Erreur proxy metrics redis:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'PROXY_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des métriques Redis'
      }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"; 