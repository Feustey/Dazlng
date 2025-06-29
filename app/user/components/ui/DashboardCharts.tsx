'use client';

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  trend?: number[];
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700'
  };

  const changeColor = change && change > 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`rounded-xl border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        </div>
        {change !== undefined && (
          <div className={`text-sm font-medium ${changeColor}`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      
      {trend && (
        <div className="h-12 flex items-end space-x-1">
          {trend.map((point, index) => (
            <div
              key={index}
              className={`flex-1 ${color === 'blue' ? 'bg-blue-200' : 
                           color === 'green' ? 'bg-green-200' :
                           color === 'purple' ? 'bg-purple-200' :
                           color === 'yellow' ? 'bg-yellow-200' : 'bg-red-200'} rounded-t`}
              style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = '#8B5CF6',
  label 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
      )}
    </div>
  );
};

interface LineChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  gradient?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  labels, 
  height = 200, 
  color = '#8B5CF6',
  gradient = true 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        )}
        
        {gradient && (
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`url(#${gradientId})`}
          />
        )}
        
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      
      {labels && (
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

interface DashboardChartsProps {
  metrics: {
    totalRevenue: number;
    activeChannels: number;
    uptime: number;
    efficiency: number;
    revenueChange: number;
    channelsChange: number;
    uptimeChange: number;
    efficiencyChange: number;
  };
  trendData: {
    revenue: number[];
    channels: number[];
    uptime: number[];
  };
  profileCompletion: number;
  userScore: number;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  metrics, 
  trendData, 
  profileCompletion,
  userScore 
}) => {
  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Revenus Lightning"
          value={`${metrics.totalRevenue.toLocaleString()} sats`}
          change={metrics.revenueChange}
          icon="💰"
          trend={trendData.revenue}
          color="green"
        />
        <MetricCard
          title="Canaux Actifs"
          value={metrics.activeChannels}
          change={metrics.channelsChange}
          icon="🔗"
          trend={trendData.channels}
          color="blue"
        />
        <MetricCard
          title="Uptime"
          value={`${metrics.uptime}%`}
          change={metrics.uptimeChange}
          icon="⚡"
          trend={trendData.uptime}
          color="purple"
        />
        <MetricCard
          title="Efficacité"
          value={`${metrics.efficiency}%`}
          change={metrics.efficiencyChange}
          icon="🎯"
          color="yellow"
        />
      </div>

      {/* Graphiques de progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique de revenus */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              📈 Évolution des revenus (7 derniers jours)
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">
                +{metrics.revenueChange}%
              </span>
              <span className="text-sm text-gray-500">vs semaine précédente</span>
            </div>
          </div>
          <LineChart 
            data={trendData.revenue}
            labels={['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']}
            height={200}
            color="#10B981"
            gradient={true}
          />
        </div>

        {/* Métriques circulaires */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
            📊 Performance Globale
          </h3>
          <div className="space-y-6">
            <CircularProgress 
              percentage={profileCompletion} 
              color="#8B5CF6"
              label="Profil Complété"
              size={100}
            />
            <CircularProgress 
              percentage={userScore} 
              color="#3B82F6"
              label="Score Utilisateur"
              size={100}
            />
            <CircularProgress 
              percentage={metrics.uptime} 
              color="#10B981"
              label="Uptime Nœud"
              size={100}
            />
          </div>
        </div>
      </div>

      {/* Graphique de comparaison réseau */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            🌐 Performance vs Réseau Lightning
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Votre nœud</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">Moyenne réseau</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.efficiency}%</div>
            <div className="text-sm text-gray-600 mb-4">Efficacité de routage</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.efficiency}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">Moyenne: 65%</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.uptime}%</div>
            <div className="text-sm text-gray-600 mb-4">Disponibilité</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.uptime}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">Moyenne: 92%</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.activeChannels}</div>
            <div className="text-sm text-gray-600 mb-4">Canaux actifs</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((metrics.activeChannels / 20) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">Recommandé: 15-20</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;