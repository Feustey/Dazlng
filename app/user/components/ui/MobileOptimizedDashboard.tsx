'use client';

import React from 'react';

interface MobileStatsCardProps {
  icon: string;
  title: string;
  value: string | number;
  change?: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
  compact?: boolean;
}

const MobileStatsCard: React.FC<MobileStatsCardProps> = ({ 
  icon, 
  title, 
  value, 
  change, 
  color, 
  compact = false 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700'
  };

  return (
    <div className={`${colorClasses[color]} border-2 rounded-xl p-4 ${compact ? 'min-w-[140px]' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {change !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-xs font-medium text-gray-600 mb-1">{title}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
};

interface MobileProgressBarProps {
  label: string;
  percentage: number;
  color: string;
  showPercentage?: boolean;
}

const MobileProgressBar: React.FC<MobileProgressBarProps> = ({ 
  label, 
  percentage, 
  color, 
  showPercentage = true 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercentage && (
          <span className="text-sm font-bold text-gray-900">{percentage}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${color} h-3 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

interface MobileOptimizedDashboardProps {
  metrics: {
    totalRevenue: number;
    activeChannels: number;
    uptime: number;
    efficiency: number;
    revenueChange: number;
    channelsChange: number;
  };
  profileCompletion: number;
  userScore: number;
  userRank?: number;
  hasNode: boolean;
}

const MobileOptimizedDashboard: React.FC<MobileOptimizedDashboardProps> = ({ 
  metrics, 
  profileCompletion, 
  userScore, 
  userRank,
  hasNode 
}) => {
  return (
    <div className="md:hidden space-y-6">
      {/* Stats rapides en carrousel horizontal */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          📱 Aperçu Mobile
          <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Live
          </span>
        </h3>
        
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {hasNode ? (
            <>
              <MobileStatsCard
                icon="💰"
                title="Revenus"
                value={`${metrics.totalRevenue.toLocaleString()} sats`}
                change={metrics.revenueChange}
                color="green"
                compact
              />
              <MobileStatsCard
                icon="🔗"
                title="Canaux"
                value={metrics.activeChannels}
                change={metrics.channelsChange}
                color="blue"
                compact
              />
              <MobileStatsCard
                icon="⚡"
                title="Uptime"
                value={`${metrics.uptime}%`}
                color="purple"
                compact
              />
              <MobileStatsCard
                icon="🎯"
                title="user.useruserefficacit"
                value={`${metrics.efficiency}%`}
                color="orange"
                compact
              />
            </>
          ) : (
            <>
              <MobileStatsCard
                icon="📊"
                title="Score"
                value={userScore}
                color="purple"
                compact
              />
              <MobileStatsCard
                icon="✅"
                title="Profil"
                value={`${profileCompletion}%`}
                color="green"
                compact
              />
              {userRank && (
                <MobileStatsCard
                  icon="🏆"
                  title="Rang"
                  value={`#${userRank}`}
                  color="blue"
                  compact
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Barres de progression */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📈 Performance
        </h3>
        
        <div className="space-y-4">
          <MobileProgressBar
            label="Complétion du profil"
            percentage={profileCompletion}
            color="bg-green-500"
          />
          
          <MobileProgressBar
            label="Score utilisateur"
            percentage={userScore}
            color="bg-purple-500"
          />
          
          {hasNode && (
            <>
              <MobileProgressBar
                label="Uptime du nœud"
                percentage={metrics.uptime}
                color="bg-blue-500"
              />
              
              <MobileProgressBar
                label="Efficacité de routage"
                percentage={metrics.efficiency}
                color="bg-orange-500"
              />
            </>
          )}
        </div>
      </div>

      {/* Quick actions mobile */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🚀 Actions Rapides
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {hasNode ? (
            <>
              <button className="flex flex-col items-center p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="text-2xl mb-1">⚡</span>
                <span className="text-xs font-medium text-purple-700">Optimiser</span>
              </button>
              
              <button className="flex flex-col items-center p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="text-2xl mb-1">📊</span>
                <span className="text-xs font-medium text-blue-700">Analytics</span>
              </button>
              
              <button className="flex flex-col items-center p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl mb-1">🔗</span>
                <span className="text-xs font-medium text-green-700">Canaux</span>
              </button>
              
              <button className="flex flex-col items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                <span className="text-2xl mb-1">🤖</span>
                <span className="text-xs font-medium text-yellow-700">{t('user.dazia_ia')}</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => window.location.href = '/user/settings'}
                className="flex flex-col items-center p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <span className="text-2xl mb-1">🔧</span>
                <span className="text-xs font-medium text-purple-700">Connecter</span>
              </button>
              
              <button 
                onClick={() => window.location.href = '/user/node'}
                className="flex flex-col items-center p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="text-2xl mb-1">📖</span>
                <span className="text-xs font-medium text-blue-700">Guide</span>
              </button>
              
              <button 
                onClick={() => window.location.href = '/user/subscriptions'}
                className="flex flex-col items-center p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="text-2xl mb-1">💳</span>
                <span className="text-xs font-medium text-green-700">Premium</span>
              </button>
              
              <button 
                onClick={() => window.location.href = '/user/dazia'}
                className="flex flex-col items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <span className="text-2xl mb-1">🤖</span>
                <span className="text-xs font-medium text-yellow-700">{t('user.dazia_ia')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* État du réseau mobile */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🌐 Réseau Lightning
          <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">{t('user.158k')}</div>
            <div className="text-xs text-gray-600">{t('user.nuds')}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">{t('user.684k')}</div>
            <div className="text-xs text-gray-600">Canaux</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-purple-600">{t('user.495k')}</div>
            <div className="text-xs text-gray-600">{t('user.btc_total')}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-600">99.7%</div>
            <div className="text-xs text-gray-600">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedDashboard;export const dynamic = "force-dynamic";
