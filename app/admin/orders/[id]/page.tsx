"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export interface Profile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  pubkey?: string;
  compte_x?: string;
  compte_nostr?: string;
  created_at: string;
  email_verified: boolean;
}

export interface Delivery {
  id: string;
  order_id: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
  shipping_status: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  payment_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_type: string;
  plan?: string;
  billing_cycle?: string;
  amount: number;
  payment_method?: string;
  payment_status?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  profiles: Profile;
  delivery?: Delivery | null;
  payment?: Payment | null;
}

export default function OrderDetailPage(): JSX.Element {
  const { t } = useAdvancedTranslation("admin");
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
        setOrder(data);
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
    if (id) fetchOrder();
  }, [id]);

  function formatDate(date: string): string {
    return new Date(date).toLocaleString("fr-FR");
  }

  function formatAmount(amount: number): string {
    return amount.toLocaleString("fr-FR") + " sats";
  }

  function StatusBadge({ status, type = "payment" }: { status?: string; type?: "payment" | "shipping" }): JSX.Element {
    let color = "bg-gray-100 text-gray-800";
    
    if (type === "payment") {
      if (status === "completed" || status === "paid") color = "bg-green-100 text-green-800";
      else if (status === "pending") color = "bg-yellow-100 text-yellow-800";
      else if (status === "failed" || status === "cancelled") color = "bg-red-100 text-red-800";
    } else if (type === "shipping") {
      if (status === "delivered") color = "bg-green-100 text-green-800";
      else if (status === "shipped" || status === "in_transit") color = "bg-blue-100 text-blue-800";
      else if (status === "processing") color = "bg-yellow-100 text-yellow-800";
      else if (status === "cancelled") color = "bg-red-100 text-red-800";
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {status || "-"}
      </span>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur</h2>
          <p className="text-red-600">{error}</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline">
            ← Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("admin.commande_introuvable")}</h2>
          <p className="text-gray-600 mb-4">{t("admin.la_commande_demandee_nexiste_pas")}</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline">
            ← Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header  */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Détail de la commande #{order.id}
          </h1>
          <Link href="/admin/orders" className="text-blue-600 hover:underline">
            ← Retour aux commandes
          </Link>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={order.payment_status} type="payment" />
          {order.delivery && (
            <StatusBadge status={order.delivery.shipping_status} type="shipping" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations de commande  */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("admin.informations_de_commande")}</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.produit")}</span>
              <span className="font-medium">{order.product_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.montant")}</span>
              <span className="font-mono font-medium">{formatAmount(order.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.methode_paiement")}</span>
              <span className="font-medium">{order.payment_method || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.plan")}</span>
              <span className="font-medium">{order.plan || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.cycle_de_facturation")}</span>
              <span className="font-medium">{order.billing_cycle || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.cree_le")}</span>
              <span className="font-medium">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.modifie_le")}</span>
              <span className="font-medium">{formatDate(order.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";