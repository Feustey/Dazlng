'use client';

import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { 
  useRAGStats,
  useRAGCacheStats,
  useLightningRAGInsights,
  useLightningRAGQuery,
  useLightningRAGOptimization
} from '@/hooks';
import { 
  Brain, 
  Search, 
  BarChart3, 
  Zap, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Lock,
  Sparkles,
  Database,
  Lightbulb,
  Settings,
  FileText,
  Activity,
  Shield,
  Cpu
} from 'lucide-react';

const RAGInsightsPage: React.FC = () => {
  const { user } = useSupabase();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'queries' | 'optimization' | 'cache' | 'intelligence'>('overview');
  const [nodePubkey, setNodePubkey] = useState<string>('');

  // Hooks RAG
  const { data: ragStats, loading: ragStatsLoading, error: ragStatsError, refetch: refetchRAGStats } = useRAGStats();
  const { data: cacheStats, loading: cacheStatsLoading, error: cacheStatsError, refetch: refetchCacheStats } = useRAGCacheStats();
  
  // Hooks Lightning-RAG
  const { data: lightningInsights, loading: insightsLoading, error: insightsError, refetch: refetchInsights } = useLightningRAGInsights();
  const { data: queryResult, loading: queryLoading, error: queryError, executeQuery } = useLightningRAGQuery();
  const { data: optimizationResult, loading: optimizationLoading, error: optimizationError, optimize } = useLightningRAGOptimization();

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setIsSubscribed(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscriptions/current');
      const data = await response.json();
      
      if (data.success && data.data?.status === 'active') {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Erreur vérification abonnement:', error);
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeQuery = async () => {
    if (!nodePubkey) return;
    
    try {
      await executeQuery({
        node_pubkey: nodePubkey,
        query: "Analyse complète de mon nœud avec recommandations d'optimisation",
        include_network_data: true,
        include_historical_data: true,
        response_format: 'actionable'
      });
    } catch (error) {
      console.error('Erreur requête Lightning-RAG:', error);
    }
  };

  const handleOptimization = async () => {
    if (!nodePubkey) return;
    
    try {
      await optimize({
        node_pubkey: nodePubkey,
        optimization_goal: 'revenue_maximization',
        include_rag_insights: true,
        historical_context: true,
        constraints: {
          max_channels: 100,
          max_liquidity: 1000000,
          min_fees: 1
        }
      });
    } catch (error) {
      console.error('Erreur optimisation Lightning-RAG:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de votre abonnement...</p>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              RAG Insights Premium
            </h1>
            <p className="text-gray-600">
              Accédez à l'IA Lightning la plus avancée pour booster votre node
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Fonctionnalités Premium</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center">
                <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                Requêtes contextuelles Lightning-RAG
              </li>
              <li className="flex items-center">
                <Brain className="h-4 w-4 text-blue-500 mr-2" />
                Optimisation IA avec insights réseau
              </li>
              <li className="flex items-center">
                <Database className="h-4 w-4 text-blue-500 mr-2" />
                Cache intelligent et statistiques avancées
              </li>
              <li className="flex items-center">
                <Target className="h-4 w-4 text-blue-500 mr-2" />
                Recommandations personnalisées
              </li>
              <li className="flex items-center">
                <Cpu className="h-4 w-4 text-blue-500 mr-2" />
                Analyse prédictive et alertes intelligentes
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => window.location.href = '/user/subscriptions'}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            Passer à Premium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">RAG Insights</h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Premium
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Settings className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'queries', label: 'Requêtes', icon: Search },
              { id: 'optimization', label: 'Optimisation', icon: Zap },
              { id: 'cache', label: 'Cache', icon: Database },
              { id: 'intelligence', label: 'Intelligence', icon: Cpu }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Documents Indexés</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {ragStats?.total_documents || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taux de Cache</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {cacheStats?.hit_rate ? `${(cacheStats.hit_rate * 100).toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Requêtes Traitées</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {ragStats?.total_queries || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Temps Réponse</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {cacheStats?.average_response_time ? `${cacheStats.average_response_time}ms` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lightning-RAG Query Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Requête Lightning-RAG Contextuelle
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clé Publique du Nœud
                  </label>
                  <input
                    type="text"
                    value={nodePubkey}
                    onChange={(e) => setNodePubkey(e.target.value)}
                    placeholder="03eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleNodeQuery}
                    disabled={queryLoading || !nodePubkey}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {queryLoading ? 'Analyse...' : 'Analyser avec RAG'}
                  </button>
                  <button
                    onClick={handleOptimization}
                    disabled={optimizationLoading || !nodePubkey}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {optimizationLoading ? 'Optimisation...' : 'Optimiser avec IA'}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {(queryResult || optimizationResult) && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Résultats</h3>
                <div className="space-y-4">
                  {queryResult && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Analyse RAG</h4>
                      <pre className="text-sm text-blue-800 overflow-auto">
                        {JSON.stringify(queryResult, null, 2)}
                      </pre>
                    </div>
                  )}
                  {optimizationResult && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Optimisation IA</h4>
                      <pre className="text-sm text-green-800 overflow-auto">
                        {JSON.stringify(optimizationResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Display */}
            {(queryError || optimizationError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <h4 className="font-medium text-red-900">Erreur</h4>
                </div>
                <p className="text-red-700 mt-2">
                  {queryError || optimizationError}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Documents RAG</h3>
            <p className="text-gray-600">Interface pour ingérer et gérer les documents RAG...</p>
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requêtes Avancées</h3>
            <p className="text-gray-600">Interface pour les requêtes RAG avancées...</p>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimisation Lightning-RAG</h3>
            <p className="text-gray-600">Interface pour l'optimisation avec insights RAG...</p>
          </div>
        )}

        {activeTab === 'cache' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Cache RAG</h3>
            {cacheStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{cacheStats.total_documents}</p>
                  <p className="text-sm text-gray-600">Documents</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{cacheStats.cache_hits}</p>
                  <p className="text-sm text-gray-600">Cache Hits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{cacheStats.cache_misses}</p>
                  <p className="text-sm text-gray-600">Cache Misses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {(cacheStats.hit_rate * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Hit Rate</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'intelligence' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Intelligence Artificielle</h3>
            {lightningInsights && (
              <div className="space-y-4">
                <pre className="text-sm text-gray-800 overflow-auto bg-gray-50 p-4 rounded-lg">
                  {JSON.stringify(lightningInsights, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RAGInsightsPage; export const dynamic = "force-dynamic";
