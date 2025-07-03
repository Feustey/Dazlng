'use client';

import React, { useState, useEffect } from 'react';

interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  averageFee: number;
  networkUptime: number;
  onlineNodes: number;
}

interface RealTimeStatsProps {
  userStats?: {
    rank: number;
    score: number;
    efficiency: number;
  };
}

const RealTimeStats: React.FC<RealTimeStatsProps> = ({ userStats }) => {
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalNodes: 15847,
    totalChannels: 68423,
    totalCapacity: 4950.5,
    averageFee: 0.0012,
    networkUptime: 99.7,
    onlineNodes: 15234
  });

  const [isLive, setIsLive] = useState(true);

  // Simulation de données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        totalNodes: prev.totalNodes + Math.floor(Math.random() * 3) - 1,
        totalChannels: prev.totalChannels + Math.floor(Math.random() * 10) - 5,
        totalCapacity: prev.totalCapacity + (Math.random() * 10 - 5),
        averageFee: prev.averageFee + (Math.random() * 0.0001 - 0.00005),
        onlineNodes: prev.onlineNodes + Math.floor(Math.random() * 20) - 10
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ 
    icon, 
    label, 
    value, 
    unit, 
    change, 
    color = 'blue' 
  }: { 
    icon: string;
    label: string;
    value: string | number;
    unit?: string;
    change?: number;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200',
      red: 'bg-red-50 border-red-200'
    };

    return (
      <div className={`${colorClasses[color]} border rounded-lg p-4 relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{icon}</div>
            <div>
              <div className="text-sm text-gray-600">{label}</div>
              <div className="text-xl font-bold flex items-center">
                {typeof value === 'number' ? value.toLocaleString() : value}
                {unit && <span className="text-sm ml-1 text-gray-500">{unit}</span>}
              </div>
            </div>
          </div>
          {change !== undefined && (
            <div className={`text-xs font-medium px-2 py-1 rounded ${
              change > 0 ? 'bg-green-100 text-green-700' : 
              change < 0 ? 'bg-red-100 text-red-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>
        
        {/* Effet de pulse pour les données en temps réel */}
        <div className={`absolute inset-0 ${colorClasses[color]} opacity-20 animate-pulse`}></div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header avec indicateur temps réel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-800">
            🌐 Réseau Lightning en Temps Réel
          </h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Dernière mise à jour</div>
          <div className="text-xs text-gray-400">
            {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Statistiques du réseau */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon="🔗"
          label="Nœuds Total"
          value={networkStats.totalNodes}
          color="blue"
          change={0.15}
        />
        <StatCard
          icon="⚡"
          label="Nœuds En Ligne"
          value={networkStats.onlineNodes}
          color="green"
          change={-0.08}
        />
        <StatCard
          icon="📊"
          label="Canaux Actifs"
          value={networkStats.totalChannels}
          color="purple"
          change={0.34}
        />
        <StatCard
          icon="💰"
          label="Capacité Totale"
          value={networkStats.totalCapacity.toFixed(1)}
          unit="BTC"
          color="orange"
          change={1.2}
        />
        <StatCard
          icon="🎯"
          label="Frais Moyens"
          value={`${(networkStats.averageFee * 100).toFixed(3)}`}
          unit="%"
          color="red"
          change={-2.1}
        />
        <StatCard
          icon="⏱️"
          label="Uptime Réseau"
          value={`${networkStats.networkUptime}`}
          unit="%"
          color="green"
          change={0.02}
        />
      </div>

      {/* Votre position dans le réseau */}
      {userStats && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">🏆 Votre Position</h3>
            <div className="flex items-center space-x-2">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Rang #{userStats.rank}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{userStats.score}</div>
              <div className="text-sm text-gray-600">Score Total</div>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(userStats.score, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{userStats.efficiency}%</div>
              <div className="text-sm text-gray-600">Efficacité</div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${userStats.efficiency}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(((networkStats.totalNodes - userStats.rank) / networkStats.totalNodes) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Top Percentile</div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.round(((networkStats.totalNodes - userStats.rank) / networkStats.totalNodes) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Santé du réseau */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">💚 Santé du Réseau</h4>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Excellent</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              {Math.round((networkStats.onlineNodes / networkStats.totalNodes) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Nœuds Actifs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {networkStats.networkUptime}%
            </div>
            <div className="text-xs text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {Math.round(networkStats.totalChannels / networkStats.totalNodes * 10) / 10}
            </div>
            <div className="text-xs text-gray-600">Canaux/Nœud</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {Math.round(networkStats.totalCapacity / networkStats.totalNodes * 100) / 100}
            </div>
            <div className="text-xs text-gray-600">BTC/Nœud</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeStats;export const dynamic = "force-dynamic";
