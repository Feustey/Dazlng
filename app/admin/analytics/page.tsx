"use client";

import React, { useState, useEffect, useCallback } from 'react';

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
  source: 'mock' | 'umami' | 'mock_fallback';
  timestamp: string;
  error?: string;
}

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [source, setSource] = useState<'mock' | 'umami' | 'mock_fallback'>('mock');
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
        setError(data.error || 'Erreur lors du chargement des données');
      }
    } catch (err) {
      setError('Erreur de connexion');
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
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
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
    if (!analyticsData) return '0s';
    const { totaltime, visits } = analyticsData.stats;
    const avgSeconds = visits.value > 0 ? Math.round(totaltime.value / visits.value) : 0;
    return formatDuration(avgSeconds);
  };

  const getSourceBadge = () => {
    const badges = {
      'mock': { color: 'bg-yellow-100 text-yellow-800', text: "admin.adminadmin_donnes_de_test" },
      'umami': { color: 'bg-green-100 text-green-800', text: "admin.adminadmin_umami_live" },
      'mock_fallback': { color: 'bg-orange-100 text-orange-800', text: "admin.adminadmin_fallback" }
    };
    
    const badge = badges[source as keyof typeof badges] || badges.mock;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading && !analyticsData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_: any, i: any) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">{t('admin.erreur_de_chargement')}</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadAnalytics}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <div className="flex items-center space-x-3 mt-1">
            <p className="text-gray-600">{t('admin.statistiques_de_trafic_et_deng')}</p>
            {getSourceBadge()}
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {/* Sélecteur de période */}
          <select 
            value={timeRange} 
            onChange={(e: any) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">{t('admin.dernires_24h')}</option>
            <option value="7d">{t('admin.7_derniers_jours')}</option>
            <option value="30d">{t('admin.30_derniers_jours')}</option>
            <option value="90d">{t('admin.90_derniers_jours')}</option>
          </select>
          
          <button 
            onClick={loadAnalytics}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? '🔄' : '↻'} Actualiser
          </button>
        </div>
      </div>

      {/* Stats en temps réel */}
      {analyticsData && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">{t('admin._temps_rel')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.realtime.active_visitors}</div>
              <div className="text-sm text-blue-700">{t('admin.visiteurs_actifs')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.realtime.active_sessions}</div>
              <div className="text-sm text-blue-700">{t('admin.sessions_actives')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.realtime.current_pageviews}</div>
              <div className="text-sm text-blue-700">{t('admin.pages_vues_maintenant')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques principales */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="text-3xl">👁️</div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(analyticsData.stats.pageviews.value)}
                </div>
                <div className="text-sm text-gray-600">{t('admin.pages_vues')}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="text-3xl">👥</div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(analyticsData.stats.visitors.value)}
                </div>
                <div className="text-sm text-gray-600">{t('admin.visiteurs_uniques')}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="text-3xl">🔄</div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{calculateBounceRate()}%</div>
                <div className="text-sm text-gray-600">{t('admin.taux_de_rebond')}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="text-3xl">⏱️</div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{calculateAvgSessionDuration()}</div>
                <div className="text-sm text-gray-600">{t('admin.dure_moyenne')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pages populaires */}
      {analyticsData && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin._pages_populaires')}</h3>
            <div className="space-y-3">
              {analyticsData.pageviews.pageviews.slice(0, 8).map((page: any, index: any) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 truncate flex-1">{page.x}</div>
                  <div className="text-sm font-medium text-gray-900 ml-2">
                    {formatNumber(page.y)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin._pays')}</h3>
            <div className="space-y-3">
              {analyticsData.metrics.countries.slice(0, 8).map((country: any, index: any) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{country.x}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(country.y)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigateurs et OS */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin._navigateurs')}</h3>
            <div className="space-y-3">
              {analyticsData.metrics.browsers.slice(0, 5).map((browser: any, index: any) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{browser.x}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(browser.y)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin._systmes')}</h3>
            <div className="space-y-3">
              {analyticsData.metrics.os.slice(0, 5).map((os: any, index: any) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{os.x}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(os.y)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin._appareils')}</h3>
            <div className="space-y-3">
              {analyticsData.metrics.devices.map((device: any, index: any) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{device.x}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(device.y)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Événements */}
      {analyticsData && analyticsData.events.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin._vnements_personnaliss')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.events.map((event: any, index: any) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">{event.x}</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatNumber(event.y)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer avec info de mise à jour */}
      {lastUpdated && (
        <div className="text-center text-xs text-gray-500">
          Dernière mise à jour : {new Date(lastUpdated).toLocaleString('fr-FR')}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
export const dynamic = "force-dynamic";
