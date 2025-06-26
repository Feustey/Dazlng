import { useState, useEffect, useCallback } from 'react';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';
import type { 
  LightningRAGQuery, 
  LightningRAGResponse, 
  LightningOptimizationRequest, 
  LightningOptimizationResponse 
} from '@/types/rag-advanced';

// Hook pour les requêtes Lightning-RAG (utilise integratedNodeQuery)
export const useLightningRAGQuery = () => {
  const [data, setData] = useState<LightningRAGResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = useCallback(async (query: LightningRAGQuery) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.integratedNodeQuery(query);
      setData(response as LightningRAGResponse);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la requête Lightning-RAG';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, executeQuery };
};

// Hook pour l'optimisation Lightning avec RAG
export const useLightningRAGOptimization = () => {
  const [data, setData] = useState<LightningOptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimize = useCallback(async (request: LightningOptimizationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.lightningOptimizeWithRAG(request);
      setData(response as LightningOptimizationResponse);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'optimisation Lightning-RAG';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, optimize };
};

// Hook pour l'analyse de nœud Lightning avec RAG (utilise intelligenceNodeAnalyze)
export const useLightningRAGNodeAnalysis = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeNode = useCallback(async (node_pubkey: string, context?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.intelligenceNodeAnalyze({ node_pubkey, context });
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse du nœud Lightning-RAG';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, analyzeNode };
};

// Hook pour les recommandations Lightning-RAG (utilise intelligenceOptimizationRecommend)
export const useLightningRAGRecommendations = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(async (node_pubkey: string, context?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.intelligenceOptimizationRecommend({ node_pubkey, context });
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des recommandations';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getRecommendations };
};

// Hook pour l'analyse de réseau Lightning avec RAG (utilise intelligenceNetworkAnalyze)
export const useLightningRAGNetworkAnalysis = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeNetwork = useCallback(async (context?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.intelligenceNetworkAnalyze({ context });
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse du réseau Lightning-RAG';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, analyzeNetwork };
};

// Hook pour les insights Lightning-RAG (utilise intelligenceInsightsSummary)
export const useLightningRAGInsights = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.intelligenceInsightsSummary();
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des insights';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getInsights();
  }, [getInsights]);

  return { data, loading, error, refetch: getInsights };
};

// Hook pour les prédictions Lightning-RAG (utilise intelligencePredictionGenerate)
export const useLightningRAGPredictions = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPredictions = useCallback(async (node_pubkey: string, context?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.intelligencePredictionGenerate({ node_pubkey, context });
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des prédictions';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getPredictions };
};

// Hook pour les alertes Lightning-RAG (utilise intelligenceAlertsConfigure)
export const useLightningRAGAlerts = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAlerts = useCallback(async (node_pubkey: string, context?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.intelligenceAlertsConfigure({ node_pubkey, context });
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des alertes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getAlerts };
};

// Hook pour les rapports Lightning-RAG (utilise intelligenceWorkflowAutomated)
export const useLightningRAGReports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (node_pubkey: string, context?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.intelligenceWorkflowAutomated({ node_pubkey, context });
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération du rapport';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, generateReport };
}; 