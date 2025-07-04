import React from 'react';
import Link from 'next/link';

export interface NodeMetrics {
  monthlyRevenue: number;
  totalCapacity: number;
  activeChannels: number;
  uptime: number;
  healthScore: number;
  routingEfficiency: number;
  revenueGrowth: number; // pourcentage de croissance
  rankInNetwork: number;
  totalNodes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface PerformanceMetricsProps {
  metrics: NodeMetrics;
  achievements: Achievement[];
  trendData: number[]; // Pour les graphiques simples
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  metrics,
  achievements,
  trendData
}) => {
  const formatSats = (sats: number): string => {
    return sats.toLocaleString('fr-FR');
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGrowthIndicator = (growth: number): JSX.Element => {
    if (growth > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <span>📈</span>
          <span className="text-sm font-medium">+{growth.toFixed(1)}%</span>
        </div>
  );
    } else if (growth < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <span>📉</span>
          <span className="text-sm font-medium">{growth.toFixed(1)}%</span>
        </div>
  );
    }
    return (
      <div className="flex items-center gap-1 text-gray-600">
        <span>➡️</span>
        <span className="text-sm font-medium">Stable</span>
      </div>
  );
  };

  const getRankBadge = (rank: number, total: number): JSX.Element => {
    const percentage = (rank / total) * 100;
    let badgeColor = 'bg-gray-100 text-gray-800';
    let badgeIcon = '🎯';

    if (percentage <= 5) {
      badgeColor = 'bg-yellow-100 text-yellow-800';
      badgeIcon = '🏆';
    } else if (percentage <= 20) {
      badgeColor = 'bg-purple-100 text-purple-800';
      badgeIcon = '⭐';
    } else if (percentage <= 50) {
      badgeColor = 'bg-blue-100 text-blue-800';
      badgeIcon = '🎖️';
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
        {badgeIcon} Top {percentage.toFixed(0)}%
      </span>
    );
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Header avec score global */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{t('user._performance_de_votre_nud')}</h2>
            <p className="text-gray-600">
              Tableau de bord complet de vos métriques Lightning
            </p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 px-4 py-2 rounded-lg ${getHealthScoreColor(metrics.healthScore)}`}>
              {metrics.healthScore}%
            </div>
            <div className="text-sm text-gray-500">{t('user.score_de_sant')}</div>
            {getRankBadge(metrics.rankInNetwork, metrics.totalNodes)}
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">💰</div>
              {getGrowthIndicator(metrics.revenueGrowth)}
            </div>
            <div className="text-2xl font-bold text-green-700 mb-1">
              {formatSats(metrics.monthlyRevenue)}
            </div>
            <div className="text-sm text-green-600">{t('user.revenus_30j')}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">⚡</div>
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {(metrics.totalCapacity / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {formatSats(metrics.totalCapacity)}
            </div>
            <div className="text-sm text-blue-600">{t('user.capacit_totale')}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">🔗</div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-purple-600">{metrics.activeChannels}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-700 mb-1">
              {metrics.activeChannels}
            </div>
            <div className="text-sm text-purple-600">{t('user.canaux_actifs')}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">⏱️</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                metrics.uptime >= 99 ? 'bg-green-100 text-green-600' : 
                metrics.uptime >= 95 ? 'bg-yellow-100 text-yellow-600' : 
                'bg-red-100 text-red-600'
              }`}>
                {metrics.uptime.toFixed(1)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-700 mb-1">
              {metrics.uptime.toFixed(1)}%
            </div>
            <div className="text-sm text-orange-600">Uptime</div>
          </div>
        </div>
      </div>

      {/* Tendances et graphique */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{t('user._tendances_des_revenus_7_derni')}</h3>
          <div className="text-sm text-gray-500">
            Efficacité de routage: <span className="font-semibold text-indigo-600">{metrics.routingEfficiency}%</span>
          </div>
        </div>

        <div className="mb-4">
          <SimpleChart data={trendData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-700">{Math.max(...trendData).toLocaleString()}</div>
            <div className="text-xs text-gray-500">{t('user.pic_journalier')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-700">{Math.round(trendData.reduce((a: any, b: any) => a + b, 0) / trendData.length).toLocaleString()}</div>
            <div className="text-xs text-gray-500">Moyenne</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-700">{Math.min(...trendData).toLocaleString()}</div>
            <div className="text-xs text-gray-500">Minimum</div>
          </div>
        </div>
      </div>

      {/* Achievements et gamification */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{t('user._succs_dbloqus')}</h3>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {unlockedAchievements.length}/{achievements.length}
          </span>
        </div>

        {/* Achievements débloqués */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {unlockedAchievements.slice(-4).map((achievement: any) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-2xl">{achievement.icon}</div>
              <div>
                <div className="font-semibold text-yellow-800">{achievement.title}</div>
                <div className="text-xs text-yellow-600">{achievement.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Prochain achievement */}
        {nextAchievement && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl opacity-50">{nextAchievement.icon}</div>
                <div>
                  <div className="font-semibold text-gray-700">{nextAchievement.title}</div>
                  <div className="text-xs text-gray-500">{nextAchievement.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  {nextAchievement.progress}/{nextAchievement.target}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(nextAchievement.progress / nextAchievement.target) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/user/node/channels"
          className="block p-4 bg-white rounded-xl border hover:shadow-lg transition"
        >
          <div className="text-2xl mb-2">🔗</div>
          <h3 className="font-semibold mb-2">{t('user.grer_les_canaux')}</h3>
          <p className="text-sm text-gray-600">{t('user.optimisez_votre_connectivit')}</p>
        </Link>

        <Link 
          href="/user/node/stats"
          className="block p-4 bg-white rounded-xl border hover:shadow-lg transition"
        >
          <div className="text-2xl mb-2">📈</div>
          <h3 className="font-semibold mb-2">{t('user.analyses_dtailles')}</h3>
          <p className="text-sm text-gray-600">{t('user.visualisez_vos_performances')}</p>
        </Link>

        <Link 
          href="/user/node/recommendations"
          className="block p-4 bg-white rounded-xl border hover:shadow-lg transition"
        >
          <div className="text-2xl mb-2">🧠</div>
          <h3 className="font-semibold mb-2">{t('user.recommandations_ia')}</h3>
          <p className="text-sm text-gray-600">{t('user.optimisations_personnalises')}</p>
        </Link>
      </div>
    </div>
  );
};

export interface SimpleChartProps {
  data: number[];
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end gap-1 h-16">
        {data.map((value: any, index: any) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className="bg-indigo-200 rounded-t flex-1 min-h-1"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
};

export { PerformanceMetrics }; export const dynamic = "force-dynamic";
