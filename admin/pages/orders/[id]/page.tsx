"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  user_id: string;
  product_type: string;
  plan?: string;
  billing_cycle?: string;
  amount: number;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
}

export default function OrderDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder(): Promise<void> {
      try {
        const res = await fetch(`/api/admin/orders?id=${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement de la commande");
        const data = await res.json();
        setOrder(Array.isArray(data) ? data[0] : data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  function formatDate(date: string): string {
    return new Date(date).toLocaleString("fr-FR");
  }

  function formatAmount(amount: number): string {
    return amount.toLocaleString("fr-FR") + " sats";
  }

  function StatusBadge({ status }: { status?: string }) {
    let color = "bg-gray-300 text-gray-800";
    if (status === "completed" || status === "paid") color = "bg-green-200 text-green-800";
    else if (status === "pending") color = "bg-yellow-200 text-yellow-800";
    else if (status === "failed" || status === "cancelled") color = "bg-red-200 text-red-800";
    return <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${color}`}>{status || "-"}</span>;
  }

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Commande introuvable</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Détail de la commande #{order.id}</h1>
      <div className="mb-4">Utilisateur : <Link href={`/admin/users/${order.user_id}`} className="text-blue-500 hover:underline">{order.user_id}</Link></div>
      <div className="mb-4">Produit : {order.product_type}</div>
      <div className="mb-4">Statut paiement : <StatusBadge status={order.payment_status} /></div>
      <div className="mb-4">Montant : <span className="font-mono">{formatAmount(order.amount)}</span></div>
      <div className="mb-4">Méthode paiement : {order.payment_method}</div>
      <div className="mb-4">Plan : {order.plan || '-'}</div>
      <div className="mb-4">Cycle de facturation : {order.billing_cycle || '-'}</div>
      <div className="mb-4">Créée le : {formatDate(order.created_at)}</div>
      <div className="mb-4">Modifiée le : {formatDate(order.updated_at)}</div>
      {/* Lien vers le paiement associé si besoin */}
      {/* <div className="mb-4">Paiement : <Link href={`/admin/payments/${order.payment_id}`} className="text-blue-500 hover:underline">Voir paiement</Link></div> */}
    </div>
  );
} 