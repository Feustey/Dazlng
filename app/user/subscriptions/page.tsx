"use client";

import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import QRCode from 'qrcode';

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  features: string[];
  autoRenew: boolean;
  paymentMethod?: string;
  nextPaymentDate?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    nodes: number;
    apiCalls: number;
    storage: string;
  };
  popular?: boolean;
  trialDays?: number;
}

interface Invoice {
  id: string;
  order_id: string;
  userId: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description: string;
  product_type: string;
  plan?: string;
  billing_cycle?: string;
  payment_method?: string;
  payment_hash?: string;
  paymentDate?: string;
  total: number;
  downloadUrl?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

interface InvoiceData {
  paymentRequest: string;
  paymentHash: string;
  amount: number;
  description: string;
  expiresAt: string;
}

type BillingCycle = 'monthly' | 'yearly';
type TabType = 'subscriptions' | 'invoices';

const SubscriptionsPage: FC = () => {
  const { user, session, loading: authLoading } = useSupabase();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [_availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('subscriptions');
  const [invoiceFilter, setInvoiceFilter] = useState<string>('all');

  // Prix des plans selon les spécifications
  const planPricing = {
    basic: {
      monthly: 10000, // 10k sats/mois
      yearly: 100000  // 100k sats/an (20% de remise vs 120k)
    },
    premium: {
      monthly: 30000,  // 30k sats/mois
      yearly: 300000   // 300k sats/an (20% de remise vs 360k)
    }
  };

  const fetchSubscriptionData = useCallback(async (): Promise<void> => {
    if (authLoading) return;
    
    if (!user || !session) {
      setError('Vous devez être connecté pour voir vos abonnements');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [subscriptionRes, plansRes] = await Promise.all([
        fetch('/api/subscriptions/current', {
          headers: { 
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/subscriptions/plans')
      ]);

      if (!subscriptionRes.ok || !plansRes.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const [subscriptionResult, plansResult]: [ApiResponse<Subscription>, ApiResponse<Plan[]>] = await Promise.all([
        subscriptionRes.json(),
        plansRes.json()
      ]);

      if (subscriptionResult.success && subscriptionResult.data) {
        setCurrentSubscription(subscriptionResult.data);
      }

      if (plansResult.success && plansResult.data) {
        setAvailablePlans(plansResult.data);
      }

    } catch (err) {
      console.error('Erreur lors de la récupération des données d\'abonnement:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user, session, authLoading]);

  const fetchInvoices = useCallback(async (): Promise<void> => {
    if (authLoading || !user || !session) return;

    try {
      setInvoicesLoading(true);
      setInvoicesError(null);

      const statusFilter = invoiceFilter !== 'all' ? `?status=${invoiceFilter}` : '';
      
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
      setInvoicesError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setInvoicesLoading(false);
    }
  }, [invoiceFilter, user, session, authLoading]);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  useEffect(() => {
    if (activeTab === 'invoices') {
      fetchInvoices();
    }
  }, [activeTab, fetchInvoices]);

  const getStatusBadge = (status: Subscription['status']): JSX.Element => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      trial: 'bg-blue-100 text-blue-800'
    };

    const labels = {
      active: 'Actif',
      cancelled: 'Annulé',
      expired: 'Expiré',
      trial: 'Essai'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getInvoiceStatusBadge = (status: Invoice['status']): JSX.Element => {
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

  const formatSats = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const createInvoice = async (planId: string, cycle: BillingCycle): Promise<void> => {
    if (!session || !user) return;

    setProcessingPlan(planId);
    
    try {
      // Déterminer le montant selon le plan et le cycle
      let amount = 0;
      let description = '';
      
      if (planId === 'basic') {
        amount = cycle === 'monthly' ? planPricing.basic.monthly : planPricing.basic.yearly;
        description = `Plan Basic - ${cycle === 'monthly' ? 'Mensuel' : 'Annuel (20% de remise)'}`;
      } else if (planId === 'premium') {
        amount = cycle === 'monthly' ? planPricing.premium.monthly : planPricing.premium.yearly;
        description = `Plan Premium - ${cycle === 'monthly' ? 'Mensuel' : 'Annuel (20% de remise)'}`;
      }

      const invoiceResponse = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          description,
          metadata: {
            planId,
            billingCycle: cycle,
            userId: user.id,
            productType: 'daznode'
          }
        })
      });

      if (!invoiceResponse.ok) {
        throw new Error('Erreur lors de la création de la facture');
      }

      const invoiceResult: ApiResponse<{ invoice: any; provider: string }> = await invoiceResponse.json();
      
      if (!invoiceResult.success || !invoiceResult.data) {
        throw new Error(invoiceResult.error?.message || 'Erreur lors de la création de la facture');
      }

      const invoiceData: InvoiceData = {
        paymentRequest: invoiceResult.data.invoice.payment_request,
        paymentHash: invoiceResult.data.invoice.payment_hash,
        amount: invoiceResult.data.invoice.amount,
        description: invoiceResult.data.invoice.description,
        expiresAt: invoiceResult.data.invoice.expires_at
      };
      
      // Ouvrir la facture Lightning dans une nouvelle fenêtre
      const lightningUrl = `lightning:${invoiceData.paymentRequest}`;
      window.open(lightningUrl, '_blank');
      
      // Afficher la facture à l'utilisateur
      await showInvoiceModal(invoiceData, planId, cycle);
      
    } catch (err) {
      console.error('Erreur lors de la création de la facture:', err);
      alert('Erreur lors de la création de la facture. Veuillez réessayer.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const showInvoiceModal = async (invoice: InvoiceData, planId: string, cycle: BillingCycle): Promise<void> => {
    const planName = planId === 'basic' ? 'Basic' : 'Premium';
    const cycleText = cycle === 'monthly' ? 'Mensuel' : 'Annuel';
    
    try {
      // Générer le QR code
      const qrCodeDataUrl = await QRCode.toDataURL(invoice.paymentRequest, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-lg w-full">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-bold mb-2">Facture Lightning</h3>
            <p class="text-gray-600">Plan ${planName} - ${cycleText}</p>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600 mb-4">${formatSats(invoice.amount)} sats</div>
              
              <!-- QR Code -->
              <div class="flex justify-center mb-4">
                <img src="${qrCodeDataUrl}" alt="QR Code Lightning Invoice" class="border-2 border-gray-200 rounded-lg" />
              </div>
              
              <div class="text-xs text-gray-500 break-all font-mono p-2 bg-white rounded border">${invoice.paymentRequest}</div>
            </div>
          </div>
          
          <div class="flex flex-col gap-3">
            <button onclick="navigator.clipboard.writeText('${invoice.paymentRequest}')" 
                    class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              📋 Copier la facture
            </button>
            <button onclick="window.open('lightning:${invoice.paymentRequest}', '_blank')" 
                    class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              ⚡ Ouvrir avec portefeuille
            </button>
            <button onclick="this.closest('.fixed').remove()" 
                    class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
              Fermer
            </button>
          </div>
          
          <div class="mt-4 text-xs text-gray-500 text-center">
            <p>🔒 Paiement sécurisé via Lightning Network</p>
            <p>Cette facture expire dans 1 heure</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
    } catch (error) {
      console.error('Erreur génération QR code:', error);
      
      // Fallback sans QR code
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-bold mb-2">Facture Lightning</h3>
            <p class="text-gray-600">Plan ${planName} - ${cycleText}</p>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600 mb-2">${formatSats(invoice.amount)} sats</div>
              <div class="text-sm text-gray-500 break-all font-mono">${invoice.paymentRequest}</div>
            </div>
          </div>
          
          <div class="flex flex-col gap-3">
            <button onclick="navigator.clipboard.writeText('${invoice.paymentRequest}')" 
                    class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              📋 Copier la facture
            </button>
            <button onclick="window.open('lightning:${invoice.paymentRequest}', '_blank')" 
                    class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              ⚡ Ouvrir avec portefeuille
            </button>
            <button onclick="this.closest('.fixed').remove()" 
                    class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
              Fermer
            </button>
          </div>
          
          <div class="mt-4 text-xs text-gray-500 text-center">
            Cette facture expire dans 1 heure
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
    }
  };

  // États de chargement
  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos abonnements...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Mon abonnement</h1>
          <div className="text-sm text-gray-500">
            Connecté en tant que {user.email}
          </div>
        </div>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <h3 className="font-semibold mb-2">❌ Erreur</h3>
          <p>{error}</p>
          <button 
            onClick={fetchSubscriptionData}
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
        <h1 className="text-3xl font-bold text-gray-900">Abonnements & Facturation</h1>
        <div className="text-sm text-gray-500">
          Connecté en tant que {user.email}
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'subscriptions'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Abonnements
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'invoices'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💰 Factures & Paiements
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              {/* Abonnement actuel */}
              {currentSubscription && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Abonnement actuel</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold">{currentSubscription.planName}</span>
                        {getStatusBadge(currentSubscription.status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatSats(currentSubscription.price)} sats<span className="text-sm font-normal text-gray-500">/mois</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Informations</h3>
                      <div className="space-y-1 text-sm">
                        <div>Début: {formatDate(currentSubscription.startDate)}</div>
                        <div>Fin: {formatDate(currentSubscription.endDate)}</div>
                        {currentSubscription.nextPaymentDate && (
                          <div>Prochain paiement: {formatDate(currentSubscription.nextPaymentDate)}</div>
                        )}
                        <div>Renouvellement auto: {currentSubscription.autoRenew ? 'Oui' : 'Non'}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Fonctionnalités incluses</h3>
                      <ul className="space-y-1 text-sm">
                        {currentSubscription.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {currentSubscription.status === 'cancelled' && currentSubscription.cancelReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-800 mb-2">Abonnement annulé</h4>
                      <p className="text-red-700 text-sm">{currentSubscription.cancelReason}</p>
                      {currentSubscription.cancelledAt && (
                        <p className="text-red-600 text-xs mt-1">
                          Annulé le {formatDate(currentSubscription.cancelledAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Sélecteur de cycle de facturation */}
              <div className="flex justify-center">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-500'}`}>
                    Mensuel
                  </span>
                  <button
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    className={`relative inline-flex h-6 w-11 mx-3 items-center rounded-full transition-colors ${
                      billingCycle === 'yearly' ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${billingCycle === 'yearly' ? 'font-semibold text-green-600' : 'text-gray-500'}`}>
                    Annuel
                  </span>
                  {billingCycle === 'yearly' && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full ml-2">
                      -20%
                    </span>
                  )}
                </div>
              </div>

              {/* Plans Basic et Premium */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan Basic */}
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">Basic</h3>
                    <div className="text-3xl font-bold mb-1">
                      {formatSats(billingCycle === 'monthly' ? planPricing.basic.monthly : planPricing.basic.yearly)} sats
                      <span className="text-sm font-normal text-gray-500">
                        /{billingCycle === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-green-600 font-semibold">
                        Économisez {formatSats(planPricing.basic.monthly * 12 - planPricing.basic.yearly)} sats/an
                      </div>
                    )}
                    <p className="text-gray-600 text-sm mt-2">Optimisation et statistiques avancées</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Optimisation automatique des frais
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Statistiques avancées
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Recommandations IA
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Alertes temps réel
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Support prioritaire
                    </li>
                  </ul>

                  <button
                    onClick={() => createInvoice('basic', billingCycle)}
                    disabled={processingPlan === 'basic' || currentSubscription?.planId === 'basic'}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      currentSubscription?.planId === 'basic'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : processingPlan === 'basic'
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {processingPlan === 'basic' ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Génération...
                      </span>
                    ) : currentSubscription?.planId === 'basic' ? (
                      'Plan actuel'
                    ) : (
                      'Choisir ce plan'
                    )}
                  </button>
                </div>

                {/* Plan Premium */}
                <div className="border-2 border-purple-500 bg-purple-50 rounded-xl p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Populaire
                    </span>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">Premium</h3>
                    <div className="text-3xl font-bold mb-1">
                      {formatSats(billingCycle === 'monthly' ? planPricing.premium.monthly : planPricing.premium.yearly)} sats
                      <span className="text-sm font-normal text-gray-500">
                        /{billingCycle === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-green-600 font-semibold">
                        Économisez {formatSats(planPricing.premium.monthly * 12 - planPricing.premium.yearly)} sats/an
                      </div>
                    )}
                    <p className="text-gray-600 text-sm mt-2">Toutes les fonctionnalités + IA avancée</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Tout du plan Basic
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      IA avancée pour optimisation
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Rééquilibrage automatique
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Analyse prédictive
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      API complète
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Support 24/7
                    </li>
                  </ul>

                  <button
                    onClick={() => createInvoice('premium', billingCycle)}
                    disabled={processingPlan === 'premium' || currentSubscription?.planId === 'premium'}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      currentSubscription?.planId === 'premium'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : processingPlan === 'premium'
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {processingPlan === 'premium' ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Génération...
                      </span>
                    ) : currentSubscription?.planId === 'premium' ? (
                      'Plan actuel'
                    ) : (
                      'Choisir ce plan'
                    )}
                  </button>
                </div>
              </div>

              {/* Informations de paiement */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 text-lg">ℹ️</div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Paiement Lightning</h3>
                    <p className="text-blue-700 text-sm">
                      Les factures sont générées en Bitcoin Lightning pour des paiements instantanés et sécurisés. 
                      Votre abonnement sera activé automatiquement après confirmation du paiement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pas d'abonnement actuel */}
              {!currentSubscription && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                  <h2 className="text-2xl font-bold mb-4">🚀 Prêt à optimiser votre nœud ?</h2>
                  <p className="mb-6 text-lg">
                    Choisissez le plan qui correspond à vos besoins et commencez à maximiser vos revenus Lightning
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => createInvoice('basic', billingCycle)}
                      className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                      Commencer avec Basic
                    </button>
                    <button
                      onClick={() => createInvoice('premium', billingCycle)}
                      className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
                    >
                      Découvrir Premium
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-6">
              {/* Statistiques rapides des factures */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Total factures</div>
                  <div className="text-2xl font-bold">{invoices.length}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Factures payées</div>
                  <div className="text-2xl font-bold text-green-600">
                    {invoices.filter(i => i.status === 'paid').length}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Montant total</div>
                  <div className="text-2xl font-bold">
                    {formatSats(invoices.reduce((sum, i) => sum + i.total, 0))} sats
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">En retard</div>
                  <div className="text-2xl font-bold text-red-600">
                    {invoices.filter(i => i.status === 'overdue').length}
                  </div>
                </div>
              </div>

              {/* Filtres des factures */}
              <div className="flex gap-2">
                {['all', 'paid', 'sent', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setInvoiceFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      invoiceFilter === status
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
              {invoicesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des factures...</p>
                  </div>
                </div>
              ) : invoicesError ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold mb-2">❌ Erreur</h3>
                  <p>{invoicesError}</p>
                  <button 
                    onClick={fetchInvoices}
                    className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune facture</h3>
                  <p className="text-gray-600">
                    {invoiceFilter === 'all' 
                      ? 'Vous n\'avez pas encore de factures.'
                      : `Aucune facture ${invoiceFilter === 'paid' ? 'payée' : invoiceFilter === 'sent' ? 'envoyée' : 'en retard'}.`
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
                            {getInvoiceStatusBadge(invoice.status)}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{invoice.description}</p>
                          <div className="text-xs text-gray-500 space-x-4">
                            <span>Date: {formatDate(invoice.date)}</span>
                            <span>Échéance: {formatDate(invoice.dueDate)}</span>
                            {invoice.paymentDate && (
                              <span>Payée le: {formatDate(invoice.paymentDate)}</span>
                            )}
                            {invoice.payment_hash && (
                              <span>Hash: {invoice.payment_hash.slice(0, 10)}...</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatSats(invoice.total)} sats</div>
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
                      
                      {/* Informations supplémentaires */}
                      {(invoice.plan || invoice.billing_cycle || invoice.payment_method) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            {invoice.plan && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Plan: {invoice.plan}
                              </span>
                            )}
                            {invoice.billing_cycle && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Cycle: {invoice.billing_cycle === 'monthly' ? 'Mensuel' : 'Annuel'}
                              </span>
                            )}
                            {invoice.payment_method && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Paiement: {invoice.payment_method}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
