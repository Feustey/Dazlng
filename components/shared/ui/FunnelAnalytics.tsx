import React, { useState, useEffect } from 'react';

import { useConversionTracking, TrackingEvent } from '../../../hooks/useConversionTracking';
import { TrendingUp, Users, MousePointer, Eye, ArrowRight, Download } from '@/components/shared/ui/IconRegistry';

export interface FunnelStep {
  name: string;
  count: number;
  conversionRate: number;
  averageTime?: number;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, change, trend = 'neutral' }) => {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }[trend];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-indigo-600 text-2xl">{icon}</div>
        {change && (
          <span className={`text-sm font-medium ${trendColor}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export interface FunnelChartProps {
  steps: FunnelStep[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ steps }) => {
  if (!steps.length) return null;

  const maxCount = Math.max(...steps.map(s => s.count));

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <TrendingUp className="text-indigo-600" />
        Funnel de Conversion
      </h3>
      
      <div className="space-y-4">
        {steps.map((step: any, index: any) => (
          <div key={step.name} className="flex items-center gap-4">
            {/* Étape */}
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            
            {/* Nom de l'étape */}
            <div className="w-32 text-sm font-medium text-gray-700">
              {step.name}
            </div>
            
            {/* Barre de progression */}
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(step.count / maxCount) * 100}%` }}
              >
                <span className="text-white text-xs font-medium">
                  {step.count}
                </span>
              </div>
            </div>
            
            {/* Taux de conversion */}
            <div className="w-20 text-right">
              <span className="text-sm font-medium text-gray-900">
                {step.conversionRate}%
              </span>
            </div>
            
            {/* Flèche vers l'étape suivante */}
            {index < steps.length - 1 && (
              <ArrowRight className="text-gray-400 text-sm flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export interface EventsListProps {
  events: TrackingEvent[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  const recentEvents = events.slice(-10).reverse();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Eye className="text-indigo-600" />
        Événements Récents
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {recentEvents.map((event: any, index: any) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{event.stepName}</p>
              <p className="text-sm text-gray-600">{event.action} • {event.location}</p>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(event.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FunnelAnalytics: React.FC = () => {
  const { trackEvent, getLocalAnalytics, getFunnelMetrics } = useConversionTracking();
  const [analytics, setAnalytics] = useState<TrackingEvent[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);

  useEffect(() => {
    const loadAnalytics = () => {
      const localAnalytics = getLocalAnalytics();
      const localMetrics = getFunnelMetrics();
      setAnalytics(localAnalytics);
      setMetrics(localMetrics);
      
      // Generate funnel data
      const steps: FunnelStep[] = [
        { name: 'Landing', count: localAnalytics.length, conversionRate: 100 },
        { name: 'Hero View', count: Math.floor(localAnalytics.length * 0.8), conversionRate: 80 },
        { name: 'Pricing View', count: Math.floor(localAnalytics.length * 0.4), conversionRate: 40 },
        { name: 'Contact', count: Math.floor(localAnalytics.length * 0.1), conversionRate: 10 }
      ];
      setFunnelData(steps);
    };

    loadAnalytics();
    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
  }, [getLocalAnalytics, getFunnelMetrics]);

  const exportData = (): void => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daz_analytics_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalEvents = analytics.length;
  const uniqueSessions = new Set(analytics.map(e => e.sessionId)).size;
  const avgEventsPerSession = uniqueSessions > 0 ? Math.round(totalEvents / uniqueSessions) : 0;
  const sessionDuration = metrics?.sessionDuration ? Math.round(metrics.sessionDuration / 1000 / 60) : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('FunnelAnalytics.analytics_du_funnel')}</h1>
            <p className="text-gray-600 mt-2">
              Suivi en temps réel des conversions et comportements utilisateurs
            </p>
          </div>
          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download />
            Exporter les données
          </button>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="FunnelAnalytics.funnelanalyticsfunnelanalytics"
            value={totalEvents}
            icon={<Eye />}
            trend="up"
          />
          <MetricCard
            title="FunnelAnalytics.funnelanalyticsfunnelanalytics"
            value={uniqueSessions}
            icon={<Users />}
            trend="up"
          />
          <MetricCard
            title="FunnelAnalytics.funnelanalyticsfunnelanalytics"
            value={avgEventsPerSession}
            icon={<MousePointer />}
            trend="neutral"
          />
          <MetricCard
            title="FunnelAnalytics.funnelanalyticsfunnelanalytics"
            value={sessionDuration}
            icon={<TrendingUp />}
            trend="neutral"
          />
        </div>

        {/* Graphiques et listes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FunnelChart steps={funnelData} />
          <EventsList events={analytics} />
        </div>

        {/* Informations de session */}
        {metrics && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('FunnelAnalytics.session_actuelle')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{t('FunnelAnalytics.session_id')}</span>
                <p className="font-mono text-xs text-gray-800 break-all">{metrics.sessionId}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('FunnelAnalytics.vnements')}</span>
                <p className="font-semibold text-gray-800">{metrics.totalEvents}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('FunnelAnalytics.dure')}</span>
                <p className="font-semibold text-gray-800">{Math.round(metrics.sessionDuration / 1000)}s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelAnalytics;