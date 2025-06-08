"use client";

import { useEffect, useState } from "react";
import FunnelAnalytics from "../../../components/shared/ui/FunnelAnalytics";

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

export default function AnalyticsPage(): JSX.Element {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<number>(30);
  const [realtime, setRealtime] = useState<boolean>(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period, realtime]);

  async function fetchAnalytics(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        period: period.toString(),
        realtime: realtime.toString()
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
      console.error('Erreur analytics:', e);
    } finally {
      setLoading(false);
    }
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR');
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds) return "-";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}m ${sec}s`;
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        
        {/* Contrôles de période */}
        <div className="flex gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod(1)}
              className={`px-3 py-2 rounded text-sm ${period === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              24h
            </button>
            <button
              onClick={() => setPeriod(7)}
              className={`px-3 py-2 rounded text-sm ${period === 7 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              7j
            </button>
            <button
              onClick={() => setPeriod(30)}
              className={`px-3 py-2 rounded text-sm ${period === 30 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              30j
            </button>
          </div>
          
          <button
            onClick={() => setRealtime(!realtime)}
            className={`px-3 py-2 rounded text-sm ${realtime ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            🔴 {realtime ? 'Live' : 'Historique'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des analytics...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-800 font-semibold">Erreur</div>
          <div className="text-red-600">{error}</div>
          <button 
            onClick={fetchAnalytics}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      )}

      {analytics && (
        <>
          {/* Métriques de trafic Umami */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Vues de Pages"
              value={formatNumber(analytics.umami.pageviews)}
              change={analytics.umami.pageviewsChange}
              icon="📊"
            />
            <StatCard
              label="Visiteurs Uniques"
              value={formatNumber(analytics.umami.uniques)}
              change={analytics.umami.uniquesChange}
              icon="👥"
            />
            <StatCard
              label="Taux de Rebond"
              value={formatPercentage(analytics.umami.bouncerate)}
              icon="↩️"
            />
            <StatCard
              label="Durée Moyenne"
              value={formatDuration(analytics.umami.avgDuration)}
              icon="⏱️"
            />
          </div>

          {/* Métriques Business */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Métriques Business</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatNumber(analytics.business.totalUsers)}</div>
                <div className="text-sm text-gray-600">Total Utilisateurs</div>
                <div className="text-xs text-green-600">+{analytics.business.newUsersThisWeek} cette semaine</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatNumber(analytics.business.premiumUsers)}</div>
                <div className="text-sm text-gray-600">Utilisateurs Premium</div>
                <div className="text-xs text-gray-500">{formatPercentage((analytics.business.premiumUsers / analytics.business.totalUsers) * 100)} du total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatPercentage(analytics.business.conversionRate)}</div>
                <div className="text-sm text-gray-600">Taux de Conversion</div>
                <div className="text-xs text-gray-500">Visiteurs → Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{formatSats(analytics.performance.monthlyRevenue)}</div>
                <div className="text-sm text-gray-600">Revenus Mensuels</div>
                <div className="text-xs text-gray-500">{formatNumber(analytics.performance.totalOrders)} commandes</div>
              </div>
            </div>
          </div>

          {/* Funnel de Conversion */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Funnel de Conversion</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <FunnelStep
                label="Visiteurs"
                value={analytics.funnel.visitors}
                color="blue"
                conversion={100}
              />
              <FunnelStep
                label="Inscriptions"
                value={analytics.funnel.signups}
                color="green"
                conversion={analytics.funnel.conversionRates.visitorsToSignups}
              />
              <FunnelStep
                label="Vérifiés"
                value={analytics.funnel.verifiedUsers}
                color="yellow"
                conversion={analytics.funnel.conversionRates.signupsToVerified}
              />
              <FunnelStep
                label="Premier Achat"
                value={analytics.funnel.firstPurchase}
                color="purple"
                conversion={analytics.funnel.conversionRates.verifiedToPurchase}
              />
              <FunnelStep
                label="Premium"
                value={analytics.funnel.premiumConversions}
                color="indigo"
                conversion={analytics.funnel.conversionRates.purchaseToPremium}
              />
            </div>
          </div>

          {/* Top Pages et Sources de Trafic */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Pages */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Pages Populaires</h2>
              <div className="space-y-2">
                {analytics.umami.topPages.slice(0, 10).map((page, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600 truncate">{page.x}</span>
                    <span className="font-semibold text-blue-600">{formatNumber(page.y)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources de Trafic */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Sources de Trafic</h2>
              <div className="space-y-2">
                {analytics.umami.referrers.slice(0, 10).map((referrer, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600 truncate">{referrer.url || 'Direct'}</span>
                    <div className="text-right">
                      <span className="font-semibold text-purple-600">{formatNumber(referrer.visitors)}</span>
                      <div className="text-xs text-gray-500">{formatNumber(referrer.views)} vues</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Événements Personnalisés */}
          {analytics.umami.events.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Événements Trackés</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analytics.umami.events.slice(0, 6).map((event, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-indigo-600">{formatNumber(event.y)}</div>
                    <div className="text-sm text-gray-600">{event.x}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Funnel Analytics (composant existant) */}
          <div className="mb-8">
            <FunnelAnalytics />
          </div>
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: string;
}

function StatCard({ label, value, change, icon }: StatCardProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {change !== undefined && (
            <div className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
    </div>
  );
}

interface FunnelStepProps {
  label: string;
  value: number;
  color: string;
  conversion: number;
}

function FunnelStep({ label, value, color, conversion }: FunnelStepProps): JSX.Element {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800'
  };

  return (
    <div className="text-center">
      <div className={`rounded-lg p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="text-sm">{label}</div>
        <div className="text-xs mt-1">{conversion.toFixed(1)}%</div>
      </div>
    </div>
  );
}
