import { useState, useCallback } from 'react';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';
import type {
  LightningNode,
  RankingNode,
  GlobalStatsResponse,
  PrioritiesEnhancedResponse,
  CalculatorResponse,
  DecoderResponse,
  ExplorerParams,
  RankingsParams,
  StatsParams,
  CalculatorParams
} from '@/lib/services/mcp-light-api';

interface UseLightningMCPState {
  loading: boolean;
  error: string | null;
}

interface UseLightningMCPReturn extends UseLightningMCPState {
  // Explorer
  searchNodes: (params: ExplorerParams) => Promise<{ nodes: LightningNode[]; total: number; page: number; limit: number } | null>;
  
  // Rankings
  getRankings: (params: RankingsParams) => Promise<RankingNode[] | null>;
  
  // Global Stats
  getGlobalStats: (params?: StatsParams) => Promise<GlobalStatsResponse | null>;
  
  // Priorities Enhanced
  getNodePriorities: (pubkey: string) => Promise<PrioritiesEnhancedResponse | null>;
  
  // Calculator
  calculateConversion: (params: CalculatorParams) => Promise<CalculatorResponse | null>;
  
  // Decoder
  decodeData: (data: string) => Promise<DecoderResponse | null>;
  
  // Utils
  clearError: () => void;
  isLoading: boolean;
}

export const useLightningMCP = (): UseLightningMCPReturn => {
  const [state, setState] = useState<UseLightningMCPState>({
    loading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // 🔍 Explorer de nœuds
  const searchNodes = useCallback(async (params: ExplorerParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mcpLightAPI.getLightningNodes(params);
      setLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la recherche de nœuds';
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setError]);

  // 🏆 Rankings
  const getRankings = useCallback(async (params: RankingsParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mcpLightAPI.getLightningRankings(params);
      setLoading(false);
      return response.nodes;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des rankings';
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setError]);

  // 📊 Statistiques globales
  const getGlobalStats = useCallback(async (params: StatsParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mcpLightAPI.getNetworkGlobalStats(params);
      setLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des statistiques';
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setError]);

  // 🎯 Priorities Enhanced
  const getNodePriorities = useCallback(async (pubkey: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mcpLightAPI.getNodePrioritiesEnhanced(pubkey);
      setLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des priorités';
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setError]);

  // 🧮 Calculateur
  const calculateConversion = useCallback(async (params: CalculatorParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mcpLightAPI.getLightningCalculator(params);
      setLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du calcul de conversion';
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setError]);

  // 🔓 Décodeur
  const decodeData = useCallback(async (data: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mcpLightAPI.decodeLightningData(data);
      setLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du décodage';
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setError]);

  return {
    loading: state.loading,
    error: state.error,
    isLoading: state.loading,
    searchNodes,
    getRankings,
    getGlobalStats,
    getNodePriorities,
    calculateConversion,
    decodeData,
    clearError
  };
}; 