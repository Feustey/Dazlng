import React, { useEffect, useState } from 'react';

interface UmamiStatsResponse {
  pageviews: number;
  uniques: number;
  bounces: number;
  totaltime: number;
  bouncerate: number;
  avgDuration: number;
  pageviewsChange?: number;
  uniquesChange?: number;
  topPages: Array<{ x: string; y: number }>;
  referrers: Array<{ url: string; views: number; visitors: number }>;
  events: Array<{ x: string; y: number }>;
  avgSessionDuration: number;
  totalSessions: number;
}

interface AnalyticsData {
  umami: UmamiStatsResponse;
  business: {
    totalUsers: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    activeUsers: number;
    premiumUsers: number;
    conversionRate: number;
    churnRate: number;
  };
  performance: {
    totalRevenue: number;
    monthlyRevenue: number;
    avgOrderValue: number;
    totalOrders: number;
    pendingOrders: number;
  };
  funnel: {
    visitors: number;
    signups: number;
    verifiedUsers: number;
    firstPurchase: number;
    premiumConversions: number;
    conversionRates: {
      visitorsToSignups: number;
      signupsToVerified: number;
      verifiedToPurchase: number;
      purchaseToPremium: number;
    };
  };
}

interface AnalyticsOverviewProps {
  period?: number;
  className?: string;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ 
  period = 7, 
  className = "" 
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  async function fetchAnalytics(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        period: period.toString(),
        realtime: 'false'
      });

      const res = await fetch(`/api/admin/analytics?${params}`);

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        throw new Error(data.error?.message || 'Erreur lors de la récupération des analytics');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      console.error('Erreur analytics overview:', e);
    } finally {
      setLoading(false);
    }
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR');
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatSats = (sats: number): string => {
    if (sats >= 100000000) {
      return `₿${(sats / 100000000).toFixed(3)}`;
    }
    return `${formatNumber(sats)} sats`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
        <div className="text-center py-4">
          <div className="text-red-600 mb-2">⚠️ Erreur Analytics</div>
          <div className="text-sm text-gray-600">{error}</div>
          <button 
            onClick={fetchAnalytics}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Analytics Overview ({period}j)
        </h2>
        <a 
          href="/admin/analytics" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Voir détails →
        </a>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Visiteurs"
          value={formatNumber(analytics.umami.uniques)}
          change={analytics.umami.uniquesChange}
          icon="👥"
          color="blue"
        />
        <MetricCard
          label="Pages vues"
          value={formatNumber(analytics.umami.pageviews)}
          change={analytics.umami.pageviewsChange}
          icon="📊"
          color="green"
        />
        <MetricCard
          label="Conversion"
          value={formatPercentage(analytics.business.conversionRate)}
          icon="🎯"
          color="purple"
        />
        <MetricCard
          label="Revenus"
          value={formatSats(analytics.performance.monthlyRevenue)}
          icon="💰"
          color="orange"
        />
      </div>

      {/* Funnel simplifié */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        <FunnelMini
          label="Visiteurs"
          value={analytics.funnel.visitors}
          percentage={100}
          color="bg-blue-100 text-blue-800"
        />
        <FunnelMini
          label="Signups"
          value={analytics.funnel.signups}
          percentage={analytics.funnel.conversionRates.visitorsToSignups}
          color="bg-green-100 text-green-800"
        />
        <FunnelMini
          label="Vérifiés"
          value={analytics.funnel.verifiedUsers}
          percentage={analytics.funnel.conversionRates.signupsToVerified}
          color="bg-yellow-100 text-yellow-800"
        />
        <FunnelMini
          label="Achat"
          value={analytics.funnel.firstPurchase}
          percentage={analytics.funnel.conversionRates.verifiedToPurchase}
          color="bg-purple-100 text-purple-800"
        />
        <FunnelMini
          label="Premium"
          value={analytics.funnel.premiumConversions}
          percentage={analytics.funnel.conversionRates.purchaseToPremium}
          color="bg-indigo-100 text-indigo-800"
        />
      </div>

      {/* Top pages */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Pages Populaires</h3>
        <div className="space-y-2">
          {analytics.umami.topPages.slice(0, 3).map((page, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-gray-600 truncate">{page.x}</span>
              <span className="font-semibold text-blue-600">{formatNumber(page.y)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };

  return (
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="text-lg mb-1">{icon}</div>
      <div className={`text-lg font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
      {change !== undefined && (
        <div className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
        </div>
      )}
    </div>
  );
};

interface FunnelMiniProps {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const FunnelMini: React.FC<FunnelMiniProps> = ({ label, value, percentage, color }) => {
  return (
    <div className="text-center">
      <div className={`rounded-lg p-2 ${color}`}>
        <div className="text-sm font-bold">{value.toLocaleString()}</div>
        <div className="text-xs">{label}</div>
        <div className="text-xs">{percentage.toFixed(1)}%</div>
      </div>
    </div>
  );
};

export default AnalyticsOverview; 