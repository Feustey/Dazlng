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

const isValidLightningPubkey = (pubkey: string): boolean => {
  return /^[0-9a-fA-F]{66}$/.test(pubkey)
}

export interface DaznoApiClient {
  getNodeStatus: (pubkey: string) => Promise<NodeStatus>;
  createInvoice: (params: { amount: number; description: string; expiresIn?: number }) => Promise<{
    paymentRequest: string;
    paymentHash: string;
  }>;
  checkPayment: (paymentHash: string) => Promise<InvoiceStatus>;
}

export function createDaznoApiClient(config?: { baseUrl?: string; apiKey?: string }): DaznoApiClient {
  const baseUrl = config?.baseUrl || 'https://api.dazno.de';
  const apiKey = config?.apiKey;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      logger.error('DaznoAPI Error:', error);
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  return {
    async getNodeStatus(pubkey: string): Promise<NodeStatus> {
      const response = await fetch(`${baseUrl}/api/v1/node/${pubkey}/status/complete`, {
        headers,
      });
      return handleResponse<NodeStatus>(response);
    },

    async createInvoice(params: { amount: number; description: string; expiresIn?: number }) {
      const response = await fetch(`${baseUrl}/api/v1/lightning/invoice`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: params.amount,
          description: params.description,
          expires_in: params.expiresIn || 300,
        }),
      });
      return handleResponse<{ paymentRequest: string; paymentHash: string }>(response);
    },

    async checkPayment(paymentHash: string): Promise<InvoiceStatus> {
      const response = await fetch(`${baseUrl}/api/v1/lightning/invoice/${paymentHash}`, {
        headers,
      });
      const data = await handleResponse<{ status: InvoiceStatus }>(response);
      return data.status;
    },
  };
}

// Export une instance par défaut du client API
export const daznoApi = createDaznoApiClient();

// Export la classe pour les types
export default DaznoApiClient; 