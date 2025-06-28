/**
 * Client API Dazno.de pour l'analyse Lightning Network
 * Intègre SparkSeer + OpenAI pour des recommandations complètes
 */

import { 
  DaznoCompleteResponse, 
  DaznoPriorityRequest, 
  DaznoPriorityResponse,
  DaznoNodeInfoDetailed,
  DaznoRecommendationsResponse,
  DaznoAuthCredentials,
  isDaznoValidContext,
  isDaznoValidGoal,
} from '@/types/dazno-api'
import { logger } from '@/lib/logger';
import { InvoiceStatus } from '@/types/lightning';

export interface DaznoApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface DaznoApiResponse<T> {
  success: boolean;
  data: T;
  error?: DaznoApiError;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface NodeMetrics {
  channels: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
  };
  capacity: {
    total: number;
    avg_channel: number;
    max_channel: number;
  };
  revenue: {
    fees_24h: number;
    fees_7d: number;
    fees_30d: number;
  };
  performance: {
    success_rate: number;
    routing_score: number;
    uptime: number;
  };
  network: {
    centrality: number;
    betweenness: number;
    degree: number;
  };
}

export interface NodeStatus {
  pubkey: string;
  alias: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  channels?: number;
  capacity?: number;
  metrics?: {
    availability: number;
    reliability: number;
    performance: number;
  };
}

export interface NodesExplorer {
  nodes: NodeStatus[];
  total: number;
  page: number;
  limit: number;
}

export interface Rankings {
  byCapacity: Array<{ pubkey: string; capacity: number }>;
  byChannels: Array<{ pubkey: string; channels: number }>;
  byRevenue: Array<{ pubkey: string; revenue: number }>;
  byCentrality: Array<{ pubkey: string; centrality: number }>;
}

export interface Calculation {
  sats: number;
  fiat: {
    amount: number;
    currency: string;
  };
  btc: number;
  exchangeRate: {
    btcFiat: number;
    timestamp: string;
  };
}

export interface DecodedInvoice {
  paymentHash: string;
  amount: number;
  description: string;
  timestamp: number;
  expiry: number;
  nodeInfo?: {
    pubkey: string;
    alias?: string;
  };
}

export interface DaznoErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

export interface CreateInvoiceResponse {
  paymentRequest: string;
  paymentHash: string;
  amount: number;
  expiresAt: string;
  createdAt: string;
}

export interface CheckPaymentResponse {
  status: InvoiceStatus;
}

export interface DaznoServiceStatus {
  name: string;
  status: 'up' | 'down' | 'degraded';
  latency?: number;
  lastCheck?: string;
}

export interface DaznoHealthResponse {
  status: string;
  timestamp: string;
  services?: DaznoServiceStatus[];
}

export interface ExplorerNode {
  pubkey: string;
  alias: string;
  rank: number;
  capacity: number;
  channels: number;
  fees: {
    avg_base_fee: number;
    avg_fee_rate: number;
  };
  last_update: string;
}

export interface NetworkRanking {
  pubkey: string;
  alias: string;
  rank: number;
  score: number;
}

const isValidLightningPubkey = (pubkey: string): boolean => {
  return /^[0-9a-fA-F]{66}$/.test(pubkey)
}

export class MCPLightAPI {
  private baseUrl: string;
  private apiKey?: string;

  constructor(config?: { baseUrl?: string; apiKey?: string }) {
    this.baseUrl = config?.baseUrl || 'https://api.dazno.de';
    this.apiKey = config?.apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...options.headers
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      logger.error('MCPLightAPI Error:', error);
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getNodeMetrics(pubkey: string): Promise<NodeMetrics> {
    return this.request<NodeMetrics>(`/api/v1/node/${pubkey}/metrics`);
  }

  async getNodeStatus(pubkey: string): Promise<NodeStatus> {
    return this.request<NodeStatus>(`/api/v1/node/${pubkey}/status/complete`);
  }

  async createInvoice(params: { amount: number; description: string; expiresIn?: number }) {
    return this.request<CreateInvoiceResponse>('/api/v1/lightning/invoice', {
      method: 'POST',
      body: JSON.stringify({
        amount: params.amount,
        description: params.description,
        expires_in: params.expiresIn || 300,
      })
    });
  }

  async checkPayment(paymentHash: string): Promise<InvoiceStatus> {
    const data = await this.request<CheckPaymentResponse>(`/api/v1/lightning/invoice/${paymentHash}`);
    return data.status;
  }

  async getExplorerNodes(params: { search?: string; sortBy?: string; limit?: number; offset?: number }): Promise<{ nodes: ExplorerNode[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.set('search', params.search);
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.offset) queryParams.set('offset', params.offset.toString());

    return this.request<{ nodes: ExplorerNode[]; total: number }>(`/api/v1/explorer/nodes?${queryParams}`);
  }

  async getNetworkRankings(category: string): Promise<NetworkRanking[]> {
    return this.request<NetworkRanking[]>(`/api/v1/rankings/${category}`);
  }

  async getRecommendations(pubkey: string): Promise<DaznoRecommendationsResponse> {
    if (!isValidLightningPubkey(pubkey)) {
      throw new Error('Invalid Lightning pubkey format');
    }
    return this.request<DaznoRecommendationsResponse>(`/v1/node/${pubkey}/recommendations`);
  }

  async getUnifiedRecommendations(params: { pubkey: string }): Promise<unknown> {
    return this.request('/api/v1/channels/recommendations/unified', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }
}

// Export une instance par défaut du client API
export const daznoApi = new MCPLightAPI();

// Export une fonction factory pour créer de nouvelles instances
export const createDaznoApiClient = (config?: { baseUrl?: string; apiKey?: string }) => {
  return new MCPLightAPI(config);
}; 