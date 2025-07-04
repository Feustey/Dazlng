"use client";

import React, { useState, useEffect } from "react";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import { usePubkeyCookie } from "@/lib/hooks/usePubkeyCookie";
import { AlertTriangle, CheckCircle, Settings, Zap, TrendingUp, Activity, Shield, Clock, Mail, Globe, XCircle, Bell, Smartphone, Eye } from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

interface Alert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high" | "critical";
  category: "network" | "node" | "channel" | "revenue" | "security";
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
  const { t } = useAdvancedTranslation("common");

  const { session } = useSupabase();
  const { getPubkey } = usePubkeyCookie();
  const pubkey = getPubkey();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [config, setConfig] = useState<AlertConfig>({
    enabled: true,
    channels: {
      email: true,
      push: false,
      in_app: true
    },
    thresholds: {
      capacity_drop: 1.0,
      revenue_decrease: 1.5,
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
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

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
          id: "1",
          type: "info",
          title: "Maintenance prévue",
          message: "Une maintenance est prévue le 15 janvier à 2h du matin.",
          timestamp: "2024-01-10T10:00:00Z",
          read: false,
          priority: "medium",
          category: "node",
          actions: [
            { label: "Voir détails", action: "view_details", url: "/user/node" },
            { label: "Optimiser", action: "optimize", url: "/user/optimize" }
          ]
        },
        {
          id: "2",
          type: "error",
          title: "Canal fermé",
          message: "Un canal avec le nœud 02abc... a été fermé de manière inattendue",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: "high",
          category: "channel",
          actions: [
            { label: "Recréer canal", action: "recreate_channel" },
            { label: "Analyser", action: "analyze", url: "/user/node" }
          ]
        },
        {
          id: "3",
          type: "info",
          title: "Nouvelle recommandation",
          message: "L'IA a détecté une opportunité d'optimisation de vos frais",
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: "low",
          category: "revenue",
          actions: [
            { label: "Voir recommandation", action: "view_recommendation", url: "/user/dazia" }
          ]
        },
        {
          id: "4",
          type: "success",
          title: "Optimisation réussie",
          message: "L'optimisation automatique a amélioré vos revenus de 8%",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: "low",
          category: "revenue"
        }
      ];

      setAlerts(mockAlerts);
    } catch (error) {
      console.error("Erreur chargement alertes:", error);
      setError("Impossible de charger les alertes");
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
      await fetch("/api/proxy/intelligence/alerts/configure", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedConfig)
      });
    } catch (error) {
      console.error("Erreur mise à jour config:", error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return <XCircle />;
      case "warning": return <AlertTriangle />;
      case "success": return <CheckCircle />;
      case "info": return <Activity />;
      default: return <Bell />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "border-red-500 bg-red-50";
      case "high": return "border-orange-500 bg-orange-50";
      case "medium": return "border-yellow-500 bg-yellow-50";
      case "low": return "border-green-500 bg-green-50";
      default: return "border-gray-500 bg-gray-50";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "network": return <Globe />;
      case "node": return <Settings />;
      case "channel": return <Zap />;
      case "revenue": return <TrendingUp />;
      case "security": return <Shield />;
      default: return <Bell />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "unread") return !alert.read;
    if (filter === "critical") return alert.priority === "critical";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("alerts.title")}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Settings className="w-4 h-4" />
            {t("alerts.configuration")}
          </button>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {t("alerts.mark_all_read")}
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          {t("alerts.all")}
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg ${filter === "unread" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          {t("alerts.unread")}
        </button>
        <button
          onClick={() => setFilter("critical")}
          className={`px-4 py-2 rounded-lg ${filter === "critical" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          {t("alerts.critical")}
        </button>
      </div>

      {/* Configuration */}
      {showConfig && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t("alerts.notification_settings")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">{t("alerts.channels")}</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.channels.email}
                    onChange={(e) => updateConfig({ channels: { ...config.channels, email: e.target.checked } })}
                    className="mr-2"
                  />
                  <Mail className="w-4 h-4 mr-2" />
                  {t("alerts.email")}
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.channels.push}
                    onChange={(e) => updateConfig({ channels: { ...config.channels, push: e.target.checked } })}
                    className="mr-2"
                  />
                  <Bell className="w-4 h-4 mr-2" />
                  {t("alerts.push_notifications")}
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.channels.in_app}
                    onChange={(e) => updateConfig({ channels: { ...config.channels, in_app: e.target.checked } })}
                    className="mr-2"
                  />
                  <Eye className="w-4 h-4 mr-2" />
                  {t("alerts.in_app")}
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">{t("alerts.categories")}</h4>
              <div className="space-y-2">
                {Object.entries(config.categories).map(([category, enabled]) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => updateConfig({ 
                        categories: { ...config.categories, [category]: e.target.checked } 
                      })}
                      className="mr-2"
                    />
                    {getCategoryIcon(category)}
                    <span className="ml-2 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des alertes */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">{t("alerts.loading")}</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t("alerts.no_alerts")}</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white border-l-4 rounded-lg p-4 shadow-sm ${getPriorityColor(alert.priority)} ${!alert.read ? 'ring-2 ring-blue-200' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      {!alert.read && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {t("alerts.new")}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      <span className="capitalize">{alert.category}</span>
                      <span className="capitalize">{alert.priority}</span>
                    </div>
                    {alert.actions && alert.actions.length > 0 && (
                      <div className="flex space-x-2 mt-3">
                        {alert.actions.map((action, index) => (
                          <button
                            key={index}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
                <div className="flex space-x-2">
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {t("alerts.mark_read")}
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t("alerts.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertPage;