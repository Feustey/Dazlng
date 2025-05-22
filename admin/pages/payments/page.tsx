"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Payment {
  id: string;
  order_id: string;
  payment_hash?: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function PaymentsPage(): JSX.Element {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/admin/payments");
        if (!res.ok) throw new Error("Erreur lors du chargement des paiements");
        const data = await res.json();
        setPayments(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPayments();
  }, []);

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Paiements</h1>
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
                <th className="py-2 px-4 text-left">Commande</th>
                <th className="py-2 px-4 text-left">Hash</th>
                <th className="py-2 px-4 text-left">Montant</th>
                <th className="py-2 px-4 text-left">Statut</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{payment.id}</td>
                  <td className="py-2 px-4">{payment.order_id}</td>
                  <td className="py-2 px-4">{payment.payment_hash || "-"}</td>
                  <td className="py-2 px-4">{payment.amount.toLocaleString("fr-FR")} sats</td>
                  <td className="py-2 px-4">{payment.status}</td>
                  <td className="py-2 px-4">{formatDate(payment.created_at)}</td>
                  <td className="py-2 px-4">
                    <Link href={`/admin/payments/${payment.id}`} className="text-blue-500 hover:underline">Détails</Link>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">Aucun paiement trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 