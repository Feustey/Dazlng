"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Erreur lors de la récupération des commandes"
          );
        }

        setOrders(data.orders);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Aucune commande trouvée
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Commande #{order.id}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status === "completed"
                  ? "Terminée"
                  : order.status === "cancelled"
                    ? "Annulée"
                    : "En cours"}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <dt className="text-sm font-medium text-gray-500">
                    {item.name}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.quantity} x {item.price.toFixed(2)} €
                  </dd>
                </div>
              ))}
              <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order.total.toFixed(2)} €
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ))}
    </div>
  );
}
