import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types/database'

const API_BASE_URL = (process.env.NEXT_PUBLIC_DAZNO_API_URL ?? "") || 'https://api.dazno.de'

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const authorization = req.headers.get('authorization')
    
    const response = await fetch(`${API_BASE_URL}/api/v1/simulate/profiles`, {
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
    console.error('Erreur proxy simulation profiles:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'PROXY_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des profils de simulation'
      }
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json()
    const { pubkey, scenario } = body

    if (!pubkey || !scenario) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'pubkey et scenario sont requis'
        }
      }, { status: 400 })
    }

    const authorization = req.headers.get('authorization')
    
    const response = await fetch(`${API_BASE_URL}/api/v1/simulate/node`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization })
      },
      body: JSON.stringify({ pubkey, scenario })
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
    console.error('Erreur proxy simulation node:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'PROXY_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de la simulation du nœud'
      }
    }, { status: 500 })
  }
}
