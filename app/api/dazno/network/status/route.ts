import { NextRequest, NextResponse } from 'next/server'

const MCP_API_BASE_URL = process.env.MCP_LIGHT_API_URL || 'https://api.dazno.de'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    version: string
    source?: string
  }
}

interface NetworkStatus {
  source: string
  timestamp: string
  network_stats: {
    num_nodes: number
    num_channels: number
    total_network_capacity: string
    avg_channel_size: string
    graph_diameter: number
    avg_out_degree: number
  }
  health_indicators: {
    total_capacity_btc: number
    avg_channel_size_btc: number
    node_density: number
    network_reach: number
  }
}

export async function GET(_request: NextRequest): Promise<Response> {
  try {
    // Headers pour l'authentification avec l'API MCP-Light
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'DazNode/1.0',
    }

    // Ajouter l'authentification si disponible
    if (process.env.MCP_LIGHT_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.MCP_LIGHT_API_TOKEN}`
    }

    // Appel à l'endpoint du statut réseau MCP-Light v2.0
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(`${MCP_API_BASE_URL}/api/v1/network/status`, {
      headers,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Trop de requêtes, veuillez réessayer plus tard'
          }
        }, { status: 429 })
      }

      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const networkData = await response.json()

    // Validation et structuration des données
    const networkStatus: NetworkStatus = {
      source: networkData.source || 'mcp-light',
      timestamp: networkData.timestamp || new Date().toISOString(),
      network_stats: {
        num_nodes: networkData.network_stats?.num_nodes || 0,
        num_channels: networkData.network_stats?.num_channels || 0,
        total_network_capacity: networkData.network_stats?.total_network_capacity || '0',
        avg_channel_size: networkData.network_stats?.avg_channel_size || '0',
        graph_diameter: networkData.network_stats?.graph_diameter || 0,
        avg_out_degree: networkData.network_stats?.avg_out_degree || 0
      },
      health_indicators: {
        total_capacity_btc: networkData.health_indicators?.total_capacity_btc || 0,
        avg_channel_size_btc: networkData.health_indicators?.avg_channel_size_btc || 0,
        node_density: networkData.health_indicators?.node_density || 0,
        network_reach: networkData.health_indicators?.network_reach || 0
      }
    }

    return NextResponse.json<ApiResponse<NetworkStatus>>({
      success: true,
      data: networkStatus,
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        source: 'mcp-light-network'
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération du statut réseau:', error)

    // Données de fallback pour le réseau
    const fallbackNetworkStatus: NetworkStatus = {
      source: 'fallback',
      timestamp: new Date().toISOString(),
      network_stats: {
        num_nodes: 15000,
        num_channels: 85000,
        total_network_capacity: '5000000000000',
        avg_channel_size: '5882352',
        graph_diameter: 7,
        avg_out_degree: 8.5
      },
      health_indicators: {
        total_capacity_btc: 50000.0,
        avg_channel_size_btc: 0.05882352,
        node_density: 0.176,
        network_reach: 7
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'

    return NextResponse.json<ApiResponse<NetworkStatus>>({
      success: false,
      data: fallbackNetworkStatus,
      error: {
        code: 'EXTERNAL_API_ERROR',
        message: 'Service de statut réseau temporairement indisponible',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0',
        source: 'fallback'
      }
    }, { status: 503 })
  }
} 