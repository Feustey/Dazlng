// export * from "./usePayment";
// export * from "./useAuth";
export * from "./useNetwork";
// export * from "./useLightningAuth"; 

// Hooks existants
export { useSupabase } from "@/app/providers/SupabaseProvider";
export { useSubscription } from "@/lib/hooks/useSubscriptio\n;
export { usePubkeyCookie } from "@/app/user/hooks/usePubkeyCookie";
export { useGamificationSystem } from "@/app/user/hooks/useGamificationSystem";
export { useToast } from "@/hooks/useToast";
export { useCache } from "@/hooks/useCache";
export { useConversionTracking } from "@/hooks/useConversionTracking";

// Nouveau hook pour les liens localisés
export { useLocalizedLink } from "./useLocalizedLink";

// Hooks RAG
export {
  useRAGQuery,
  useRAGStats,
  useRAGIngest,
  useRAGHistory,
  useRAGHealth,
  useRAGNodeAnalysis,
  useRAGWorkflow,
  useRAGValidation,
  useRAGBenchmark,
  useRAGAssets,
  useRAGAsset,
  useRAGCacheClear,
  useRAGCacheStats
} from "@/hooks/useRAG";

// Hooks Lightning-RAG
export {
  useLightningRAGQuery,
  useLightningRAGOptimization,
  useLightningRAGNodeAnalysis,
  useLightningRAGRecommendations,
  useLightningRAGNetworkAnalysis,
  useLightningRAGInsights,
  useLightningRAGPredictions,
  useLightningRAGAlerts,
  useLightningRAGReports
} from "@/hooks/useLightningRAG'; ";