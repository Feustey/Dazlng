'use client';

import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';
import { formatDate, formatSats } from '@/utils/formatters';

interface Customer {
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
}

interface CustomerStats {
  total_customers: number;
  active_customers: number;
  premium_customers: number;
  lightning_users: number;
  total_revenue: number;
  avg_order_value: number;
}

export default function UsersPage(): JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage] = useState(25);

  useEffect(() => {
    loadCustomersData();
  }, [selectedPage, searchTerm, selectedSegment]);

  const loadCustomersData = async () => {
    try {
      setLoading(true);

      // Construire la requête avec filtres
      let query = supabaseAdmin
        .from('profiles')
        .select(`
          *,
          orders!orders_user_id_fkey(
            id,
            amount,
            payment_status,
            created_at
          ),
          subscriptions!subscriptions_user_id_fkey(
            plan_id,
            status
          )
        `)
        .order('created_at', { ascending: false })
        .range(
          (selectedPage - 1) * itemsPerPage,
          selectedPage * itemsPerPage - 1
        );

      // Appliquer les filtres de recherche
      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%`);
      }

      const { data: customersData, error } = await query;

      if (error) throw error;

      // Calculer les métriques pour chaque client
      const enrichedCustomers = customersData?.map(customer => {
        const orders = customer.orders || [];
        const paidOrders = orders.filter((o: any) => o.payment_status === 'paid');
        const totalSpent = paidOrders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0);
        const lastOrder = orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        
        const subscription = customer.subscriptions?.[0];
        const isPremium = subscription?.plan_id === 'premium' && subscription?.status === 'active';
        
        // Calcul du score client (0-100)
        let score = 0;
        if (customer.email_verified) score += 20;
        if (customer.pubkey) score += 25;
        if (totalSpent > 0) score += 25;
        if (isPremium) score += 30;
        
        // Détermination du segment
        let segment = 'prospect';
        if (totalSpent > 100000) segment = 'champion'; // > 100k sats
        else if (isPremium) segment = 'premium';
        else if (totalSpent > 0) segment = 'customer';
        else if (customer.email_verified) segment = 'lead';

        return {
          ...customer,
          orders_count: orders.length,
          total_spent: totalSpent,
          last_order_date: lastOrder?.created_at,
          subscription_status: subscription?.status || 'none',
          customer_score: score,
          segment,
          last_activity: customer.updated_at
        };
      }) || [];

      // Filtrer par segment si sélectionné
      const filteredCustomers = selectedSegment === 'all' 
        ? enrichedCustomers 
        : enrichedCustomers.filter(c => c.segment === selectedSegment);

      setCustomers(filteredCustomers);

      // Charger les statistiques globales
      await loadStats();

    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: profilesCount } = await supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      const { data: ordersData } = await supabaseAdmin
        .from('orders')
        .select('amount, payment_status')
        .eq('payment_status', 'paid');

      const { data: premiumSubs } = await supabaseAdmin
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('plan_id', 'premium')
        .eq('status', 'active');

      const { data: lightningUsers } = await supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .not('pubkey', 'is', null);

      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
      const avgOrderValue = ordersData?.length ? totalRevenue / ordersData.length : 0;

      setStats({
        total_customers: profilesCount?.length || 0,
        active_customers: customers.filter(c => c.segment !== 'prospect').length,
        premium_customers: premiumSubs?.length || 0,
        lightning_users: lightningUsers?.length || 0,
        total_revenue: totalRevenue,
        avg_order_value: avgOrderValue
      });

    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const exportCustomers = async () => {
    try {
      const csvContent = [
        ['Email', 'Nom', 'Prénom', 'Segment', 'Score', 'Commandes', 'CA Total', 'Lightning', 'Date inscription'],
        ...customers.map(customer => [
          customer.email,
          customer.nom,
          customer.prenom,
          customer.segment,
          customer.customer_score,
          customer.orders_count,
          formatSats(customer.total_spent),
          customer.pubkey ? 'Oui' : 'Non',
          formatDate(customer.created_at)
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clients-daznode-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur export:', error);
    }
  };

  const getSegmentColor = (segment: string) => {
    const colors = {
      prospect: 'bg-gray-100 text-gray-800',
      lead: 'bg-blue-100 text-blue-800',
      customer: 'bg-green-100 text-green-800',
      premium: 'bg-purple-100 text-purple-800',
      champion: 'bg-yellow-100 text-yellow-800'
    };
    return colors[segment as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600">Vue d'ensemble et gestion de votre base clients</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportCustomers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 Exporter CSV
          </button>
          <Link
            href="/admin/crm"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🎯 CRM Avancé
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">Total Clients</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total_customers}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">Clients Actifs</div>
            <div className="text-2xl font-bold text-green-600">{stats.active_customers}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">Premium</div>
            <div className="text-2xl font-bold text-purple-600">{stats.premium_customers}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">Lightning Users</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.lightning_users}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">CA Total</div>
            <div className="text-2xl font-bold text-green-600">{formatSats(stats.total_revenue)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-600">Panier Moyen</div>
            <div className="text-2xl font-bold text-blue-600">{formatSats(stats.avg_order_value)}</div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher par email, nom ou prénom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les segments</option>
              <option value="prospect">Prospects</option>
              <option value="lead">Leads</option>
              <option value="customer">Clients</option>
              <option value="premium">Premium</option>
              <option value="champion">Champions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des clients */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lightning</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
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
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{customer.customer_score}/100</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
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
                    {formatSats(customer.total_spent)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
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

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between">
            <button
              disabled={selectedPage === 1}
              onClick={() => setSelectedPage(prev => Math.max(1, prev - 1))}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="relative inline-flex items-center px-4 py-2 text-sm text-gray-700">
              Page {selectedPage}
            </span>
            <button
              onClick={() => setSelectedPage(prev => prev + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 