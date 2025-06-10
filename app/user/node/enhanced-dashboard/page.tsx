"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';
import { 
  Activity, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  Settings, 
  CheckCircle 
} from 'lucide-react';
import type { 
  EnrichedNodeData, 
  LNDStatus, 
  PrioritiesEnhancedResponse 
} from '@/lib/services/mcp-light-api';

export default function EnhancedNodeDashboard() {
  const searchParams = useSearchParams();
  const pubkey = searchParams.get('pubkey');
  
  const [enrichedData, setEnrichedData] = useState<EnrichedNodeData | null>(null);
  const [lndStatus, setLndStatus] = useState<LNDStatus | null>(null);
  const [enhancedPriorities, setEnhancedPriorities] = useState<PrioritiesEnhancedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pubkey) {
      setError('Aucune clé publique fournie');
      setLoading(false);
      return;
    }

    loadEnhancedData();
  }, [pubkey]);

  const loadEnhancedData = async () => {
    if (!pubkey) return;

    setLoading(true);
    setError(null);

    try {
      // Charger toutes les données avancées en parallèle
      const [enrichedResult, lndResult, prioritiesResult] = await Promise.allSettled([
        mcpLightAPI.getEnrichedStatus(pubkey),
        mcpLightAPI.getLNDStatus(pubkey),
        mcpLightAPI.getNodePrioritiesEnhanced(pubkey)
      ]);

      // Traiter les résultats
      if (enrichedResult.status === 'fulfilled') {
        setEnrichedData(enrichedResult.value);
      } else {
        console.error('Erreur enriched status:', enrichedResult.reason);
      }

      if (lndResult.status === 'fulfilled') {
        setLndStatus(lndResult.value);
      } else {
        console.error('Erreur LND status:', lndResult.reason);
      }

      if (prioritiesResult.status === 'fulfilled') {
        setEnhancedPriorities(prioritiesResult.value);
      } else {
        console.error('Erreur enhanced priorities:', prioritiesResult.reason);
      }

    } catch (error) {
      console.error('Erreur chargement données avancées:', error);
      setError('Impossible de charger les données avancées');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'active':
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'syncing':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'offline':
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-medium text-red-900">Erreur</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Diagnostics Avancés Lightning
              </h1>
              <p className="text-gray-600 mt-1">
                Analyse approfondie et recommandations IA pour votre nœud
              </p>
            </div>
            <button
              onClick={loadEnhancedData}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>

        {/* Statut LND */}
        {lndStatus && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Statut LND
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Disponible</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lndStatus.lnd_available ? 'active' : 'inactive')}`}>
                    {lndStatus.lnd_available ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Dernière MAJ</span>
                  <span className="text-sm text-gray-900">
                    {new Date(lndStatus.timestamp).toLocaleTimeString('fr-FR')}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Canaux Actifs</span>
                  <span className="text-sm text-gray-900">
                    {lndStatus.local_node_info?.num_active_channels || 0}
                  </span>
                </div>
              </div>
            </div>

            {lndStatus.local_node_info && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Informations du nœud</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-blue-600">Version:</span>
                    <span className="text-blue-900 ml-1">{lndStatus.local_node_info.version}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Sync blockchain:</span>
                    <span className="text-blue-900 ml-1">{lndStatus.local_node_info.synced_to_chain ? 'Oui' : 'Non'}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Peers:</span>
                    <span className="text-blue-900 ml-1">{lndStatus.local_node_info.num_peers}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Hauteur bloc:</span>
                    <span className="text-blue-900 ml-1">{lndStatus.local_node_info.block_height}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Données enrichies */}
        {enrichedData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Analyse Enrichie
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-600">Capacité Totale</p>
                    <p className="text-2xl font-bold text-green-900">
                      {(enrichedData.sparkseer_data.total_capacity / 100000000).toFixed(2)} BTC
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600">Score Liquidité</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {enrichedData.sparkseer_data.liquidity_flexibility_score.toFixed(1)}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-purple-600">Canaux</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {enrichedData.sparkseer_data.num_channels}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-yellow-600">Taux Réussite</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {(enrichedData.sparkseer_data.htlc_success_rate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Données SparkSeer</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alias:</span>
                    <span className="text-gray-900">{enrichedData.sparkseer_data.alias}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rank Centralité:</span>
                    <span className="text-gray-900">{enrichedData.sparkseer_data.betweenness_rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais Moyen:</span>
                    <span className="text-gray-900">{enrichedData.sparkseer_data.mean_outbound_fee_rate} ppm</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-indigo-900 mb-3">Insights Combinés</h3>
                <div className="space-y-2 text-xs text-indigo-700">
                  <p><strong>Classification:</strong> {enrichedData.combined_insights.node_classification}</p>
                  <p><strong>Statut liquidité:</strong> {enrichedData.combined_insights.liquidity_status}</p>
                  <p><strong>Position réseau:</strong> {enrichedData.combined_insights.network_position}</p>
                  <p><strong>Priorité maintenance:</strong> {enrichedData.combined_insights.maintenance_priority}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommandations Avancées IA */}
        {enhancedPriorities && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recommandations IA Avancées
            </h2>
            
            {enhancedPriorities.ai_analysis && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-6 border border-indigo-200">
                <h3 className="text-sm font-medium text-indigo-900 mb-2">Analyse IA</h3>
                <div className="space-y-2 text-sm text-indigo-700">
                  <p><strong>Score global:</strong> {enhancedPriorities.ai_analysis.overall_score}/100</p>
                  <p><strong>Position marché:</strong> {enhancedPriorities.ai_analysis.market_position}</p>
                  <p><strong>Focus recommandé:</strong> {enhancedPriorities.ai_analysis.recommended_focus}</p>
                  
                  {enhancedPriorities.ai_analysis.strengths.length > 0 && (
                    <div>
                      <p className="font-medium">Forces:</p>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {enhancedPriorities.ai_analysis.strengths.slice(0, 3).map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {enhancedPriorities.priority_actions.slice(0, 5).map((action, index) => (
                <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          action.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                          action.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          #{index + 1} - {action.risk_level} risk
                        </span>
                        <span className="text-xs text-gray-500">
                          Impact: {action.impact_score}/10
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                      
                      <div className="bg-green-50 rounded p-2 mb-2">
                        <p className="text-xs text-green-700">
                          <strong>Effort:</strong> {action.implementation_effort} | 
                          <strong> Temps:</strong> {action.estimated_time} |
                          <strong> Catégorie:</strong> {action.category}
                        </p>
                      </div>
                      
                      {action.revenue_potential > 0 && (
                        <div className="text-xs text-indigo-600">
                          💰 Potentiel revenus: {action.revenue_potential} sats
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 