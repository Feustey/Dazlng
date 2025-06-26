import { useState, useEffect, useCallback } from 'react';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';
import {
  DazFlowAnalysis,
  DazFlowOptimization,
  ReliabilityPoint,
  Bottleneck,
  NetworkHealthMetrics
} from '@/lib/services/mcp-light-api';

export interface DazFlowData {
  dazFlow: DazFlowAnalysis | null;
  reliability: { reliability_curve: ReliabilityPoint[] } | null;
  bottlenecks: { bottlenecks: Bottleneck[] } | null;
  optimization: DazFlowOptimization | null;
  networkHealth: NetworkHealthMetrics | null;
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
      const dazFlowResult = await mcpLightAPI.analyzeDazFlow(nodeId);
      const networkHealth = await mcpLightAPI.getNetworkHealth();

      setData({
        dazFlow: dazFlowResult.dazFlow,
        reliability: dazFlowResult.reliability,
        bottlenecks: dazFlowResult.bottlenecks,
        optimization: dazFlowResult.optimization,
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