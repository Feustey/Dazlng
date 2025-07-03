"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export interface Payment {
  id: string;
  order_id: string;
  payment_hash?: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function PaymentDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayment(): Promise<void> {
      try {
        const res = await fetch(`/api/admin/payments?id=${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du paiement");
        const data = await res.json();
        setPayment(Array.isArray(data) ? data[0] : data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchPayment();
  }, [id]);

  function formatDate(date: string): string {
    return new Date(date).toLocaleString("fr-FR");
  }

  function formatAmount(amount: number): string {
    return amount.toLocaleString("fr-FR") + " sats";
  }

  function StatusBadge({ status }: { status?: string }): JSX.Element {
    let color = "bg-gray-300 text-gray-800";
    if (status === "completed" || status === "paid") color = "bg-green-200 text-green-800";
    else if (status === "pending") color = "bg-yellow-200 text-yellow-800";
    else if (status === "failed" || status === "cancelled") color = "bg-red-200 text-red-800";
    return <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${color}`}>{status || "-"}</span>;
  }

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!payment) return <div>Paiement introuvable</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Détail du paiement #{payment.id}</h1>
      <div className="mb-4">Commande : <Link href={`/admin/orders/${payment.order_id}`} className="text-blue-500 hover:underline">{payment.order_id}</Link></div>
      <div className="mb-4">Hash : {payment.payment_hash || '-'}</div>
      <div className="mb-4">Statut : <StatusBadge status={payment.status} /></div>
      <div className="mb-4">Montant : <span className="font-mono">{formatAmount(payment.amount)}</span></div>
      <div className="mb-4">Créé le : {formatDate(payment.created_at)}</div>
      <div className="mb-4">Modifié le : {formatDate(payment.updated_at)}</div>
    </div>
  );
}
export const dynamic = "force-dynamic";
