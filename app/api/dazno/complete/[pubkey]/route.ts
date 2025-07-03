import { NextRequest, NextResponse } from 'next/server'
import { createDaznoApiClient, NodeStatus } from '@/lib/services/dazno-api'
import { ApiResponse } from '@/types/database'
import { DaznoCompleteResponse, DaznoPriorityRequest } from '@/types/dazno-api'
import { logger } from '@/lib/logger'

export async function GET(
  req: NextRequest,
  { params }: { params: { pubkey: string } }
): Promise<Response> {
  try {
    const { pubkey } = params

    if (!pubkey) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Node pubkey is required'
        }
      }, { status: 400 })
    }

    const daznoApi = createDaznoApiClient({
      apiKey: process.env.DAZNO_API_KEY,
    })

    const nodeInfo = await daznoApi.getNodeStatus(pubkey)

    return NextResponse.json<ApiResponse<NodeStatus>>({
      success: true,
      data: nodeInfo,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    })
  } catch (error) {
    logger.error('Error fetching node info:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An error occurred while fetching node info'
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic";
