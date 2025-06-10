"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "../components/ui/Card";
import { StatsCard } from "../components/ui/StatsCard";
import { formatDate, formatSats } from "../../../utils/formatters";
import Link from "next/link";
import { mcpLightAPI } from '@/lib/services/mcp-light-api';

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface BusinessMetrics {
  monthly_signups: number;
  weekly_signups: number;
  conversion_rate: number;
  customer_acquisition_cost: number;
  churn_rate: number;
  customer_lifetime_value: number;
  monthly_recurring_revenue: number;
  daznode_adoption: number;
  lightning_connection_rate: number;
  premium_conversion_rate: number;
  total_revenue: number;
  monthly_revenue: number;
  avg_order_value: number;
  revenue_per_user: number;
}

interface FunnelMetrics {
  visitors: number;
  signups: number;
  verified_users: number;
  first_purchase: number;
  premium_users: number;
  signup_rate: number;
  verification_rate: number;
  purchase_rate: number;
  premium_rate: number;
}

interface DPOStatistics {
  total_analyses: number;
  successful_analyses: number;
  failed_analyses: number;
  average_processing_time: number;
  nodes_analyzed_24h: number;
  recommendations_generated: number;
  feedback_received: number;
  success_rate: number;
}

interface NetworkMetrics {
  api_response_time: number;
  api_uptime: number;
  database_connections: number;
  cache_hit_rate: number;
  active_sessions: number;
  requests_per_minute: number;
}

interface LightningNetworkStats {
  total_nodes: number;
  total_channels: number;
  total_capacity_btc: number;
  network_growth_24h: {
    nodes: number;
    channels: number;
    capacity_btc: number;
  };
  health_score: number;
}

export default function DashboardPage(): React.ReactElement {
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [funnelMetrics, setFunnelMetrics] = useState<FunnelMetrics | null>(null);
  const [dpoStats, setDpoStats] = useState<DPOStatistics | null>(null);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(null);
  const [lightningStats, setLightningStats] = useState<LightningNetworkStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30');

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Charger les stats de base en parallèle
      const [statsResponse, usersResponse] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users?limit=10&sort=created_at:desc")
      ]);

      // Stats de base
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData && statsData.data) {
          const data = statsData.data;
          const safeStats = {
            totalUsers: Number(data.totalUsers) || 0,
            activeSubscriptions: Number(data.activeSubscriptions) || 0,
            totalRevenue: Number(data.totalRevenue) || 0,
            pendingOrders: Number(data.pendingOrders) || 0
          };
          setStats(safeStats);
        }
      }

      // Utilisateurs récents
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        if (usersData && usersData.success && Array.isArray(usersData.data)) {
          setRecentUsers(usersData.data);
        } else {
          setRecentUsers([]);
        }
      }

      // Business metrics avancées
      try {
        const businessResponse = await fetch(`/api/admin/stats/enhanced?type=business&period=${selectedPeriod}`);
        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          if (businessData.success) {
            setBusinessMetrics(businessData.data);
          }
        }
      } catch (error) {
        console.error('Erreur chargement business metrics:', error);
      }

      // Funnel metrics
      try {
        const funnelResponse = await fetch(`/api/admin/stats/enhanced?type=funnel&period=${selectedPeriod}`);
        if (funnelResponse.ok) {
          const funnelData = await funnelResponse.json();
          if (funnelData.success) {
            setFunnelMetrics(funnelData.data);
          }
        }
      } catch (error) {
        console.error('Erreur chargement funnel metrics:', error);
      }

      // NOUVEAU: Statistiques DPO depuis api.dazno.de
      try {
        const dpoResponse = await fetch('/api/admin/dpo-stats');
        if (dpoResponse.ok) {
          const dpoData = await dpoResponse.json();
          if (dpoData.success) {
            setDpoStats(dpoData.data);
          }
        }
      } catch (error) {
        console.error('Erreur chargement DPO stats:', error);
      }

      // NOUVEAU: Métriques système depuis api.dazno.de
      try {
        const metricsResponse = await fetch('/api/admin/system-metrics');
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          if (metricsData.success) {
            setNetworkMetrics(metricsData.data);
          }
        }
      } catch (error) {
        console.error('Erreur chargement system metrics:', error);
      }

      // NOUVEAU: Statistiques réseau Lightning via MCP
      try {
        const lightningData = await mcpLightAPI.getNetworkGlobalStats({
          include_movers: true,
          include_fees: true
        });
        
        setLightningStats({
          total_nodes: lightningData.network_overview.total_nodes,
          total_channels: lightningData.network_overview.total_channels,
          total_capacity_btc: lightningData.network_overview.total_capacity_btc,
          network_growth_24h: {
            nodes: lightningData.growth_metrics.nodes_24h,
            channels: lightningData.growth_metrics.channels_24h,
            capacity_btc: lightningData.growth_metrics.capacity_24h_btc
          },
          health_score: lightningData.health_indicators.reachability_score * 100
        });
      } catch (error) {
        console.error('Erreur chargement Lightning stats:', error);
      }

    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      // Valeurs par défaut en cas d'erreur
      setStats({
        totalUsers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        pendingOrders: 0
      });
      setRecentUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  useEffect((): void => {
    fetchData();
  }, [fetchData]);

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatCurrency = (value: number): string => {
    return formatSats(value);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec sélecteur de période */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Business</h1>
          <p className="text-gray-600">Vue d'ensemble des performances de DazNode</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
          </select>
          <Link
            href="/user/dashboard"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            🚀 Nouveau CRM
          </Link>
          <Link
            href="/admin/analytics"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 Analytics Détaillées
          </Link>
        </div>
      </div>

      {/* NOUVEAU: Section Lightning Network */}
      {lightningStats && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            ⚡ Lightning Network Global
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Nœuds Total"
              value={lightningStats.total_nodes.toLocaleString()}
              trend={`${lightningStats.network_growth_24h.nodes > 0 ? '+' : ''}${lightningStats.network_growth_24h.nodes} (24h)`}
              icon="🏗️"
            />
            <StatsCard
              title="Canaux"
              value={lightningStats.total_channels.toLocaleString()}
              trend={`${lightningStats.network_growth_24h.channels > 0 ? '+' : ''}${lightningStats.network_growth_24h.channels} (24h)`}
              icon="🔗"
            />
            <StatsCard
              title="Capacité BTC"
              value={`${lightningStats.total_capacity_btc.toFixed(0)} BTC`}
              trend={`${lightningStats.network_growth_24h.capacity_btc > 0 ? '+' : ''}${lightningStats.network_growth_24h.capacity_btc.toFixed(1)} BTC (24h)`}
              icon="⚡"
            />
            <StatsCard
              title="Santé Réseau"
              value={`${lightningStats.health_score.toFixed(1)}%`}
              icon="❤️"
            />
          </div>
        </div>
      )}

      {/* NOUVEAU: Section DPO Analytics */}
      {dpoStats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🤖 Analytics IA & DPO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Analyses Totales"
              value={dpoStats.total_analyses.toLocaleString()}
              icon="📊"
            />
            <StatsCard
              title="Taux de Succès"
              value={`${dpoStats.success_rate.toFixed(1)}%`}
              icon="✅"
            />
            <StatsCard
              title="Nœuds/24h"
              value={dpoStats.nodes_analyzed_24h.toLocaleString()}
              icon="📈"
            />
            <StatsCard
              title="Recommandations"
              value={dpoStats.recommendations_generated.toLocaleString()}
              icon="💡"
            />
          </div>
        </div>
      )}

      {/* NOUVEAU: Section System Metrics */}
      {networkMetrics && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🔧 Métriques Système
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Temps Réponse API"
              value={`${networkMetrics.api_response_time}ms`}
              icon="⚡"
            />
            <StatsCard
              title="Uptime API"
              value={`${networkMetrics.api_uptime.toFixed(2)}%`}
              icon="🟢"
            />
            <StatsCard
              title="Taux Cache"
              value={`${networkMetrics.cache_hit_rate.toFixed(1)}%`}
              icon="💾"
            />
            <StatsCard
              title="Req/Min"
              value={networkMetrics.requests_per_minute.toLocaleString()}
              icon="📡"
            />
          </div>
        </div>
      )}

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Utilisateurs Totaux" 
          value={stats.totalUsers} 
          icon="👥" 
          link="/admin/users"
          trend={businessMetrics ? `+${businessMetrics.weekly_signups} cette semaine` : undefined}
        />
        <StatsCard 
          title="Abonnements Actifs" 
          value={stats.activeSubscriptions} 
          icon="🔄" 
          link="/admin/subscriptions" 
        />
        <StatsCard 
          title="Revenu Total" 
          value={formatSats(stats.totalRevenue)} 
          icon="💰" 
          link="/admin/payments"
          trend={businessMetrics ? `${formatCurrency(businessMetrics.monthly_revenue)} ce mois` : undefined}
        />
        <StatsCard 
          title="Commandes en Attente" 
          value={stats.pendingOrders} 
          icon="🛒" 
          link="/admin/orders?status=pending" 
        />
      </div>

      {/* Business Metrics Avancés */}
      {businessMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">Taux de Conversion</div>
            <div className="text-2xl font-bold text-green-600">{formatPercentage(businessMetrics.conversion_rate)}</div>
            <div className="text-xs text-gray-500">Visiteurs → Clients</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">CLV (Customer Lifetime Value)</div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(businessMetrics.customer_lifetime_value)}</div>
            <div className="text-xs text-gray-500">Valeur moyenne par client</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">Adoption Lightning</div>
            <div className="text-2xl font-bold text-yellow-600">{formatPercentage(businessMetrics.lightning_connection_rate)}</div>
            <div className="text-xs text-gray-500">Utilisateurs avec nœud</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">Conversion Premium</div>
            <div className="text-2xl font-bold text-indigo-600">{formatPercentage(businessMetrics.premium_conversion_rate)}</div>
            <div className="text-xs text-gray-500">Free → Premium</div>
          </div>
        </div>
      )}

      {/* Funnel de Conversion */}
      {funnelMetrics && (
        <Card title="Funnel de Conversion" className="mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Visiteurs */}
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{funnelMetrics.visitors.toLocaleString()}</div>
                  <div className="text-sm text-blue-800">Visiteurs</div>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="text-gray-400">→</div>
                <div className="text-xs text-gray-500 ml-1">{formatPercentage(funnelMetrics.signup_rate)}</div>
              </div>
              
              {/* Signups */}
              <div className="text-center">
                <div className="bg-green-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{funnelMetrics.signups.toLocaleString()}</div>
                  <div className="text-sm text-green-800">Inscriptions</div>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="text-gray-400">→</div>
                <div className="text-xs text-gray-500 ml-1">{formatPercentage(funnelMetrics.verification_rate)}</div>
              </div>
              
              {/* Verified */}
              <div className="text-center">
                <div className="bg-yellow-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{funnelMetrics.verified_users.toLocaleString()}</div>
                  <div className="text-sm text-yellow-800">Vérifiés</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* First Purchase */}
              <div className="text-center">
                <div className="bg-purple-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{funnelMetrics.first_purchase.toLocaleString()}</div>
                  <div className="text-sm text-purple-800">Premier Achat</div>
                  <div className="text-xs text-gray-500">{formatPercentage(funnelMetrics.purchase_rate)} des vérifiés</div>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="text-gray-400">→</div>
                <div className="text-xs text-gray-500 ml-1">{formatPercentage(funnelMetrics.premium_rate)}</div>
              </div>
              
              {/* Premium */}
              <div className="text-center">
                <div className="bg-indigo-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">{funnelMetrics.premium_users.toLocaleString()}</div>
                  <div className="text-sm text-indigo-800">Premium</div>
                  <div className="text-xs text-gray-500">Clients fidèles</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Revenus et Performance */}
      {businessMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Performance Revenus" className="col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Revenus Mensuels</div>
                <div className="text-xl font-bold text-green-600">{formatCurrency(businessMetrics.monthly_revenue)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Panier Moyen</div>
                <div className="text-xl font-bold text-blue-600">{formatCurrency(businessMetrics.avg_order_value)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Revenu par Utilisateur</div>
                <div className="text-xl font-bold text-purple-600">{formatCurrency(businessMetrics.revenue_per_user)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">CAC (Coût d'Acquisition)</div>
                <div className="text-xl font-bold text-orange-600">{formatCurrency(businessMetrics.customer_acquisition_cost)}</div>
              </div>
            </div>
          </Card>

          <Card title="Signups Récents" className="col-span-1">
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-600">Cette Semaine</div>
                <div className="text-xl font-bold text-green-600">+{businessMetrics.weekly_signups}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Ce Mois</div>
                <div className="text-xl font-bold text-blue-600">+{businessMetrics.monthly_signups}</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Utilisateurs récents */}
      <Card title="Utilisateurs récents" className="mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Nom</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Entreprise</th>
                <th className="py-2 px-4 text-left">Date d'inscription</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user: User) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{user.name || "-"}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.company || "-"}</td>
                  <td className="py-2 px-4">{formatDate(user.created_at)}</td>
                  <td className="py-2 px-4">
                    <Link href={`/admin/users/${user.id}`} className="text-blue-500 hover:underline">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Link href="/admin/users" className="text-blue-500 hover:underline">
            Voir tous les utilisateurs →
          </Link>
        </div>
      </Card>

      {/* Actions Rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link
          href="/user/dashboard"
          className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 text-center border border-purple-500"
        >
          <div className="text-2xl mb-2">🚀</div>
          <div className="font-semibold">Nouveau CRM</div>
          <div className="text-sm opacity-90">Interface optimisée</div>
          <div className="text-xs bg-white/20 px-2 py-1 rounded mt-2 inline-block">Nouveau</div>
        </Link>
        
        <Link
          href="/admin/crm"
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">🎯</div>
          <div className="font-semibold">CRM Legacy</div>
          <div className="text-sm opacity-90">React Admin</div>
        </Link>
        
        <Link
          href="/admin/communications"
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">📧</div>
          <div className="font-semibold">Email Marketing</div>
          <div className="text-sm opacity-90">Campagnes & Templates</div>
        </Link>
        
        <Link
          href="/admin/analytics"
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="font-semibold">Analytics</div>
          <div className="text-sm opacity-90">Métriques détaillées</div>
        </Link>
        
        <Link
          href="/admin/users"
          className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">👥</div>
          <div className="font-semibold">Gestion Clients</div>
          <div className="text-sm opacity-90">Base clients & Support</div>
        </Link>
      </div>
    </div>
  );
} 