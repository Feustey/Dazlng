import { useState, useEffect, useCallback } from 'react';
import mcpLightAPI, { 
  NodeAnalysisResult, 
  MCPLightCredentials,
  type MCPNodeInfo,
  type MCPRecommendationsResponse,
  type MCPPrioritiesResponse
} from '@/lib/services/mcp-light-api';

export interface UseMCPLightState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  credentials: MCPLightCredentials | null;
}

export interface UseMCPLightActions {
  analyzeNode: (pubkey: string, context?: string, goals?: string[]) => Promise<NodeAnalysisResult>;
  getNodeInfo: (pubkey: string) => Promise<MCPNodeInfo>;
  getRecommendations: (pubkey: string) => Promise<MCPRecommendationsResponse>;
  getPriorityActions: (pubkey: string, context?: string, goals?: string[]) => Promise<MCPPrioritiesResponse>;
  checkHealth: () => Promise<{ status: string; timestamp: string; services?: any }>;
  reinitialize: () => Promise<boolean>;
  clearError: () => void;
}

export interface UseMCPLightReturn extends UseMCPLightState, UseMCPLightActions {
  api: typeof mcpLightAPI;
  isValidPubkey: (pubkey: string) => boolean;
}

/**
 * Hook React pour l'utilisation de l'API MCP-Light
 * Gère l'état d'initialisation, les erreurs et fournit des méthodes simplifiées
 */
export const useMCPLight = (): UseMCPLightReturn => {
  const [state, setState] = useState<UseMCPLightState>({
    initialized: false,
    loading: false,
    error: null,
    credentials: null
  });

  useEffect(() => {
    initializeAPI();
  }, []);

  const initializeAPI = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const success = await mcpLightAPI.initialize();
      const credentials = mcpLightAPI.getCredentials();
      
      setState(prev => ({
        ...prev,
        initialized: success,
        credentials,
        error: success ? null : 'Échec de l\'initialisation API',
        loading: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        initialized: false,
        error: err instanceof Error ? err.message : 'Erreur inconnue',
        loading: false
      }));
    }
  };

  const analyzeNode = useCallback(async (
    pubkey: string, 
    context = "Analyse complète du nœud", 
    goals = ["increase_revenue", "improve_centrality"]
  ): Promise<NodeAnalysisResult> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      return await mcpLightAPI.analyzeNode(pubkey, context, goals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse du nœud';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const getNodeInfo = useCallback(async (pubkey: string): Promise<MCPNodeInfo> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      return await mcpLightAPI.getNodeInfo(pubkey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des infos du nœud';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const getRecommendations = useCallback(async (pubkey: string): Promise<MCPRecommendationsResponse> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      return await mcpLightAPI.getRecommendations(pubkey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des recommandations';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const getPriorityActions = useCallback(async (
    pubkey: string, 
    context = "Optimisation générale", 
    goals = ["increase_revenue"]
  ): Promise<MCPPrioritiesResponse> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      return await mcpLightAPI.getPriorityActions(pubkey, context, goals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des actions prioritaires';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const checkHealth = useCallback(async (): Promise<{ status: string; timestamp: string; services?: any }> => {
    setState(prev => ({ ...prev, error: null }));
    
    try {
      return await mcpLightAPI.checkHealth();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vérification de santé';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw err;
    }
  }, []);

  const reinitialize = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const success = await mcpLightAPI.reinitialize();
      const credentials = mcpLightAPI.getCredentials();
      
      setState(prev => ({
        ...prev,
        initialized: success,
        credentials,
        error: success ? null : 'Échec de la réinitialisation API',
        loading: false
      }));
      
      return success;
    } catch (err) {
      setState(prev => ({
        ...prev,
        initialized: false,
        error: err instanceof Error ? err.message : 'Erreur lors de la réinitialisation',
        loading: false
      }));
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const isValidPubkey = useCallback((pubkey: string): boolean => {
    return mcpLightAPI.isValidPubkey(pubkey);
  }, []);

  return {
    // État
    initialized: state.initialized,
    loading: state.loading,
    error: state.error,
    credentials: state.credentials,
    
    // Actions
    analyzeNode,
    getNodeInfo,
    getRecommendations,
    getPriorityActions,
    checkHealth,
    reinitialize,
    clearError,
    
    // Utilitaires
    api: mcpLightAPI,
    isValidPubkey
  };
};

export default useMCPLight; 