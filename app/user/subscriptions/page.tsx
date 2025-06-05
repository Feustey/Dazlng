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

const SubscriptionsPage: FC = () => {
  const { user, session, loading: authLoading } = useSupabase();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = useCallback(async (): Promise<void> => {
    if (authLoading) return; // Attendre que l'auth soit chargée
    
    if (!user || !session) {
      setError('Vous devez être connecté pour voir vos abonnements');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer l'abonnement actuel et les plans disponibles en parallèle
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

  const handlePlanChange = (planId: string): void => {
    // TODO: Implémenter le changement de plan
    console.log('Changement vers le plan:', planId);
    alert('Fonctionnalité en développement');
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
                {currentSubscription.price}Sats<span className="text-sm font-normal text-gray-500">/mois</span>
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

      {/* Plans disponibles */}
      {availablePlans.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Plans disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <div key={plan.id} className={`border-2 rounded-xl p-6 relative ${plan.popular ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Populaire
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-1">
                    {plan.price}Sats
                    <span className="text-sm font-normal text-gray-500">/{plan.interval === 'month' ? 'mois' : 'an'}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanChange(plan.id)}
                  disabled={currentSubscription?.planId === plan.id}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                    currentSubscription?.planId === plan.id
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {currentSubscription?.planId === plan.id ? 'Plan actuel' : 'Choisir ce plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pas d'abonnement actuel */}
      {!currentSubscription && availablePlans.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">🚀 Choisissez votre plan</h2>
          <p className="mb-6 text-lg">
            Démarrez avec un plan adapté à vos besoins et évoluez à votre rythme
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
