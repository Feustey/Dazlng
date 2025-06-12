"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Profile {
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

interface Delivery {
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

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  payment_hash?: string;
  created_at: string;
  updated_at: string;
}

interface Order {
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
          setError('Erreur inconnue');
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
      <div className="p-6">
        <div className="animate-pulse space-y-4">
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur</h2>
          <p className="text-red-600">{error}</p>
          <Link href="/admin/orders" className="mt-3 inline-block text-red-600 hover:text-red-800 underline">
            ← Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Commande introuvable</h2>
          <p className="text-gray-600 mb-4">La commande demandée n'existe pas ou a été supprimée.</p>
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 underline">
            ← Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Détail de la commande #{order.id}
          </h1>
          <Link 
            href="/admin/orders" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Retour aux commandes
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <StatusBadge status={order.payment_status} type="payment" />
          {order.delivery && (
            <StatusBadge status={order.delivery.shipping_status} type="shipping" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations de commande */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📦 Informations de commande</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Produit :</span>
              <span className="font-medium">{order.product_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Montant :</span>
              <span className="font-mono font-medium">{formatAmount(order.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Méthode paiement :</span>
              <span className="font-medium">{order.payment_method || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plan :</span>
              <span className="font-medium">{order.plan || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cycle de facturation :</span>
              <span className="font-medium">{order.billing_cycle || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Créée le :</span>
              <span className="font-medium">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Modifiée le :</span>
              <span className="font-medium">{formatDate(order.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">👤 Informations client</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nom complet :</span>
              <span className="font-medium">
                {order.profiles.prenom} {order.profiles.nom}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email :</span>
              <span className="font-medium">{order.profiles.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email vérifié :</span>
              <span className={`font-medium ${order.profiles.email_verified ? 'text-green-600' : 'text-red-600'}`}>
                {order.profiles.email_verified ? '✅ Oui' : '❌ Non'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Client depuis :</span>
              <span className="font-medium">{formatDate(order.profiles.created_at)}</span>
            </div>
            {order.profiles.pubkey && (
              <div className="flex justify-between">
                <span className="text-gray-600">Clé publique Lightning :</span>
                <span className="font-mono text-xs break-all">{order.profiles.pubkey}</span>
              </div>
            )}
            {order.profiles.compte_x && (
              <div className="flex justify-between">
                <span className="text-gray-600">Compte X :</span>
                <span className="font-medium">@{order.profiles.compte_x}</span>
              </div>
            )}
            {order.profiles.compte_nostr && (
              <div className="flex justify-between">
                <span className="text-gray-600">Compte Nostr :</span>
                <span className="font-mono text-xs break-all">{order.profiles.compte_nostr}</span>
              </div>
            )}
            <div className="pt-2">
              <Link 
                href={`/admin/users/${order.profiles.id}`} 
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                → Voir le profil complet
              </Link>
            </div>
          </div>
        </div>

        {/* Informations de livraison */}
        {order.delivery ? (
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🚚 Adresse de livraison</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <StatusBadge status={order.delivery.shipping_status} type="shipping" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Adresse :</span>
                <span className="font-medium text-right">{order.delivery.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ville :</span>
                <span className="font-medium">{order.delivery.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Code postal :</span>
                <span className="font-medium">{order.delivery.zip_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pays :</span>
                <span className="font-medium">{order.delivery.country}</span>
              </div>
              {order.delivery.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Suivi :</span>
                  <span className="font-mono font-medium">{order.delivery.tracking_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Créée le :</span>
                <span className="font-medium">{formatDate(order.delivery.created_at)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">🚚 Livraison</h2>
            <p className="text-gray-500">Aucune adresse de livraison configurée pour cette commande.</p>
            <p className="text-sm text-gray-400 mt-2">
              Les produits numériques (DazNode, DazPay) ne nécessitent pas de livraison physique.
            </p>
          </div>
        )}

        {/* Informations de paiement */}
        {order.payment ? (
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">💳 Détails du paiement</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <StatusBadge status={order.payment.status} type="payment" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant :</span>
                <span className="font-mono font-medium">{formatAmount(order.payment.amount)}</span>
              </div>
              {order.payment.payment_hash && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Hash de paiement :</span>
                  <span className="font-mono text-xs break-all">{order.payment.payment_hash}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Traité le :</span>
                <span className="font-medium">{formatDate(order.payment.created_at)}</span>
              </div>
              {order.payment.updated_at !== order.payment.created_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mis à jour le :</span>
                  <span className="font-medium">{formatDate(order.payment.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">💳 Paiement</h2>
            <p className="text-yellow-700">Aucun paiement associé trouvé pour cette commande.</p>
            <p className="text-sm text-yellow-600 mt-2">
              Le paiement peut être en cours de traitement ou la commande peut être en attente.
            </p>
          </div>
        )}
      </div>

      {/* Métadonnées si disponibles */}
      {order.metadata && Object.keys(order.metadata).length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Métadonnées</h2>
          <pre className="bg-gray-50 rounded p-4 text-sm overflow-auto">
            {JSON.stringify(order.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 