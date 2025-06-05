"use client";

import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';

interface Invoice {
  id: string;
  userId: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description: string;
  items: InvoiceItem[];
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentDate?: string;
  downloadUrl?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

const BillingPage: FC = () => {
  const { user, session, loading: authLoading } = useSupabase();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchInvoices = useCallback(async (): Promise<void> => {
    if (authLoading) return; // Attendre que l'auth soit chargée
    
    if (!user || !session) {
      setError('Vous devez être connecté pour voir vos factures');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const statusFilter = filter !== 'all' ? `?status=${filter}` : '';
      
      const response = await fetch(`/api/billing/invoices${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des factures');
      }

      const result: ApiResponse<Invoice[]> = await response.json();
      
      if (result.success && result.data) {
        setInvoices(result.data);
      } else {
        throw new Error(result.error?.message || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des factures:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [filter, user, session, authLoading]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const getStatusBadge = (status: Invoice['status']): JSX.Element => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      draft: 'Brouillon',
      sent: 'Envoyée',
      paid: 'Payée',
      overdue: 'En retard',
      cancelled: 'Annulée'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // États de chargement
  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos factures...</p>
          </div>
        </div>
      </div>
    );
  }

  // Vérification de l'authentification
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center p-8">
          <p className="text-red-600">Vous devez être connecté pour accéder à cette page.</p>
          <a href="/auth/login" className="text-indigo-600 hover:underline mt-2 inline-block">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Factures & Paiements</h1>
          <div className="text-sm text-gray-500">
            Connecté en tant que {user.email}
          </div>
        </div>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <h3 className="font-semibold mb-2">❌ Erreur</h3>
          <p>{error}</p>
          <button 
            onClick={fetchInvoices}
            className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Factures & Paiements</h1>
        <div className="text-sm text-gray-500">
          Connecté en tant que {user.email}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total factures</div>
          <div className="text-2xl font-bold">{invoices.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Factures payées</div>
          <div className="text-2xl font-bold text-green-600">
            {invoices.filter(i => i.status === 'paid').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Montant total</div>
          <div className="text-2xl font-bold">
            {invoices.reduce((sum, i) => sum + i.total, 0).toFixed(2)} Sats
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">En retard</div>
          <div className="text-2xl font-bold text-red-600">
            {invoices.filter(i => i.status === 'overdue').length}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex gap-2 mb-6">
          {['all', 'paid', 'sent', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Toutes' : status === 'paid' ? 'Payées' : 
               status === 'sent' ? 'Envoyées' : 'En retard'}
            </button>
          ))}
        </div>

        {/* Liste des factures */}
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune facture</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Vous n\'avez pas encore de factures.'
                : `Aucune facture ${filter === 'paid' ? 'payée' : filter === 'sent' ? 'envoyée' : 'en retard'}.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">Facture #{invoice.number}</h3>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{invoice.description}</p>
                    <div className="text-xs text-gray-500 space-x-4">
                      <span>Date: {formatDate(invoice.date)}</span>
                      <span>Échéance: {formatDate(invoice.dueDate)}</span>
                      {invoice.paymentDate && (
                        <span>Payée le: {formatDate(invoice.paymentDate)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{invoice.total.toFixed(2)} Sats</div>
                    {invoice.downloadUrl && (
                      <a 
                        href={invoice.downloadUrl}
                        className="text-xs text-indigo-600 hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        📄 Télécharger
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Détails des items */}
                {invoice.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 space-y-1">
                      {invoice.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.description} x{item.quantity}</span>
                          <span>{item.total.toFixed(2)} Sats</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
