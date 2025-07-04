'use client';

import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { usePubkeyCookie } from '@/app/user/hooks/usePubkeyCookie';
import { Brain, TrendingUp, AlertTriangle, BarChart3, Target, Zap, Globe, Activity, Database, Network, Lightbulb, Cpu } from '@/components/shared/ui/IconRegistry';


interface NetworkAnalysis {
  network_health: number;
  total_nodes: number;
  active_channels: number;
  network_capacity: number;
  average_fee_rate: number;
  bottlenecks: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    impact_score: number;
  }>;
  recommendations: Array<{
    type: string;
    priority: 'low' | 'medium' | 'high';
    description: string;
    expected_impact: number;
  }>;
}

interface Prediction {
  timeframe: string;
  predictions: Array<{
    metric: string;
    current_value: number;
    predicted_value: number;
    confidence: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  insights: string[];
  risk_factors: Array<{
    factor: string;
    probability: number;
    impact: 'low' | 'medium' | 'high';
  }>;
}

const IntelligencePage: React.FC = () => {
  const { session } = useSupabase();
  const { pubkey } = usePubkeyCookie();
  const [networkAnalysis, setNetworkAnalysis] = useState<NetworkAnalysis | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'network' | 'prediction'>('network');

  const analyzeNetwork = async () => {
    if (!pubkey) {
      setError('Veuillez d\'abord configurer votre clé publique de nœud');
      return;
    }

    setLoading(true);
    setError(null);
    setNetworkAnalysis(null);

    try {
      const response = await fetch('/api/proxy/intelligence/network/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          "user.userusercontenttype": 'application/json'
        },
        body: JSON.stringify({
          context: "user.useruseranalyse_complte_du_rse",
          include_global_metrics: true,
          include_bottlenecks: true,
          include_recommendations: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNetworkAnalysis(data.data);
        } else {
          setError(data.error?.message || 'Erreur lors de l\'analyse réseau');
        }
      } else {
        setError('Erreur lors de l\'analyse réseau');
      }
    } catch (error) {
      console.error('Erreur analyse réseau:', error);
      setError('Erreur de connexion lors de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  const generatePrediction = async () => {
    if (!pubkey) {
      setError('Veuillez d\'abord configurer votre clé publique de nœud');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('/api/proxy/intelligence/prediction/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          "user.userusercontenttype": 'application/json'
        },
        body: JSON.stringify({
          timeframe: '30d',
          include_network_effects: true,
          include_market_trends: true,
          confidence_threshold: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPrediction(data.data);
        } else {
          setError(data.error?.message || 'Erreur lors de la génération de prédictions');
        }
      } else {
        setError('Erreur lors de la génération de prédictions');
      }
    } catch (error) {
      console.error('Erreur prédictions:', error);
      setError('Erreur de connexion lors de la génération de prédictions');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'stable': return <Target className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">{t('user.intelligence_lightning')}</h1>
              <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                IA Avancée
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('network')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'network'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Network className="h-4 w-4 inline mr-2" />
              Analyse Réseau
            </button>
            <button
              onClick={() => setActiveTab('prediction')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'prediction'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Prédictions IA
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'network' ? (
          <div className="space-y-6">
            {/* Contrôles */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Globe className="h-5 w-5 text-red-500 mr-2" />
                    Analyse Intelligente du Réseau
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Analyse complète du réseau Lightning avec détection de goulots d'étranglement
                  </p>
                </div>
                <button
                  onClick={analyzeNetwork}
                  disabled={!pubkey || loading}
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyse...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyser le Réseau
                    </>
                  )}
                </button>
              </div>

              {!pubkey && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Configurez votre clé publique dans "Mon Nœud" pour commencer
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Résultats de l'analyse réseau */}
            {networkAnalysis && (
              <div className="space-y-6">
                {/* Métriques globales */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                    Métriques Globales du Réseau
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPercentage(networkAnalysis.network_health)}
                      </div>
                      <div className="text-sm text-blue-800">{t('user.sant_rseau')}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatNumber(networkAnalysis.total_nodes)}
                      </div>
                      <div className="text-sm text-green-800">{t('user.nuds_actifs')}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatNumber(networkAnalysis.active_channels)}
                      </div>
                      <div className="text-sm text-purple-800">{t('user.canaux_actifs')}</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatNumber(networkAnalysis.network_capacity)}
                      </div>
                      <div className="text-sm text-orange-800">{t('user.capacit_btc')}</div>
                    </div>
                  </div>
                </div>

                {/* Goulots d'étranglement */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                    Goulots d'Étranglement Détectés
                  </h3>
                  <div className="space-y-3">
                    {networkAnalysis.bottlenecks.map((bottleneck, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(bottleneck.severity)}`}>
                            {bottleneck.severity.toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{bottleneck.type}</div>
                            <div className="text-sm text-gray-600">{bottleneck.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            Impact: {bottleneck.impact_score}/10
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommandations */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                    Recommandations IA
                  </h3>
                  <div className="space-y-3">
                    {networkAnalysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start p-4 border border-gray-200 rounded-lg">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-gray-900">{rec.type}</div>
                          <div className="text-sm text-gray-600">{rec.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            +{formatPercentage(rec.expected_impact)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Contrôles prédictions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
                    Prédictions IA
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Prédictions basées sur l'IA pour les 30 prochains jours
                  </p>
                </div>
                <button
                  onClick={generatePrediction}
                  disabled={!pubkey || loading}
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <Cpu className="h-4 w-4 mr-2" />
                      Générer Prédictions
                    </>
                  )}
                </button>
              </div>

              {!pubkey && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Configurez votre clé publique dans "Mon Nœud" pour commencer
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Résultats des prédictions */}
            {prediction && (
              <div className="space-y-6">
                {/* Prédictions par métrique */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Database className="h-5 w-5 text-blue-500 mr-2" />
                    Prédictions ({prediction.timeframe})
                  </h3>
                  <div className="space-y-4">
                    {prediction.predictions.map((pred, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          {getTrendIcon(pred.trend)}
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{pred.metric}</div>
                            <div className="text-sm text-gray-600">
                              Actuel: {pred.current_value.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            Prédit: {pred.predicted_value.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Confiance: {formatPercentage(pred.confidence)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                    Insights IA
                  </h3>
                  <ul className="space-y-2">
                    {prediction.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Facteurs de risque */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    Facteurs de Risque
                  </h3>
                  <div className="space-y-3">
                    {prediction.risk_factors.map((risk, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            risk.impact === 'high' ? 'bg-red-100 text-red-800' :
                            risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.impact.toUpperCase()}
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">{risk.factor}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Probabilité: {formatPercentage(risk.probability)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligencePage; 