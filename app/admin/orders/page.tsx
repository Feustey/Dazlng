"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

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
  const { t } = useAdvancedTranslation("admin");
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
          setError("Erreur inconnue");
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
        <div>{t("admin.chargement")}</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left border-b">ID</th>
                <th className="py-2 px-4 text-left border-b">Utilisateur</th>
                <th className="py-2 px-4 text-left border-b">Produit</th>
                <th className="py-2 px-4 text-left border-b">Montant</th>
                <th className="py-2 px-4 text-left border-b">Statut</th>
                <th className="py-2 px-4 text-left border-b">Date</th>
                <th className="py-2 px-4 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{order.id}</td>
                  <td className="py-2 px-4 border-b">{order.user_id}</td>
                  <td className="py-2 px-4 border-b">{order.product_type}</td>
                  <td className="py-2 px-4 border-b">{order.amount.toLocaleString("fr-FR")} sats</td>
                  <td className="py-2 px-4 border-b">{order.payment_status}</td>
                  <td className="py-2 px-4 border-b">{formatDate(order.created_at)}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/admin/orders/${order.id}`} className="text-blue-500 hover:underline">
                      {t("admin.details")}
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    {t("admin.aucune_commande_trouvee")}
                  </td>
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