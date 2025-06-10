"use client";

import { useEffect, useState, useCallback } from "react";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/ui/Card";
import { Alert, AlertDescription } from "@/components/shared/ui/Alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, TrendingUp, DollarSign, Activity, Users, Zap } from "lucide-react";

interface OpenAIMetrics {
  timestamp: string;
  period_start: string;
  period_end: string;
  openai_usage: {
    total_requests: number;
    total_tokens: number;
    total_prompt_tokens: number;
    total_completion_tokens: number;
    total_cost: number;
    avg_tokens_per_request: number;
    models_used: Record<string, number>;
    requests_by_day: Array<{
      date: string;
      requests: number;
      tokens: number;
      cost: number;
    }>;
    top_pubkeys: Array<{
      pubkey: string;
      requests: number;
      tokens: number;
    }>;
  };
  recommendations: {
    total_recommendations: number;
    recommendations_by_type: Record<string, number>;
    recommendations_by_priority: Record<string, number>;
    viewed_count: number;
    implemented_count: number;
    top_recommended_nodes: Array<{
      pubkey: string;
      count: number;
    }>;
    recent_recommendations: Array<{
      pubkey: string;
      type: string;
      action: string;
      priority: number;
      timestamp: string;
    }>;
  };
  system_metrics: {
    total_api_calls: number;
    api_calls_by_endpoint: Record<string, {
      count: number;
      avg_response_time_ms: number;
    }>;
    avg_response_time_ms: number;
    error_rate: number;
    cache_hit_rate: number;
    active_nodes_tracked: number;
    requests_by_day: Array<{
      date: string;
      count: number;
    }>;
  };
  current_day_stats: {
    api_calls: number;
    openai_requests: number;
    openai_tokens: number;
    recommendations: number;
  };
  recent_activity: Array<{
    timestamp: string;
    type: string;
    endpoint: string;
    pubkey: string;
    tokens?: number;
  }>;
  alerts: Array<{
    level: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
  cost_projection: {
    daily_average: number;
    monthly_projection: number;
    yearly_projection: number;
  };
}

interface RealtimeMetrics {
  last_hour: {
    api_calls: number;
    openai_requests: number;
    recommendations: number;
  };
  recent_activity: Array<{
    timestamp: string;
    type: string;
    endpoint: string;
    pubkey: string;
    model?: string;
    tokens?: number;
    response_time_ms?: number;
  }>;
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

export default function OpenAIPage(): JSX.Element {
  const [metrics, setMetrics] = useState<OpenAIMetrics | null>(null);
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics | null>(null);
  const [periodDays, setPeriodDays] = useState<string>("30");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/openai/metrics?period_days=${periodDays}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des métriques");
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [periodDays]);

  const fetchRealtimeMetrics = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/openai/metrics/realtime");
      if (!response.ok) throw new Error("Erreur lors de la récupération des métriques temps réel");
      const data = await response.json();
      setRealtimeMetrics(data);
    } catch (err) {
      console.error("Erreur métriques temps réel:", err);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    fetchRealtimeMetrics();
    
    // Rafraîchir les métriques temps réel toutes les 60 secondes
    const interval = setInterval(fetchRealtimeMetrics, 60000);
    return () => clearInterval(interval);
  }, [fetchMetrics, fetchRealtimeMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Métriques OpenAI</h1>
          <p className="text-gray-600 mt-1">Surveillance de l'utilisation d'OpenAI et des performances système</p>
        </div>
        <Select value={periodDays} onValueChange={setPeriodDays}>
          <SelectItem value="7">7 derniers jours</SelectItem>
          <SelectItem value="30">30 derniers jours</SelectItem>
          <SelectItem value="90">90 derniers jours</SelectItem>
          <SelectItem value="365">365 derniers jours</SelectItem>
        </Select>
      </div>

      {/* Alertes */}
      {metrics.alerts.length > 0 && (
        <div className="space-y-2">
          {metrics.alerts.map((alert, index) => (
            <Alert key={index} variant={alert.level === "warning" ? "warning" : "error"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.type}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Métriques temps réel */}
      {realtimeMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">API Calls (dernière heure)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realtimeMetrics.last_hour.api_calls}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Requêtes OpenAI (dernière heure)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{realtimeMetrics.last_hour.openai_requests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recommandations (dernière heure)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{realtimeMetrics.last_hour.recommendations}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.openai_usage.total_cost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Projection mensuelle: ${metrics.cost_projection.monthly_projection.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requêtes Totales</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.openai_usage.total_requests}</div>
            <p className="text-xs text-muted-foreground">
              Moy. {metrics.openai_usage.avg_tokens_per_request} tokens/requête
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Utilisés</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.openai_usage.total_tokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Prompt: {metrics.openai_usage.total_prompt_tokens.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nœuds Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.system_metrics.active_nodes_tracked}</div>
            <p className="text-xs text-muted-foreground">
              Cache hit: {(metrics.system_metrics.cache_hit_rate * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique d'utilisation par jour */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisation quotidienne</CardTitle>
          <p className="text-sm text-gray-600">Évolution des requêtes et des coûts</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.openai_usage.requests_by_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="requests" stroke="#8b5cf6" name="Requêtes" />
              <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#10b981" name="Coût ($)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Modèles utilisés et Recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modèles utilisés */}
        <Card>
          <CardHeader>
            <CardTitle>Modèles utilisés</CardTitle>
            <p className="text-sm text-gray-600">Répartition par modèle</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(metrics.openai_usage.models_used).map(([model, count]) => ({
                    name: model,
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}: {name: string, percent: number}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(metrics.openai_usage.models_used).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Types de recommandations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
            <p className="text-sm text-gray-600">Total: {metrics.recommendations.total_recommendations}</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={Object.entries(metrics.recommendations.recommendations_by_type).map(([type, count]) => ({
                type,
                count
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-around text-sm">
              <div>
                <p className="text-muted-foreground">Vues</p>
                <p className="font-semibold">{metrics.recommendations.viewed_count}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Implémentées</p>
                <p className="font-semibold">{metrics.recommendations.implemented_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Top utilisateurs OpenAI</CardTitle>
          <p className="text-sm text-gray-600">Pubkeys avec le plus de requêtes</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.openai_usage.top_pubkeys.slice(0, 5).map((node: {pubkey: string; requests: number; tokens: number}, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{node.pubkey.substring(0, 16)}...</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">{node.requests} requêtes</span>
                  <span className="font-semibold">{node.tokens.toLocaleString()} tokens</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <p className="text-sm text-gray-600">Dernières requêtes OpenAI</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.recent_activity.filter((a: typeof metrics.recent_activity[0]) => a.type === "openai").slice(0, 10).map((activity: typeof metrics.recent_activity[0], index: number) => (
              <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-sm font-medium">{activity.endpoint}</span>
                  <span className="text-xs font-mono">{activity.pubkey.substring(0, 8)}...</span>
                </div>
                {activity.tokens && (
                  <span className="text-sm text-purple-600">{activity.tokens} tokens</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performances API */}
      <Card>
        <CardHeader>
          <CardTitle>Performance des endpoints</CardTitle>
          <p className="text-sm text-gray-600">Temps de réponse moyen et nombre d'appels</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(metrics.system_metrics.api_calls_by_endpoint)
              .sort(([, a], [, b]) => (b as any).count - (a as any).count)
              .slice(0, 10)
              .map(([endpoint, stats]) => (
                <div key={endpoint} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="text-sm font-mono">{endpoint}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">{stats.count} appels</span>
                    <span className={`font-semibold ${stats.avg_response_time_ms > 1000 ? 'text-orange-600' : 'text-green-600'}`}>
                      {stats.avg_response_time_ms}ms
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Temps de réponse moyen global</span>
            <span className="font-semibold">{metrics.system_metrics.avg_response_time_ms}ms</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">Taux d'erreur</span>
            <span className={`font-semibold ${metrics.system_metrics.error_rate > 5 ? 'text-red-600' : 'text-green-600'}`}>
              {metrics.system_metrics.error_rate.toFixed(2)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}