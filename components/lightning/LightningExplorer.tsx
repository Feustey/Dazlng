"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Zap, Globe, Users, BarChart3 } from 'lucide-react';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';
import type { 
  LightningNode, 
  RankingNode, 
  GlobalStatsResponse,
  ExplorerParams,
  RankingsParams 
} from '@/lib/services/mcp-light-api';

export function LightningExplorer() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<ExplorerParams['sort']>('capacity:desc');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [nodes, setNodes] = useState<LightningNode[]>([]);
  const [rankings, setRankings] = useState<RankingNode[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Charger les nœuds via MCP API
  const loadNodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ExplorerParams = {
        search: searchTerm || undefined,
        sort: sortBy,
        page: currentPage,
        limit: 20,
        verified_only: verifiedOnly
      };

      const response = await mcpLightAPI.getLightningNodes(params);
      setNodes(response.nodes);
      setTotalPages(Math.ceil(response.total / 20));
    } catch (error) {
      console.error('Erreur lors du chargement des nœuds:', error);
      setError('Impossible de charger les nœuds Lightning');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy, currentPage, verifiedOnly]);

  // Charger les classements via MCP API
  const loadRankings = useCallback(async (metric: RankingsParams['metric']) => {
    try {
      const params: RankingsParams = {
        metric,
        limit: 10
      };

      const response = await mcpLightAPI.getLightningRankings(params);
      setRankings(response.nodes);
    } catch (error) {
      console.error('Erreur lors du chargement des classements:', error);
    }
  }, []);

  // Charger les statistiques globales via MCP API
  const loadGlobalStats = useCallback(async () => {
    try {
      const response = await mcpLightAPI.getNetworkGlobalStats({
        include_movers: true,
        include_fees: true
      });
      setGlobalStats(response);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }, []);

  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  useEffect(() => {
    loadGlobalStats();
    if (activeTab === 'rankings') {
      loadRankings('capacity');
    }
  }, [activeTab, loadGlobalStats, loadRankings]);

  const formatCapacity = (capacity: number) => {
    if (capacity >= 100000000) {
      return `${(capacity / 100000000).toFixed(2)} BTC`;
    } else if (capacity >= 1000000) {
      return `${(capacity / 1000000).toFixed(0)}M sats`;
    } else if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(0)}K sats`;
    }
    return `${capacity} sats`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur de connexion</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-1 text-xs">Vérifiez que l'API MCP (api.dazno.de) est disponible.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* En-tête avec statistiques globales */}
      {globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nœuds</p>
                <p className="text-2xl font-bold">{formatNumber(globalStats.network_overview.total_nodes)}</p>
                <p className="text-xs text-gray-500">
                  {globalStats.growth_metrics.nodes_24h > 0 ? '+' : ''}{globalStats.growth_metrics.nodes_24h} (24h)
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Canaux</p>
                <p className="text-2xl font-bold">{formatNumber(globalStats.network_overview.total_channels)}</p>
                <p className="text-xs text-gray-500">
                  {globalStats.growth_metrics.channels_24h > 0 ? '+' : ''}{globalStats.growth_metrics.channels_24h} (24h)
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capacité</p>
                <p className="text-2xl font-bold">{formatNumber(Math.round(globalStats.network_overview.total_capacity_btc))} BTC</p>
                <p className="text-xs text-gray-500">
                  {globalStats.growth_metrics.capacity_24h_btc > 0 ? '+' : ''}{globalStats.growth_metrics.capacity_24h_btc.toFixed(1)} BTC (24h)
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Santé</p>
                <p className="text-2xl font-bold">{(globalStats.health_indicators.reachability_score * 100).toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Score de connectivité</p>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'explorer', label: 'Explorer', icon: Search },
              { id: 'rankings', label: 'Rankings', icon: BarChart3 },
              { id: 'stats', label: 'Statistiques', icon: Globe }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Explorer */}
          {activeTab === 'explorer' && (
            <div className="space-y-6">
              {/* Contrôles de recherche */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher par alias ou pubkey..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ExplorerParams['sort'])}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="capacity:desc">Capacité (desc)</option>
                  <option value="channels:desc">Canaux (desc)</option>
                  <option value="uptime:desc">Uptime (desc)</option>
                  <option value="alias:asc">Alias (A-Z)</option>
                </select>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Vérifiés uniquement</span>
                </label>
              </div>

              {/* Liste des nœuds */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Chargement des nœuds...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nodes.map((node) => (
                    <div key={node.pubkey} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: node.color }}
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                              <span>{node.alias}</span>
                              {node.is_verified && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Vérifié
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono">
                              {node.pubkey.slice(0, 20)}...{node.pubkey.slice(-20)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">{formatCapacity(node.capacity)}</span>
                            <span className="text-gray-500 ml-2">• {node.channel_count} canaux</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Uptime: {node.uptime_percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Onglet Rankings */}
          {activeTab === 'rankings' && (
            <div className="space-y-6">
              <div className="flex space-x-4">
                {['capacity', 'channels', 'revenue', 'centrality'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => loadRankings(metric as RankingsParams['metric'])}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 capitalize"
                  >
                    {metric === 'capacity' ? 'Capacité' :
                     metric === 'channels' ? 'Canaux' :
                     metric === 'revenue' ? 'Revenus' : 'Centralité'}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {rankings.map((node, _index) => (
                  <div key={node.pubkey} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-500">#{node.rank}</span>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: node.color }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{node.alias}</h3>
                        {node.is_verified && (
                          <span className="text-xs text-green-600">Vérifié</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{formatCapacity(node.value)}</div>
                      <div className={`text-sm ${getChangeColor(node.change_24h)}`}>
                        {node.change_24h > 0 ? '+' : ''}{node.change_24h.toFixed(1)}% (24h)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Statistiques */}
          {activeTab === 'stats' && globalStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Croissance */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Croissance du Réseau</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nœuds (7j)</span>
                      <span className="font-medium">{globalStats.growth_metrics.nodes_7d > 0 ? '+' : ''}{globalStats.growth_metrics.nodes_7d}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Canaux (7j)</span>
                      <span className="font-medium">{globalStats.growth_metrics.channels_7d > 0 ? '+' : ''}{globalStats.growth_metrics.channels_7d}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacité (7j)</span>
                      <span className="font-medium">{globalStats.growth_metrics.capacity_7d_btc > 0 ? '+' : ''}{globalStats.growth_metrics.capacity_7d_btc.toFixed(1)} BTC</span>
                    </div>
                  </div>
                </div>

                {/* Frais */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Analyse des Frais</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais moyen</span>
                      <span className="font-medium">{globalStats.fee_analysis.avg_fee_rate_ppm} ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais médian</span>
                      <span className="font-medium">{globalStats.fee_analysis.median_fee_rate_ppm} ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenus (24h)</span>
                      <span className="font-medium">{globalStats.fee_analysis.fee_revenue_24h_btc.toFixed(3)} BTC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big Movers */}
              {globalStats.big_movers && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mouvements Importants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-3">Plus Gros Gains</h4>
                      <div className="space-y-2">
                        {globalStats.big_movers.capacity_gainers.map((node, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">{node.alias}</span>
                            <span className="text-green-600">+{node.change_btc.toFixed(2)} BTC</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-3">Plus Grosses Pertes</h4>
                      <div className="space-y-2">
                        {globalStats.big_movers.capacity_losers.map((node, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <span className="font-medium">{node.alias}</span>
                            <span className="text-red-600">{node.change_btc.toFixed(2)} BTC</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 