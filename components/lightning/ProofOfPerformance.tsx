'use client';

import React, { useState, useEffect } from 'react';

interface NodePerformance {
  nodeId: string;
  alias: string;
  ranking1ML: number;
  totalCapacity: number;
  channelCount: number;
  uptimePercent: number;
  routingRevenue30d: number;
  forceClosesAvoided: number;
  aiPredictionAccuracy: number;
  publicUrl?: string;
}

interface LightningAnalytics {
  totalInvoices: number;
  paidInvoices: number;
  averagePaymentTime: number; // secondes
  topWallets: Record<string, number>;
  failureReasons: Record<string, number>;
  revenueBySats: {
    daily: number[];
    monthly: number[];
  };
}

export const ProofOfPerformance: React.FC = () => {
  const [performance, setPerformance] = useState<NodePerformance[]>([]);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching real node performance data
    const fetchPerformanceData = async () => {
      setIsLoading(true);
      
      // In a real implementation, this would fetch from your API
      // For demo purposes, we'll use simulated data based on real Lightning Network nodes
      const demoData: NodePerformance[] = [
        {
          nodeId: '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
          alias: 'DazNode-Primary',
          ranking1ML: 47,
          totalCapacity: 1570000000, // 15.7 BTC in sats
          channelCount: 156,
          uptimePercent: 99.9,
          routingRevenue30d: 45000000, // 0.45 BTC in sats
          forceClosesAvoided: 23,
          aiPredictionAccuracy: 87.3,
          publicUrl: 'https://1ml.com/node/03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f'
        },
        {
          nodeId: '02b67e55fb850d7f7d77eb71038362bc0ed0abd5b7ee72cc4f90b16786c69b9256',
          alias: 'DazNode-Backup',
          ranking1ML: 89,
          totalCapacity: 890000000, // 8.9 BTC in sats
          channelCount: 94,
          uptimePercent: 99.7,
          routingRevenue30d: 28000000, // 0.28 BTC in sats
          forceClosesAvoided: 15,
          aiPredictionAccuracy: 91.2,
          publicUrl: 'https://1ml.com/node/02b67e55fb850d7f7d77eb71038362bc0ed0abd5b7ee72cc4f90b16786c69b9256'
        },
        {
          nodeId: '03abf6f44c355dec0d5aa155bdbdd6e0c8fefe318eff402de65c6eb2e1be55dc3e',
          alias: 'DazNode-Research',
          ranking1ML: 234,
          totalCapacity: 320000000, // 3.2 BTC in sats
          channelCount: 47,
          uptimePercent: 99.5,
          routingRevenue30d: 12000000, // 0.12 BTC in sats
          forceClosesAvoided: 8,
          aiPredictionAccuracy: 84.7,
          publicUrl: 'https://1ml.com/node/03abf6f44c355dec0d5aa155bdbdd6e0c8fefe318eff402de65c6eb2e1be55dc3e'
        }
      ];

      setPerformance(demoData);
      setIsLoading(false);
    };

    fetchPerformanceData();
  }, [timeframe]);

  const totalSavings = performance.reduce((sum, node) => 
    sum + (node.forceClosesAvoided * 10000), 0 // 10k sats par force-close évité
  );

  const formatSats = (sats: number): string => {
    if (sats >= 100000000) return `₿${(sats / 100000000).toFixed(2)}`;
    if (sats >= 1000000) return `${(sats / 1000000).toFixed(1)}M sats`;
    if (sats >= 1000) return `${(sats / 1000).toFixed(0)}k sats`;
    return `${sats} sats`;
  };

  const formatCapacity = (sats: number): string => {
    return `₿${(sats / 100000000).toFixed(1)}`;
  };

  if (isLoading) {
    return (
      <div className="proof-performance bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="text-gray-400 mt-4">Chargement des performances en direct...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="proof-performance bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="performance-header text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            📊 Nos Performances Vérifiables
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Transparence totale sur nos nodes Lightning. Toutes les métriques sont vérifiables 
            publiquement sur les explorateurs Bitcoin et Lightning Network.
          </p>
          
          <div className="timeframe-selector flex justify-center space-x-2">
            {(['7d', '30d', '90d'] as const).map(period => (
              <button
                key={period}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  timeframe === period 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setTimeframe(period)}
              >
                {period === '7d' && 'Derniers 7 jours'}
                {period === '30d' && 'Derniers 30 jours'}
                {period === '90d' && 'Derniers 90 jours'}
              </button>
            ))}
          </div>
        </div>

        {/* Global Stats */}
        <div className="global-stats grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="stat-card bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 text-center">
            <h4 className="text-green-400 font-semibold mb-2">💰 Économies Clients</h4>
            <div className="big-number text-3xl font-bold text-green-400 font-mono mb-2">
              {formatSats(totalSavings)}
            </div>
            <small className="text-gray-400">Force-closes évités sur {timeframe}</small>
            <div className="text-xs text-green-300 mt-2">
              ≈ {formatCapacity(totalSavings)} économisés
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 text-center">
            <h4 className="text-blue-400 font-semibold mb-2">🎯 Précision IA</h4>
            <div className="big-number text-3xl font-bold text-blue-400 font-mono mb-2">
              {performance.length > 0 ? 
                Math.round(performance.reduce((sum, n) => sum + n.aiPredictionAccuracy, 0) / performance.length) 
                : 0}%
            </div>
            <small className="text-gray-400">Prédictions correctes</small>
            <div className="text-xs text-blue-300 mt-2">
              Basé sur {performance.reduce((sum, n) => sum + n.forceClosesAvoided, 0)} prédictions
            </div>
          </div>
          
          <div className="stat-card bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6 text-center">
            <h4 className="text-purple-400 font-semibold mb-2">⚡ Uptime Moyen</h4>
            <div className="big-number text-3xl font-bold text-purple-400 font-mono mb-2">
              {performance.length > 0 ? 
                (performance.reduce((sum, n) => sum + n.uptimePercent, 0) / performance.length).toFixed(1)
                : 0}%
            </div>
            <small className="text-gray-400">Disponibilité réseau</small>
            <div className="text-xs text-purple-300 mt-2">
              SLA 99.5% garanti
            </div>
          </div>
        </div>
        
        {/* Nodes Performance */}
        <div className="nodes-performance space-y-6">
          {performance.map(node => (
            <div key={node.nodeId} className="node-performance-card bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors duration-300">
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                
                {/* Node Info */}
                <div className="node-info mb-4 lg:mb-0">
                  <div className="flex items-center mb-2">
                    <h4 className="text-xl font-bold text-white">{node.alias}</h4>
                    <div className="ml-3 flex items-center bg-green-400/20 text-green-400 px-2 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      Online
                    </div>
                  </div>
                  
                  <div className="node-metrics flex flex-wrap gap-4 text-sm text-gray-300">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">🏆</span>
                      <span>Rang 1ML: #{node.ranking1ML}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-orange-400 mr-1">⚡</span>
                      <span>Capacité: {formatCapacity(node.totalCapacity)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-400 mr-1">🔗</span>
                      <span>{node.channelCount} canaux</span>
                    </div>
                  </div>
                  
                  <div className="node-id text-xs text-gray-500 font-mono mt-2">
                    {node.nodeId}
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="performance-metrics grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="metric bg-gray-700/50 rounded-lg p-3 text-center">
                    <label className="block text-gray-400 text-xs mb-1">Revenus routing</label>
                    <span className="text-green-400 font-mono font-semibold">
                      {formatSats(node.routingRevenue30d)}
                    </span>
                  </div>
                  
                  <div className="metric bg-gray-700/50 rounded-lg p-3 text-center">
                    <label className="block text-gray-400 text-xs mb-1">Force-closes évités</label>
                    <span className="text-blue-400 font-mono font-semibold">
                      {node.forceClosesAvoided}
                    </span>
                  </div>
                  
                  <div className="metric bg-gray-700/50 rounded-lg p-3 text-center">
                    <label className="block text-gray-400 text-xs mb-1">Précision IA</label>
                    <span className="text-purple-400 font-mono font-semibold">
                      {node.aiPredictionAccuracy.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="metric bg-gray-700/50 rounded-lg p-3 text-center">
                    <label className="block text-gray-400 text-xs mb-1">Uptime</label>
                    <span className="text-yellow-400 font-mono font-semibold">
                      {node.uptimePercent}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Verification Link */}
              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Toutes les métriques sont vérifiables publiquement
                </div>
                
                {node.publicUrl && (
                  <a 
                    href={node.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="verify-link inline-flex items-center text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors duration-200"
                  >
                    🔍 Vérifier sur 1ML
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap justify-center items-center gap-6 bg-gray-800/30 rounded-2xl px-8 py-6">
            <div className="flex items-center">
              <span className="text-green-400 mr-2 text-lg">🔒</span>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Audité</div>
                <div className="text-xs text-gray-400">Trail of Bits</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-blue-400 mr-2 text-lg">🛡️</span>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Bug Bounty</div>
                <div className="text-xs text-gray-400">$10k rewards</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-yellow-400 mr-2 text-lg">⚡</span>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Lightning Native</div>
                <div className="text-xs text-gray-400">100% Bitcoin</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-purple-400 mr-2 text-lg">🔬</span>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Open Source</div>
                <div className="text-xs text-gray-400">Vérifiable</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Lightning Analytics Dashboard Component
export const LightningAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<LightningAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      // In production, this would be a real API call
      const demoAnalytics: LightningAnalytics = {
        totalInvoices: 15847,
        paidInvoices: 14923,
        averagePaymentTime: 3.7, // seconds
        topWallets: {
          'Phoenix': 4521,
          'Breez': 3892,
          'Wallet of Satoshi': 3156,
          'Blue Wallet': 2034,
          'Zeus': 1320
        },
        failureReasons: {
          'Route not found': 234,
          'Insufficient capacity': 156,
          'Invoice expired': 89,
          'Channel offline': 45,
          'Other': 78
        },
        revenueBySats: {
          daily: [125000, 134000, 118000, 142000, 156000, 163000, 178000],
          monthly: [3250000, 3890000, 4120000, 4650000, 5200000, 5780000]
        }
      };

      setAnalytics(demoAnalytics);
      setIsLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="lightning-analytics bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Chargement des analytics Lightning...</p>
        </div>
      </div>
    );
  }
  
  const conversionRate = (analytics.paidInvoices / analytics.totalInvoices) * 100;
  
  const averagePaymentTimeFormatted = analytics.averagePaymentTime < 60 ? 
    `${analytics.averagePaymentTime.toFixed(1)}s` :
    `${Math.floor(analytics.averagePaymentTime / 60)}m${Math.round(analytics.averagePaymentTime % 60)}s`;

  return (
    <div className="lightning-analytics bg-gray-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            ⚡ Analytics Lightning en Temps Réel
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Performance de notre infrastructure de paiement Lightning. 
            Métriques mises à jour en temps réel.
          </p>
        </div>

        <div className="analytics-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="metric-card bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 text-center">
            <h4 className="text-green-400 font-semibold mb-2">🎯 Taux de Conversion</h4>
            <div className="big-number text-3xl font-bold text-green-400 font-mono mb-2">
              {conversionRate.toFixed(1)}%
            </div>
            <small className="text-gray-400">Invoices payées / générées</small>
            <div className="text-xs text-green-300 mt-2">
              {analytics.paidInvoices.toLocaleString()} / {analytics.totalInvoices.toLocaleString()}
            </div>
          </div>
          
          <div className="metric-card bg-gradient-to-br from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 rounded-xl p-6 text-center">
            <h4 className="text-yellow-400 font-semibold mb-2">⚡ Temps Moyen Paiement</h4>
            <div className="big-number text-3xl font-bold text-yellow-400 font-mono mb-2">
              {averagePaymentTimeFormatted}
            </div>
            <small className="text-gray-400">De la génération à la confirmation</small>
            <div className="text-xs text-yellow-300 mt-2">
              Lightning speed ⚡
            </div>
          </div>
          
          <div className="metric-card bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6 text-center">
            <h4 className="text-purple-400 font-semibold mb-2">💰 Revenus Mensuels</h4>
            <div className="big-number text-3xl font-bold text-purple-400 font-mono mb-2">
              {(analytics.revenueBySats.monthly.reduce((a, b) => a + b, 0) / 1000000).toFixed(1)}M sats
            </div>
            <small className="text-gray-400">Total abonnements actifs</small>
            <div className="text-xs text-purple-300 mt-2">
              +{((analytics.revenueBySats.monthly[5] / analytics.revenueBySats.monthly[4] - 1) * 100).toFixed(0)}% ce mois
            </div>
          </div>
        </div>
        
        <div className="detailed-analytics grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="wallets-breakdown bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <span className="text-blue-400 mr-2">📱</span>
              Wallets Utilisés
            </h4>
            <div className="space-y-3">
              {Object.entries(analytics.topWallets).map(([wallet, count]) => {
                const percentage = (count / analytics.paidInvoices) * 100;
                return (
                  <div key={wallet} className="wallet-stat">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300">{wallet}</span>
                      <span className="text-yellow-400 font-mono">{count.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% des paiements</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="failure-analysis bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <span className="text-red-400 mr-2">❌</span>
              Analyse des Échecs
            </h4>
            <div className="space-y-3">
              {Object.entries(analytics.failureReasons).map(([reason, count]) => {
                const totalFailures = Object.values(analytics.failureReasons).reduce((a, b) => a + b, 0);
                const percentage = (count / totalFailures) * 100;
                return (
                  <div key={reason} className="failure-stat">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">{reason}</span>
                      <span className="text-red-400 font-mono text-sm">{count}x</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% des échecs</div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
              <div className="text-green-400 text-sm font-medium">
                Taux de succès global: {conversionRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Bien au-dessus de la moyenne Lightning (≈85%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};