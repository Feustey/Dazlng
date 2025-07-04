"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";
import { formatDate, formatSatsPrice } from "@/utils/formatters";

export interface Customer {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  pubkey?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  compte_x?: string;
  compte_nostr?: string;
  t4g_tokens: number;
  node_id?: string;
  // Données calculées
  orders_count: number;
  total_spent: number;
  last_order_date?: string;
  subscription_status: string;
  customer_score: number;
  segment: string;
  last_activity?: string;
  // Propriétés de l'API
  ordersCount?: number;
  totalSpent?: number;
  subscriptionStatus?: string;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  premium_customers: number;
  lightning_users: number;
  total_revenue: number;
  avg_order_value: number;
}

// Données de fallback pour le développement
const generateMockCustomers = (): Customer[] => {
  const mockCustomers: Customer[] = [
    {
      id: "dev-user-1",
      email: "alice@example.com",
      nom: "Dupont",
      prenom: "Alice",
      pubkey: "0348a8c76c5a...29d1a2f3b4c5",
      email_verified: true,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-20T15:45:00Z",
      compte_x: "@alice_btc",
      t4g_tokens: 15.0,
      node_id: "lnd_node_001",
      orders_count: 3,
      total_spent: 25000.0,
      last_order_date: "2024-01-18T12:00:00Z",
      subscription_status: "premium",
      customer_score: 9.5,
      segment: "champion",
      last_activity: "2024-01-20T15:45:00Z"
    },
    {
      id: "dev-user-2",
      email: "bob@company.com",
      nom: "Martin",
      prenom: "Bob",
      email_verified: true,
      created_at: "2024-01-10T09:15:00Z",
      updated_at: "2024-01-19T11:20:00Z",
      t4g_tokens: 5.0,
      orders_count: 1,
      total_spent: 7500.0,
      subscription_status: "basic",
      customer_score: 7.0,
      segment: "customer",
      last_activity: "2024-01-19T11:20:00Z"
    },
    {
      id: "dev-user-3",
      email: "charlie@gmail.com",
      nom: "Durand",
      prenom: "Charlie",
      email_verified: false,
      created_at: "2024-01-08T14:00:00Z",
      updated_at: "2024-01-08T14:00:00Z",
      t4g_tokens: 1,
      orders_count: 0,
      total_spent: 0,
      subscription_status: "none",
      customer_score: 2.0,
      segment: "prospect",
      last_activity: "2024-01-08T14:00:00Z"
    }
  ];
  return mockCustomers;
};

const generateMockStats = (): CustomerStats => {
  return {
    total_customers: 15.6,
    active_customers: 8.9,
    premium_customers: 2.3,
    lightning_users: 6.7,
    total_revenue: 245000.0,
    avg_order_value: 85000
  };
};

export default function UsersPage(): JSX.Element {
  const { t } = useAdvancedTranslation("admin");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [isDevelopment, setIsDevelopment] = useState<boolean | undefined>(undefined);
  const itemsPerPage = 10;

  const loadCustomersData = useCallback(async () => {
    try {
      setLoading(true);

      // Mode développement - utiliser des données mock
      if (isDevelopment) {
        console.log("[Admin Users] Mode développement - utilisation de données mock");
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockCustomers = generateMockCustomers();
        const mockStats = generateMockStats();
        
        // Appliquer les filtres localement sur les données mock
        let filteredCustomers = mockCustomers;
        
        if (searchTerm) {
          filteredCustomers = mockCustomers.filter(customer => 
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.prenom.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (selectedSegment !== "all") {
          filteredCustomers = filteredCustomers.filter(c => c.segment === selectedSegment);
        }
        
        setCustomers(filteredCustomers);
        setStats(mockStats);
        setLoading(false);
        return;
      }

      // Mode production - appeler l'API
      const params = new URLSearchParams({
        page: selectedPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Transformer les données de l'API vers le format attendu
        const enrichedCustomers = data.data.map((user: Customer) => {
          const orders_count = user.ordersCount || 0;
          const total_spent = user.totalSpent || 0;
          
          // Calcul du score client (0-100)
          let score = 0;
          if (user.email_verified) score += 20;
          if (user.pubkey) score += 25;
          if (total_spent > 0) score += 25;
          if (user.subscriptionStatus === "premium") score += 30;
          
          // Détermination du segment
          let segment = "prospect";
          if (total_spent > 100000) segment = "champion"; // > 100k sats
          else if (user.subscriptionStatus === "premium") segment = "premium";
          else if (total_spent > 0) segment = "customer";
          else if (user.email_verified) segment = "lead";

          return {
            ...user,
            orders_count,
            total_spent,
            subscription_status: user.subscriptionStatus,
            customer_score: score,
            segment,
            last_activity: user.updated_at
          };
        });

        // Filtrer par segment si sélectionné
        const filteredCustomers = selectedSegment === "all" 
          ? enrichedCustomers 
          : enrichedCustomers.filter((c: Customer) => c.segment === selectedSegment);

        setCustomers(filteredCustomers);

        // Calculer les stats à partir des données
        const stats: CustomerStats = {
          total_customers: data.meta.total,
          active_customers: enrichedCustomers.filter((c: Customer) => c.segment !== "prospect").length,
          premium_customers: enrichedCustomers.filter((c: Customer) => c.subscription_status === "premium").length,
          lightning_users: enrichedCustomers.filter((c: Customer) => c.pubkey).length,
          total_revenue: enrichedCustomers.reduce((sum: number, c: Customer) => sum + c.total_spent, 0),
          avg_order_value: enrichedCustomers.length ? 
            enrichedCustomers.reduce((sum: number, c: Customer) => sum + c.total_spent, 0) / enrichedCustomers.length : 0
        };
        setStats(stats);
      }

    } catch (error) {
      console.error("Erreur chargement clients:", error);
      
      // Fallback vers des données mock en cas d'erreur
      console.log("[Admin Users] Erreur API, fallback vers données mock");
      const mockCustomers = generateMockCustomers();
      const mockStats = generateMockStats();
      setCustomers(mockCustomers);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  }, [selectedPage, searchTerm, selectedSegment, isDevelopment]);

  useEffect(() => {
    // Détecter l'environnement côté client uniquement pour éviter l'hydratation mismatch
    setIsDevelopment((process.env.NODE_ENV ?? "") !== "production");
  }, []);

  useEffect(() => {
    if (isDevelopment !== undefined) {
      loadCustomersData();
    }
  }, [loadCustomersData, isDevelopment]);

  const exportCustomers = async () => {
    try {
      const csvContent = [
        ["Email", "Nom", "Prénom", "Segment", "Score", "Commandes", "admin.ca_total", "Lightning", "Date inscriptio"],
        ...customers.map(customer => [
          customer.email,
          customer.nom,
          customer.prenom,
          customer.segment,
          customer.customer_score,
          customer.orders_count,
          formatSatsPrice(customer.total_spent),
          customer.pubkey ? "Oui" : "No",
          formatDate(customer.created_at)
        ])
      ].map(row => row.join("")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clients-daznode-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur export:", error);
    }
  };

  const getSegmentColor = (segment: string) => {
    const colors = {
      prospect: "bg-gray-100 text-gray-800",
      lead: "bg-blue-100 text-blue-800",
      customer: "bg-green-100 text-green-800",
      premium: "bg-purple-100 text-purple-800",
      champion: "bg-yellow-100 text-yellow-800"
    };
    return colors[segment as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div>
        <div></div>
        <div></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div>
          {[...Array(4)].map((_: any, i: any) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header  */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.gestion_des_clients")}</h1>
          <p className="text-gray-600">{t("admin.vue_densemble_et_gestion_de_vo")}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportCustomers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📊 Exporter CSV
          </button>
          <Link 
            href="/admin/crm"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            🎯 CRM Avancé
          </Link>
        </div>
      </div>

      {/* Statistiques  */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">{t("admin.total_clients")}</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total_customers}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">{t("admin.clients_actifs")}</div>
            <div className="text-2xl font-bold text-green-600">{stats.active_customers}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Premium</div>
            <div className="text-2xl font-bold text-purple-600">{stats.premium_customers}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">{t("admin.lightning_users")}</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.lightning_users}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">{t("admin.ca_total")}</div>
            <div className="text-2xl font-bold text-green-600">{formatSatsPrice(stats.total_revenue)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">{t("admin.panier_moye")}</div>
            <div className="text-2xl font-bold text-blue-600">{formatSatsPrice(stats.avg_order_value)}</div>
          </div>
        </div>
      )}

      {/* Filtres  */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un client..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t("admin.tous_les_segments")}</option>
              <option value="prospect">Prospects</option>
              <option value="lead">Leads</option>
              <option value="customer">Clients</option>
              <option value="premium">Premium</option>
              <option value="champion">Champions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des clients  */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("admin.ca_total")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lightning</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer: Customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {customer.prenom?.[0]}{customer.nom?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.prenom} {customer.nom}
                        </div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        {customer.email_verified && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Vérifié
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSegmentColor(customer.segment)}`}>
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.customer_score}/100</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${customer.customer_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.orders_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatSatsPrice(customer.total_spent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.pubkey ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⚡ Connecté
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Non connecté
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(customer.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/users/${customer.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir
                      </Link>
                      <button className="text-green-600 hover:text-green-900">
                        Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination  */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setSelectedPage(prev => Math.max(1, prev - 1))}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => setSelectedPage(prev => prev + 1)}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{selectedPage}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setSelectedPage(prev => Math.max(1, prev - 1))}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setSelectedPage(prev => prev + 1)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Suivant
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";