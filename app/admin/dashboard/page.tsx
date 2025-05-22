"use client";

import { useEffect, useState } from "react";
import { Card } from "../../../admin/components/ui/Card";
import { StatsCard } from "../../../admin/components/ui/StatsCard";
// import { formatDate, formatCurrency } from "../../utils/formatters";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  created_at: string;
}

export default function Dashboard(): JSX.Element {
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        // Récupérer les statistiques
        const statsResponse = await fetch("/api/admin/stats");
        const statsData = await statsResponse.json();
        // Récupérer les utilisateurs récents
        const usersResponse = await fetch("/api/admin/users?limit=10&sort=created_at:desc");
        const usersData = await usersResponse.json();
        setStats(statsData);
        setRecentUsers(usersData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  function formatCurrency(amount: number, unit = "Sats"): string {
    return amount.toLocaleString("fr-FR") + " " + unit;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Utilisateurs" 
          value={stats.totalUsers} 
          icon="👥" 
          link="/admin/users" 
        />
        <StatsCard 
          title="Abonnements actifs" 
          value={stats.activeSubscriptions} 
          icon="🔄" 
          link="/admin/subscriptions" 
        />
        <StatsCard 
          title="Revenu total" 
          value={formatCurrency(stats.totalRevenue, "Sats")} 
          icon="💰" 
          link="/admin/payments" 
        />
        <StatsCard 
          title="Commandes en attente" 
          value={stats.pendingOrders} 
          icon="🛒" 
          link="/admin/orders?status=pending" 
        />
      </div>
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
              {recentUsers.map((user) => (
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
    </div>
  );
} 