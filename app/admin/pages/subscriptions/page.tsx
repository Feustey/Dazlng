"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Subscription {
  id: string;
  user_id: string;
  product_id: string;
  status: string;
  start_date?: string;
  end_date?: string;
  auto_renew: boolean;
  created_at: string;
}

export default function SubscriptionsPage(): JSX.Element {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptions(): Promise<void> {
      try {
        const res = await fetch("/api/admin/subscriptions");
        if (!res.ok) throw new Error("Erreur lors du chargement des abonnements");
        const data = await res.json();
        setSubscriptions(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Erreur inconnue');
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchSubscriptions();
  }, []);

  function formatDate(date?: string): string {
    return date ? new Date(date).toLocaleDateString("fr-FR") : "-";
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Abonnements</h1>
      {isLoading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Utilisateur</th>
                <th className="py-2 px-4 text-left">Produit</th>
                <th className="py-2 px-4 text-left">Statut</th>
                <th className="py-2 px-4 text-left">Début</th>
                <th className="py-2 px-4 text-left">Fin</th>
                <th className="py-2 px-4 text-left">Renouvellement</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{sub.id}</td>
                  <td className="py-2 px-4">{sub.user_id}</td>
                  <td className="py-2 px-4">{sub.product_id}</td>
                  <td className="py-2 px-4">{sub.status}</td>
                  <td className="py-2 px-4">{formatDate(sub.start_date)}</td>
                  <td className="py-2 px-4">{formatDate(sub.end_date)}</td>
                  <td className="py-2 px-4">{sub.auto_renew ? "Oui" : "Non"}</td>
                  <td className="py-2 px-4">
                    <Link href={`/admin/subscriptions/${sub.id}`} className="text-blue-500 hover:underline">Détails</Link>
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">Aucun abonnement trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 