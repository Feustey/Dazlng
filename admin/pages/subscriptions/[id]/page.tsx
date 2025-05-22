"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  updated_at: string;
}

export default function SubscriptionDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription(): Promise<void> {
      try {
        const res = await fetch(`/api/admin/subscriptions?id=${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement de l'abonnement");
        const data = await res.json();
        setSubscription(Array.isArray(data) ? data[0] : data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchSubscription();
  }, [id]);

  function formatDate(date?: string): string {
    return date ? new Date(date).toLocaleString("fr-FR") : "-";
  }

  function StatusBadge({ status }: { status?: string }) {
    let color = "bg-gray-300 text-gray-800";
    if (status === "active") color = "bg-green-200 text-green-800";
    else if (status === "cancelled") color = "bg-red-200 text-red-800";
    else if (status === "expired") color = "bg-yellow-200 text-yellow-800";
    return <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${color}`}>{status || "-"}</span>;
  }

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!subscription) return <div>Abonnement introuvable</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Détail de l'abonnement #{subscription.id}</h1>
      <div className="mb-4">Utilisateur : <Link href={`/admin/users/${subscription.user_id}`} className="text-blue-500 hover:underline">{subscription.user_id}</Link></div>
      <div className="mb-4">Produit : <Link href={`/admin/products/${subscription.product_id}`} className="text-blue-500 hover:underline">{subscription.product_id}</Link></div>
      <div className="mb-4">Statut : <StatusBadge status={subscription.status} /></div>
      <div className="mb-4">Début : {formatDate(subscription.start_date)}</div>
      <div className="mb-4">Fin : {formatDate(subscription.end_date)}</div>
      <div className="mb-4">Renouvellement automatique : <span className={subscription.auto_renew ? "text-green-700 font-semibold" : "text-gray-500"}>{subscription.auto_renew ? "Oui" : "Non"}</span></div>
      <div className="mb-4">Créé le : {formatDate(subscription.created_at)}</div>
      <div className="mb-4">Modifié le : {formatDate(subscription.updated_at)}</div>
    </div>
  );
} 