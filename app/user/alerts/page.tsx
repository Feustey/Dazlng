'use client';

import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { usePubkeyCookie } from '@/app/user/hooks/usePubkeyCookie';
import { 
  Bell, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
  EyeOff,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Clock,
  Mail,
  Smartphone,
  Globe
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'network' | 'node' | 'channel' | 'revenue' | 'security';
  actions?: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
}

interface AlertConfig {
  enabled: boolean;
  channels: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  thresholds: {
    capacity_drop: number;
    revenue_decrease: number;
    channel_failure: number;
    network_instability: number;
  };
  categories: {
    network: boolean;
    node: boolean;
    channel: boolean;
    revenue: boolean;
    security: boolean;
  };
}

const AlertPage: React.FC = () => {
  const { session } = useSupabase();
  const { pubkey } = usePubkeyCookie();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [config, setConfig] = useState<AlertConfig>({
    enabled: true,
    channels: {
      email: true,
      push: false,
      in_app: true
    },
    thresholds: {
      capacity_drop: 10,
      revenue_decrease: 15,
      channel_failure: 5,
      network_instability: 20
    },
    categories: {
      network: true,
      node: true,
      channel: true,
      revenue: true,
      security: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  // Charger les alertes
  useEffect(() => {
    if (session?.access_token) {
      loadAlerts();
    }
  }, [session]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      // Simulation d'alertes pour le développement
      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Capacité en baisse',
          message: 'La capacité de votre nœud a diminué de 12% au cours des dernières 24h',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'medium',
          category: 'node',
          actions: [
            { label: 'Voir détails', action: 'view_details', url: '/user/node' },
            { label: 'Optimiser', action: 'optimize', url: '/user/optimize' }
          ]
        },
        {
          id: '2',
          type: 'error',
          title: 'Canal fermé',
          message: 'Un canal avec le nœud 02abc... a été fermé de manière inattendue',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high',
          category: 'channel',
          actions: [
            { label: 'Recréer canal', action: 'recreate_channel' },
            { label: 'Analyser', action: 'analyze', url: '/user/node' }
          ]
        },
        {
          id: '3',
          type: 'info',
          title: 'Nouvelle recommandation',
          message: 'L\'IA a détecté une opportunité d\'optimisation de vos frais',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'low',
          category: 'revenue',
          actions: [
            { label: 'Voir recommandation', action: 'view_recommendation', url: '/user/dazia' }
          ]
        },
        {
          id: '4',
          type: 'success',
          title: 'Optimisation réussie',
          message: 'L\'optimisation automatique a amélioré vos revenus de 8%',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'low',
          category: 'revenue'
        }
      ];

      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
      setError('Impossible de charger les alertes');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = async () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const deleteAlert = async (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const updateConfig = async (newConfig: Partial<AlertConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);

    try {
      await fetch('/api/proxy/intelligence/alerts/configure', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedConfig)
      });
    } catch (error) {
      console.error('Erreur mise à jour config:', error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info': return <Activity className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'network': return <Globe className="h-4 w-4" />;
      case 'node': return <Zap className="h-4 w-4" />;
      case 'channel': return <Activity className="h-4 w-4" />;
      case 'revenue': return <TrendingUp className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    return 'À l\'instant';
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'critical') return alert.priority === 'critical';
    return true;
  });

  const unreadCount = alerts.filter(alert => !alert.read).length;
  const criticalCount = alerts.filter(alert => alert.priority === 'critical').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-pink-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Alertes & Surveillance</h1>
              {unreadCount > 0 && (
                <span className="ml-3 px-2 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Configuration des alertes */}
          {showConfig && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 text-pink-500 mr-2" />
                  Configuration
                </h2>

                <div className="space-y-6">
                  {/* Activation générale */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => updateConfig({ enabled: e.target.checked })}
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Alertes activées
                      </span>
                    </label>
                  </div>

                  {/* Canaux de notification */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Canaux de notification</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.channels.email}
                          onChange={(e) => updateConfig({ 
                            channels: { ...config.channels, email: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <Mail className="h-4 w-4 ml-2 text-gray-500" />
                        <span className="ml-2 text-sm text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.channels.push}
                          onChange={(e) => updateConfig({ 
                            channels: { ...config.channels, push: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <Smartphone className="h-4 w-4 ml-2 text-gray-500" />
                        <span className="ml-2 text-sm text-gray-700">Push</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.channels.in_app}
                          onChange={(e) => updateConfig({ 
                            channels: { ...config.channels, in_app: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <Bell className="h-4 w-4 ml-2 text-gray-500" />
                        <span className="ml-2 text-sm text-gray-700">Dans l'app</span>
                      </label>
                    </div>
                  </div>

                  {/* Seuils */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Seuils d'alerte</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Baisse de capacité (%)
                        </label>
                        <input
                          type="number"
                          value={config.thresholds.capacity_drop}
                          onChange={(e) => updateConfig({
                            thresholds: { ...config.thresholds, capacity_drop: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Baisse de revenus (%)
                        </label>
                        <input
                          type="number"
                          value={config.thresholds.revenue_decrease}
                          onChange={(e) => updateConfig({
                            thresholds: { ...config.thresholds, revenue_decrease: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Catégories */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Catégories</h3>
                    <div className="space-y-2">
                      {Object.entries(config.categories).map(([category, enabled]) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => updateConfig({
                              categories: { ...config.categories, [category]: e.target.checked }
                            })}
                            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Liste des alertes */}
          <div className={`${showConfig ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* En-tête avec filtres */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">Alertes</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 text-sm rounded-full ${
                        filter === 'all' 
                          ? 'bg-pink-100 text-pink-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Toutes ({alerts.length})
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`px-3 py-1 text-sm rounded-full ${
                        filter === 'unread' 
                          ? 'bg-pink-100 text-pink-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Non lues ({unreadCount})
                    </button>
                    <button
                      onClick={() => setFilter('critical')}
                      className={`px-3 py-1 text-sm rounded-full ${
                        filter === 'critical' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Critiques ({criticalCount})
                    </button>
                  </div>
                </div>
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  Tout marquer comme lu
                </button>
              </div>

              {/* Liste des alertes */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Chargement des alertes...</p>
                  </div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune alerte
                    </h3>
                    <p className="text-gray-600">
                      {filter === 'all' 
                        ? 'Vous n\'avez aucune alerte pour le moment.'
                        : filter === 'unread'
                        ? 'Toutes vos alertes ont été lues.'
                        : 'Aucune alerte critique.'
                      }
                    </p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border-l-4 p-4 rounded-lg ${getPriorityColor(alert.priority)} ${
                        !alert.read ? 'ring-2 ring-pink-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900">{alert.title}</h3>
                              {!alert.read && (
                                <span className="px-2 py-0.5 bg-pink-100 text-pink-800 text-xs rounded-full">
                                  Nouveau
                                </span>
                              )}
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {alert.priority.toUpperCase()}
                              </span>
                              <div className="flex items-center text-xs text-gray-500">
                                {getCategoryIcon(alert.category)}
                                <span className="ml-1 capitalize">{alert.category}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTime(alert.timestamp)}
                              </span>
                              {alert.actions && alert.actions.length > 0 && (
                                <div className="flex space-x-2">
                                  {alert.actions.map((action, idx) => (
                                    <button
                                      key={idx}
                                      className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                                      onClick={() => {
                                        if (action.url) {
                                          window.location.href = action.url;
                                        }
                                      }}
                                    >
                                      {action.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!alert.read && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Marquer comme lu"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Supprimer"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPage; 