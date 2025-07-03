"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface Order {
  id: string;
  user_id: string;
  product_type: string;
  plan?: string;
  billing_cycle?: string;
  amount: number;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
}

export default function OrdersPage(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders(): Promise<void> {
      try {
        const res = await fetch("/api/admin/orders");
        if (!res.ok) throw new Error("Erreur lors du chargement des commandes");
        const data = await res.json();
        setOrders(data);
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
    fetchOrders();
  }, []);

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>
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
                <th className="py-2 px-4 text-left">Montant</th>
                <th className="py-2 px-4 text-left">Statut</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.user_id}</td>
                  <td className="py-2 px-4">{order.product_type}</td>
                  <td className="py-2 px-4">{order.amount.toLocaleString("fr-FR")} sats</td>
                  <td className="py-2 px-4">{order.payment_status}</td>
                  <td className="py-2 px-4">{formatDate(order.created_at)}</td>
                  <td className="py-2 px-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-blue-500 hover:underline">Détails</Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">Aucune commande trouvée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
