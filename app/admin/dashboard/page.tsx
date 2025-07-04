"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "../components/ui/Card";
import { StatsCard } from "../components/ui/StatsCard";
import { formatDate, formatSats } from "../../../utils/formatters";
import Link from "next/link";
import React from 'react';
import { useLocale } from 'next-intl';

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  created_at: string;
}

export interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface BusinessMetrics {
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

export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_throughput: number;
  api_response_time: number;
  error_rate: number;
  active_connections: number;
  cache_hit_rate: number;
  database_connections: number;
  redis_memory_usage: number;
}

export interface FunnelMetrics {
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

export default function DashboardPage(): JSX.Element {
  const locale = useLocale();
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [funnelMetrics, setFunnelMetrics] = useState<FunnelMetrics | null>(null);
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
            {[...Array(8)].map((_: any, i: any) => (
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
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.dashboard_business')}</h1>
          <p className="text-gray-600">{t('dashboard.vue_densemble_des_performances')}</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e: any) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">{t('dashboard.7_derniers_jours')}</option>
            <option value="30">{t('dashboard.30_derniers_jours')}</option>
            <option value="90">{t('dashboard.90_derniers_jours')}</option>
          </select>
          <Link
            href="/user/dashboard"
            locale={locale}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Voir le dashboard utilisateur
          </Link>
          <Link
            href="/admin/analytics"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 Analytics Détaillées
          </Link>
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="dashboard.dashboarddashboardutilisateurs" 
          value={stats.totalUsers} 
          icon="👥" 
          link="/admin/users"
          trend={businessMetrics ? `+${businessMetrics.weekly_signups} cette semaine` : undefined}
        />
        <StatsCard 
          title="dashboard.dashboarddashboardabonnements_" 
          value={stats.activeSubscriptions} 
          icon="🔄" 
          link="/admin/subscriptions" 
        />
        <StatsCard 
          title="dashboard.dashboarddashboardrevenu_total" 
          value={formatSats(stats.totalRevenue)} 
          icon="💰" 
          link="/admin/payments"
          trend={businessMetrics ? `${formatCurrency(businessMetrics.monthly_revenue)} ce mois` : undefined}
        />
        <StatsCard 
          title="dashboard.dashboarddashboardcommandes_en" 
          value={stats.pendingOrders} 
          icon="🛒" 
          link="/admin/orders?status=pending" 
        />
      </div>

      {/* Business Metrics Avancés */}
      {businessMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">{t('dashboard.taux_de_conversion')}</div>
            <div className="text-2xl font-bold text-green-600">{formatPercentage(businessMetrics.conversion_rate)}</div>
            <div className="text-xs text-gray-500">{t('dashboard.visiteurs_clients')}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">{t('dashboard.clv_customer_lifetime_value')}</div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(businessMetrics.customer_lifetime_value)}</div>
            <div className="text-xs text-gray-500">{t('dashboard.valeur_moyenne_par_client')}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">{t('dashboard.adoption_lightning')}</div>
            <div className="text-2xl font-bold text-yellow-600">{formatPercentage(businessMetrics.lightning_connection_rate)}</div>
            <div className="text-xs text-gray-500">{t('dashboard.utilisateurs_avec_nud')}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">{t('dashboard.conversion_premium')}</div>
            <div className="text-2xl font-bold text-indigo-600">{formatPercentage(businessMetrics.premium_conversion_rate)}</div>
            <div className="text-xs text-gray-500">{t('dashboard.free_premium')}</div>
          </div>
        </div>
      )}

      {/* Funnel de Conversion */}
      {funnelMetrics && (
        <Card title="dashboard.dashboarddashboardfunnel_de_co" className="mb-6">
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
                  <div className="text-sm text-yellow-800">{t('dashboard.vrifis')}</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* First Purchase */}
              <div className="text-center">
                <div className="bg-purple-100 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{funnelMetrics.first_purchase.toLocaleString()}</div>
                  <div className="text-sm text-purple-800">{t('dashboard.premier_achat')}</div>
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
                  <div className="text-xs text-gray-500">{t('dashboard.clients_fidles')}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Revenus et Performance */}
      {businessMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="dashboard.dashboarddashboardperformance_" className="col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">{t('dashboard.revenus_mensuels')}</div>
                <div className="text-xl font-bold text-green-600">{formatCurrency(businessMetrics.monthly_revenue)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{t('dashboard.panier_moyen')}</div>
                <div className="text-xl font-bold text-blue-600">{formatCurrency(businessMetrics.avg_order_value)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{t('dashboard.revenu_par_utilisateur')}</div>
                <div className="text-xl font-bold text-purple-600">{formatCurrency(businessMetrics.revenue_per_user)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{t('dashboard.cac_cot_dacquisition')}</div>
                <div className="text-xl font-bold text-orange-600">{formatCurrency(businessMetrics.customer_acquisition_cost)}</div>
              </div>
            </div>
          </Card>

          <Card title="dashboard.dashboarddashboardsignups_rcen" className="col-span-1">
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-600">{t('dashboard.cette_semaine')}</div>
                <div className="text-xl font-bold text-green-600">+{businessMetrics.weekly_signups}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{t('dashboard.ce_mois')}</div>
                <div className="text-xl font-bold text-blue-600">+{businessMetrics.monthly_signups}</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Utilisateurs récents */}
      <Card title="dashboard.dashboarddashboardutilisateurs" className="mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Nom</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Entreprise</th>
                <th className="py-2 px-4 text-left">{t('dashboard.date_dinscription')}</th>
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
          locale={locale}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Voir le dashboard utilisateur
        </Link>
        
        <Link
          href="/admin/crm"
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">🎯</div>
          <div className="font-semibold">{t('dashboard.crm_legacy')}</div>
          <div className="text-sm opacity-90">{t('dashboard.react_admin')}</div>
        </Link>
        
        <Link
          href="/admin/communications"
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">📧</div>
          <div className="font-semibold">{t('dashboard.email_marketing')}</div>
          <div className="text-sm opacity-90">{t('dashboard.campagnes_templates')}</div>
        </Link>
        
        <Link
          href="/admin/analytics"
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="font-semibold">Analytics</div>
          <div className="text-sm opacity-90">{t('dashboard.mtriques_dtailles')}</div>
        </Link>
        
        <Link
          href="/admin/users"
          className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors text-center"
        >
          <div className="text-2xl mb-2">👥</div>
          <div className="font-semibold">{t('dashboard.gestion_clients')}</div>
          <div className="text-sm opacity-90">{t('dashboard.base_clients_support')}</div>
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
