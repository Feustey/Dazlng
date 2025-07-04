'use client';

import React, { useState, useEffect } from 'react';

interface ChannelHealth {
  channelId: string;
  alias: string;
  capacity: number;
  localBalance: number;
  remoteBalance: number;
  healthScore: number;
  predictedForceClose: {
    probability: number;
    timeframe: string;
    reason: string;
  };
  status: 'healthy' | 'warning' | 'critical';
  lastUpdate: Date;
}

interface LiveChannelMonitorProps {
  isDemo?: boolean;
  maxChannels?: number;
}

export const LiveChannelMonitor: React.FC<LiveChannelMonitorProps> = ({ 
  isDemo = true, 
  maxChannels = 4 
}) => {
  const [channels, setChannels] = useState<ChannelHealth[]>([]);
  const [alertsCount, setAlertsCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate demo data or connect to real WebSocket
    if (isDemo) {
      // Generate demo channel data
      const demoChannels: ChannelHealth[] = [
        {
          channelId: '850x1840x0',
          alias: 'WalletOfSatoshi.com',
          capacity: 16777216, // sats
          localBalance: 12582912,
          remoteBalance: 4194304,
          healthScore: 87,
          predictedForceClose: {
            probability: 0.12,
            timeframe: '48h',
            reason: 'Déséquilibre liquidité'
          },
          status: 'healthy',
          lastUpdate: new Date()
        },
        {
          channelId: '751x2156x1',
          alias: 'LNBig.com [lnd-01]',
          capacity: 5000000,
          localBalance: 500000,
          remoteBalance: 4500000,
          healthScore: 92,
          predictedForceClose: {
            probability: 0.05,
            timeframe: '7d+',
            reason: 'Excellent équilibre'
          },
          status: 'healthy',
          lastUpdate: new Date()
        },
        {
          channelId: '742x1945x0',
          alias: 'Kraken 🐙⚡',
          capacity: 10000000,
          localBalance: 9800000,
          remoteBalance: 200000,
          healthScore: 34,
          predictedForceClose: {
            probability: 0.78,
            timeframe: '6h',
            reason: 'Liquidité épuisée côté distant'
          },
          status: 'critical',
          lastUpdate: new Date()
        },
        {
          channelId: '693x1547x2',
          alias: 'Bitrefill',
          capacity: 2000000,
          localBalance: 1100000,
          remoteBalance: 900000,
          healthScore: 78,
          predictedForceClose: {
            probability: 0.23,
            timeframe: '24h',
            reason: 'Utilisation intensive'
          },
          status: 'warning',
          lastUpdate: new Date()
        }
      ];

      setChannels(demoChannels.slice(0, maxChannels));
      setAlertsCount(demoChannels.filter(c => c.status === 'critical' || c.status === 'warning').length);
      setIsConnected(true);

      // Simulate real-time updates
      const interval = setInterval(() => {
        setChannels(prev => prev.map(channel => {
          // Simulate small balance changes
          const balanceChange = Math.floor(Math.random() * 20000) - 10000;
          const newLocalBalance = Math.max(0, Math.min(channel.capacity, channel.localBalance + balanceChange));
          const newRemoteBalance = channel.capacity - newLocalBalance;
          
          // Recalculate health score based on balance
          const balanceRatio = Math.min(newLocalBalance, newRemoteBalance) / (channel.capacity / 2);
          const newHealthScore = Math.floor(balanceRatio * 100);
          
          // Update force-close prediction
          const newProbability = newHealthScore < 30 ? 0.7 + Math.random() * 0.3 : 
                                newHealthScore < 60 ? 0.2 + Math.random() * 0.3 : 
                                Math.random() * 0.2;

          return {
            ...channel,
            localBalance: newLocalBalance,
            remoteBalance: newRemoteBalance,
            healthScore: newHealthScore,
            predictedForceClose: {
              ...channel.predictedForceClose,
              probability: newProbability
            },
            status: newHealthScore < 30 ? 'critical' as const :
                   newHealthScore < 60 ? 'warning' as const : 'healthy' as const,
            lastUpdate: new Date()
          };
        }));
      }, 5000); // Update every 5 seconds for demo

      return () => clearInterval(interval);
    } else {
      // Real WebSocket connection would go here
      const ws = new WebSocket('wss://api.dazno.de/live-channels');
      
      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => setIsConnected(false);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChannels(data.channels);
        setAlertsCount(data.alerts);
      };
      
      return () => ws.close();
    }
  }, [isDemo, maxChannels]);

  const getHealthColor = (score: number): string => {
    if (score >= 80) return 'text-green-400 bg-green-400/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/20';
    if (score >= 40) return 'text-orange-400 bg-orange-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  const getStatusIcon = (status: ChannelHealth['status']): string => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  const formatSats = (sats: number): string => {
    if (sats >= 1000000) return `${(sats / 1000000).toFixed(1)}M`;
    if (sats >= 1000) return `${(sats / 1000).toFixed(0)}k`;
    return sats.toString();
  };

  const formatTimeframe = (timeframe: string): string => {
    return timeframe.replace('h', ' heures').replace('d', ' jours');
  };

  return (
    <div className="live-channel-monitor bg-gray-900 border border-gray-700 rounded-2xl p-6">
      
      {/* Header */}
      <div className="monitor-header flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-xl font-bold text-white mr-3">{t('LiveChannelMonitor._monitoring_ia_en_direct')}</h3>
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </div>
        </div>
        
        <div className="alerts-badge">
          {alertsCount > 0 && (
            <div className="flex items-center bg-red-400/20 border border-red-400 text-red-400 px-3 py-1 rounded-full text-sm">
              <span className="animate-pulse mr-2">⚠️</span>
              {alertsCount} alerte{alertsCount > 1 ? 's' : ''} active{alertsCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Channels Grid */}
      <div className="channels-grid grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {channels.map(channel => (
          <div key={channel.channelId} className="channel-card bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors duration-300">
            
            {/* Channel Header */}
            <div className="channel-header flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="status-icon text-lg mr-2">{getStatusIcon(channel.status)}</span>
                <div>
                  <span className="alias text-white font-medium block">{channel.alias}</span>
                  <span className="channel-id text-xs text-gray-500 font-mono">{channel.channelId}</span>
                </div>
              </div>
              <div className={`health-indicator px-2 py-1 rounded-lg text-sm font-mono ${getHealthColor(channel.healthScore)}`}>
                {channel.healthScore}/100
              </div>
            </div>
            
            {/* Balance Bar */}
            <div className="balance-section mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Local: {formatSats(channel.localBalance)} sats</span>
                <span>Remote: {formatSats(channel.remoteBalance)} sats</span>
              </div>
              <div className="balance-bar relative bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="local-balance absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ width: `${(channel.localBalance / channel.capacity) * 100}%` }}
                />
                <div 
                  className="remote-balance absolute right-0 top-0 h-full bg-gradient-to-l from-green-500 to-green-400 transition-all duration-500"
                  style={{ width: `${(channel.remoteBalance / channel.capacity) * 100}%` }}
                />
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">
                Capacité: {formatSats(channel.capacity)} sats
              </div>
            </div>
            
            {/* Force-close Warning */}
            {channel.predictedForceClose.probability > 0.3 && (
              <div className="force-close-warning bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                <div className="flex items-center text-red-400 text-sm font-medium mb-1">
                  ⚠️ Risque de force-close élevé
                </div>
                <div className="text-xs text-gray-300 mb-1">
                  Probabilité: {Math.round(channel.predictedForceClose.probability * 100)}% dans {formatTimeframe(channel.predictedForceClose.timeframe)}
                </div>
                <div className="text-xs text-gray-400">
                  {channel.predictedForceClose.reason}
                </div>
              </div>
            )}

            {/* Last Update */}
            <div className="text-xs text-gray-500 text-right mt-2">
              Mis à jour: {channel.lastUpdate.toLocaleTimeString('fr-FR')}
            </div>
          </div>
        ))}
      </div>
      
      {/* CTA Section */}
      <div className="cta-section text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-white mb-2">
            Surveillez tous vos canaux avec l'IA DazNode
          </h4>
          <p className="text-gray-400 text-sm">
            Prédictions en temps réel • Alertes instantanées • Optimisation automatique
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-300 transition-colors duration-300">
            Protéger mes {channels.length}+ canaux
          </button>
          <button className="border border-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:border-yellow-400 hover:bg-yellow-400/10 transition-colors duration-300">
            Voir la démo complète
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Essai gratuit 7 jours • Configuration en 5 minutes
        </p>
      </div>
    </div>
  );
};