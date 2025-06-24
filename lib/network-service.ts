import { mcpClient } from './api-client';
import { NetworkSummary, OptimizationResult } from './network-types';

export class NetworkService {
  static async getNetworkSummary(): Promise<NetworkSummary> {
    try {
      return await mcpClient.getNetworkSummary();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async optimizeNode(nodeId: string): Promise<OptimizationResult> {
    try {
      return await mcpClient.optimizeNode(nodeId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): never {
    const err = error as { response?: { status?: number; data?: { code?: string; message?: string } } };
    const errorResponse = {
      status: err.response?.status || 500,
      code: err.response?.data?.code || 'UNKNOWN_ERROR',
      message: err.response?.data?.message || 'Une erreur est survenue'
    };
    throw errorResponse;
  }
}
