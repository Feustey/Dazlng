"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export interface AnalyticsData {
  stats: {
    pageviews: { value: number };
    visitors: { value: number };
    visits: { value: number };
    bounces: { value: number };
    totaltime: { value: number };
  };
  pageviews: {
    pageviews: Array<{ x: string; y: number }>;
  };
  metrics: {
    browsers: Array<{ x: string; y: number }>;
    os: Array<{ x: string; y: number }>;
    devices: Array<{ x: string; y: number }>;
    countries: Array<{ x: string; y: number }>;
  };
  events: Array<{ x: string; y: number }>;
  realtime: {
    timestamp: string;
    active_visitors: number;
    active_sessions: number;
    current_pageviews: number;
  };
}

export interface ApiResponse {
  success: boolean;
  data: AnalyticsData;
  source: "mock" | "umami" | "mock_fallback";
  timestamp: string;
  error?: string;
}

const AnalyticsPage: React.FC = () => {
  const { t } = useAdvancedTranslation("analytics");

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [source, setSource] = useState<"mock" | "umami" | "mock_fallback">("mock");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setAnalyticsData(data.data);
        setSource(data.source);
        setLastUpdated(data.timestamp);
      } else {
        setError(data.error || "Erreur lors du chargement des données");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, [loadAnalytics]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const calculateBounceRate = (): number => {
    if (!analyticsData) return 0;
    const { bounces, visits } = analyticsData.stats;
    return visits.value > 0 ? Math.round((bounces.value / visits.value) * 100) : 0;
  };

  const calculateAvgSessionDuration = (): string => {
    if (!analyticsData) return "0s";
    const { totaltime, visits } = analyticsData.stats;
    const avgSeconds = visits.value > 0 ? Math.round(totaltime.value / visits.value) : 0;
    return formatDuration(avgSeconds);
  };

  const getSourceBadge = () => {
    const badges = {
      "mock": { color: "bg-yellow-100 text-yellow-800", text: "Données de test" },
      "umami": { color: "bg-green-100 text-green-800", text: "Umami Live" },
      "mock_fallback": { color: "bg-orange-100 text-orange-800", text: "Fallback" }
    };
    
    const badge = badges[source as keyof typeof badges] || badges.mock;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading && !analyticsData) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded mt-6"></div>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header  */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-gray-600">Statistiques de trafic et d'engagement</p>
            {getSourceBadge()}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Sélecteur de période  */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Dernières 24h</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
          
          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "🔄" : "↻"} Actualiser
          </button>
        </div>
      </div>

      {/* Stats en temps réel  */}
      {analyticsData && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Temps réel</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.realtime.active_visitors}</div>
              <div className="text-sm text-blue-700">Visiteurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.realtime.active_sessions}</div>
              <div className="text-sm text-blue-700">Sessions actives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.realtime.current_pageviews}</div>
              <div className="text-sm text-blue-700">Pages vues</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats principales */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pages vues</p>
                <p className="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.stats.pageviews.value)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Visiteurs</p>
                <p className="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.stats.visitors.value)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de rebond</p>
                <p className="text-2xl font-semibold text-gray-900">{calculateBounceRate()}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Durée moyenne</p>
                <p className="text-2xl font-semibold text-gray-900">{calculateAvgSessionDuration()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graphiques et métriques détaillées */}
      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique des pages vues */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des pages vues</h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {analyticsData.pageviews.pageviews.slice(-7).map((point, index) => (
                <div key={index} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${(point.y / Math.max(...analyticsData.pageviews.pageviews.map(p => p.y))) * 100}%` }}></div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Dernières 7 périodes
            </div>
          </div>

          {/* Répartition par navigateur */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigateurs</h3>
            <div className="space-y-3">
              {analyticsData.metrics.browsers.slice(0, 5).map((browser, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{browser.x}</span>
                  <span className="text-sm font-medium text-gray-900">{browser.y}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer avec timestamp */}
      {lastUpdated && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Dernière mise à jour : {new Date(lastUpdated).toLocaleString('fr-FR')}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
export const dynamic = "force-dynamic";