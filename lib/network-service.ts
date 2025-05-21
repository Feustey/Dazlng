import apiClient from './api-client';
import { NetworkSummary, OptimizationResult } from './network-types';

export class NetworkService {
  static async getNetworkSummary(): Promise<NetworkSummary> {
    try {
      const response = await apiClient.get<NetworkSummary>('/summary');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async optimizeNode(nodeId: string): Promise<OptimizationResult> {
    try {
      const response = await apiClient.post<OptimizationResult>(
        `/node/${nodeId}/optimize`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: any): never {
    const errorResponse = {
      status: error.response?.status || 500,
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || 'Une erreur est survenue'
    };
    throw errorResponse;
  }
} 