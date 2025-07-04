"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui";
import { Alert, AlertDescription } from "@/components/shared/ui/Alert";
import { Select, SelectItem } from "../components/ui/Select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Activity, Users, Zap, AlertCircle } from "@/components/shared/ui/IconRegistry";

export interface OpenAIMetrics {
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
    models_used: Record<string, any>;
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
    recommendations_by_type: Record<string, any>;
    recommendations_by_priority: Record<string, any>;
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
    api_calls_by_endpoint: Record<string, any>;
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

export interface RealtimeMetrics {
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

export interface SystemHealth {
  timestamp: string;
  status: string;
  components: {
    database: { status: string; message: string };
    cache: { status: string; message: string };
    sparkseer: { status: string; message: string };
    openai: { status: string; message: string };
  };
}

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

export default function OpenAIPage(): JSX.Element | null {
  const [metrics, setMetrics] = useState<OpenAIMetrics | null>(null);
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [periodDays, setPeriodDays] = useState<string>("30");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState("");

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

  const fetchSystemHealth = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/openai/health");
      if (response.ok) {
        const data = await response.json();
        setSystemHealth(data);
      }
    } catch (err) {
      console.error("Erreur santé système:", err);
    }
  }, []);

  const testOpenAI = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/openai/test");
      const data = await res.json();
      setResponse(data.message || "Test terminé");
    } catch (error) {
      setResponse("Erreur lors du test OpenAI");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    fetchRealtimeMetrics();
    fetchSystemHealth();
    
    // Rafraîchir les métriques temps réel toutes les 60 secondes
    const interval = setInterval(() => {
      fetchRealtimeMetrics();
      fetchSystemHealth();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchMetrics, fetchRealtimeMetrics, fetchSystemHealth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">OpenAI Analytics</h1>
        <div className="flex gap-4">
          <Select value={periodDays} onValueChange={setPeriodDays}>
            <SelectItem value="7">7 jours</SelectItem>
            <SelectItem value="30">30 jours</SelectItem>
            <SelectItem value="90">90 jours</SelectItem>
          </Select>
          <button
            onClick={testOpenAI}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Test OpenAI
          </button>
        </div>
      </div>

      {response && (
        <Alert>
          <AlertDescription>{response}</AlertDescription>
        </Alert>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requêtes OpenAI</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.openai_usage.total_requests.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens utilisés</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.openai_usage.total_tokens.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.openai_usage.total_cost.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommandations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.recommendations.total_recommendations.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requêtes par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics?.openai_usage.requests_by_day || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#8b5cf6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coût par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics?.openai_usage.requests_by_day || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Santé système */}
      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle>Santé du système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(systemHealth.components).map(([component, status]) => (
                <div key={component} className="text-center">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    status.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {component}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{status.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";