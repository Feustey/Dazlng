import { useState, useEffect, useCallback } from 'react';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';
import {
  DazFlowAnalysis,
  DazFlowOptimizationResponse,
  ReliabilityPoint,
  Bottleneck,
  NetworkHealthAnalysis
} from '@/lib/services/mcp-light-api';

export interface DazFlowData {
  dazFlow: DazFlowAnalysis | null;
  reliability: { reliability_curve: ReliabilityPoint[] } | null;
  bottlenecks: { bottlenecks: Bottleneck[] } | null;
  optimization: DazFlowOptimizationResponse | null;
  networkHealth: NetworkHealthAnalysis | null;
  loading: boolean;
  error: string | null;
}

export const useDazFlow = (nodeId: string | null) => {
  const [data, setData] = useState<DazFlowData>({
    dazFlow: null,
    reliability: null,
    bottlenecks: null,
    optimization: null,
    networkHealth: null,
    loading: false,
    error: null
  });

  const fetchDazFlowData = useCallback(async () => {
    if (!nodeId) return;

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const dazFlowResult = await mcpLightAPI.getDazFlowAnalysis(nodeId);
      const networkHealth = await mcpLightAPI.getNetworkHealth();

      setData({
        dazFlow: dazFlowResult,
        reliability: { reliability_curve: dazFlowResult.reliability_curve },
        bottlenecks: { bottlenecks: dazFlowResult.bottlenecks },
        optimization: null, // À implémenter si nécessaire
        networkHealth,
        loading: false,
        error: null
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des données DazFlow'
      }));
    }
  }, [nodeId]);

  const refreshData = useCallback(() => {
    fetchDazFlowData();
  }, [fetchDazFlowData]);

  useEffect(() => {
    fetchDazFlowData();
  }, [fetchDazFlowData]);

  return {
    ...data,
    refreshData
  };
}; 