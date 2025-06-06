"use client";

import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';

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

const SubscriptionsPage: FC = () => {
  const { user, session, loading: authLoading } = useSupabase();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [_availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

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

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

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
            productType: 'subscription'
          }
        })
      });

      if (!invoiceResponse.ok) {
        throw new Error('Erreur lors de la création de la facture');
      }

      const invoiceData: InvoiceData = await invoiceResponse.json();
      
      // Ouvrir la facture Lightning dans une nouvelle fenêtre
      const lightningUrl = `lightning:${invoiceData.paymentRequest}`;
      window.open(lightningUrl, '_blank');
      
      // Afficher la facture à l'utilisateur
      showInvoiceModal(invoiceData, planId, cycle);
      
    } catch (err) {
      console.error('Erreur lors de la création de la facture:', err);
      alert('Erreur lors de la création de la facture. Veuillez réessayer.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const showInvoiceModal = (invoice: InvoiceData, planId: string, cycle: BillingCycle): void => {
    const planName = planId === 'basic' ? 'Basic' : 'Premium';
    const cycleText = cycle === 'monthly' ? 'Mensuel' : 'Annuel';
    
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
          Cette facture expire dans 24h
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
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
        <h1 className="text-3xl font-bold text-gray-900">Mon abonnement</h1>
        <div className="text-sm text-gray-500">
          Connecté en tant que {user.email}
        </div>
      </div>

      {/* Abonnement actuel */}
      {currentSubscription && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
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

          {currentSubscription.status === 'cancelled' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-1">Abonnement annulé</h3>
              <p className="text-yellow-700 text-sm">
                Votre abonnement se terminera le {formatDate(currentSubscription.endDate)}.
                {currentSubscription.cancelReason && (
                  <span> Raison: {currentSubscription.cancelReason}</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Toggle pour cycle de facturation */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Choisir votre plan</h2>
          
          {/* Switch mensuel/annuel */}
          <div className="flex items-center gap-4">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-green-600' : 'bg-gray-200'
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
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
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
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
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
  );
};

export default SubscriptionsPage;
