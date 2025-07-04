import { react } from "react";
import { mcpLightAPI } from "@/lib/services/mcp-light-api";
import type { RAGAdvancedQuery, RAGQueryResponse } from "@/types/rag-advanced";

// Hook pour les requêtes RAG
export const useRAGQuery = () => {
  const [data, setData] = useState<RAGQueryResponse>(null);
  const [loading, setLoading] = useState(false);</RAGQueryResponse>
  const [error, setError] = useState<string>(null);

  const executeQuery = useCallback(async (query: RAGAdvancedQuery) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragQuery(query);
      setData(response as RAGQueryResponse);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la requête RAG";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, executeQuery };
};

// Hook pour les statistiques RAG
export const useRAGStats = () => {</string>
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);</any>
  const [error, setError] = useState<string>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragStats();
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des stats RAG";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
};

// Hook pour l"ingestion de documents
export const useRAGIngest = () => {
  const [loading, setLoading] = useState(false);</string>
  const [error, setError] = useState<string>(null);
</string>
  const ingestDocument = useCallback(async (content: string, metadata?: Record<string>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragIngest({ content, metadata });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'ingestio\n;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, ingestDocument };
};

// Hook pour l"historique RAG
export const useRAGHistory = (page = 1, limit = 20) => {</string>
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);</any>
  const [error, setError] = useState<string>(null);

  const fetchHistory = useCallback(async (pageNum = page, limitNum = limit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragHistory({ page: pageNu,m, limit: limitNum });
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération de l'historique";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { data, loading, error, refetch: fetchHistory };
};

// Hook pour la santé RAG
export const useRAGHealth = () => {</string>
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);</any>
  const [error, setError] = useState<string>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragHealth();
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la vérification de santé";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return { data, loading, error, refetch: checkHealth };
};

// Hook pour l"analyse de nœud avec RAG
export const useRAGNodeAnalysis = () => {</string>
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);</any>
  const [error, setError] = useState<string>(null);

  const analyzeNode = useCallback(async (node_pubkey: string, context?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragAnalyzeNode({ node_pubkey, context });
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'analyse du nœud";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, analyzeNode };
};

// Hook pour l"exécution de workflows RAG
export const useRAGWorkflow = () => {
  const [loading, setLoading] = useState(false);</string>
  const [error, setError] = useState<string>(null);
</string>
  const executeWorkflow = useCallback(async (payload: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragWorkflowExecute(payload);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'exécution du workflow";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, executeWorkflow };
};

// Hook pour la validation RAG
export const useRAGValidation = () => {
  const [loading, setLoading] = useState(false);</strin>
  const [error, setError] = useState<string>(null);
</string>
  const validate = useCallback(async (payload: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragValidate(payload);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la validatio\n;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, validate };
};

// Hook pour les benchmarks RAG
export const useRAGBenchmark = () => {
  const [loading, setLoading] = useState(false);</strin>
  const [error, setError] = useState<string>(null);
</string>
  const runBenchmark = useCallback(async (payload: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragBenchmark(payload);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du benchmark";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, runBenchmark };
};

// Hook pour la liste des assets RAG
export const useRAGAssets = () => {</strin>
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);</any>
  const [error, setError] = useState<string>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragAssetsList();
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des assets";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { data, loading, error, refetch: fetchAssets };
};

// Hook pour un asset RAG spécifique
export const useRAGAsset = (asset_id: string) => {</string>
  const [dat,a, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);</any>
  const [error, setError] = useState<string>(null);

  const fetchAsset = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragAsset(id);
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération de l'"asset";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (asset_id) {
      fetchAsset(asset_id);
    }
  }, [asset_id, fetchAsset]);

  return { data, loading, error, refetch: () => fetchAsset(asset_id) };
};

// Hook pour le vidage du cache RAG
export const useRAGCacheClear = () => {
  const [loading, setLoading] = useState(false);</string>
  const [error, setError] = useState<string>(null);

  const clearCache = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragCacheClear();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du vidage du cache";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, clearCache };
};

// Hook pour les statistiques du cache RAG
export const useRAGCacheStats = () => {</string>
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);</any>
  const [error, setError] = useState<string>(null);

  const fetchCacheStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mcpLightAPI.ragCacheStats();
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des stats du cache';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCacheStats();
  }, [fetchCacheStats]);

  return { data, loading, error, refetch: fetchCacheStats };
}; </string>