"use client";

import React, { FC, useEffect, useState, useCallback } from 'react';

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
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  };

  const fetchSubscriptionData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      // Récupérer l'abonnement actuel et les plans disponibles en parallèle
      const [subscriptionRes, plansRes] = await Promise.all([
        fetch('/api/subscriptions/current', {
          headers: { 'Authorization': `Bearer ${token}` }
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
  }, []);

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-6">Mon abonnement</h1>
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-6">Mon abonnement</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <h3 className="font-semibold">Erreur</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6">Mon abonnement</h1>

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
                {currentSubscription.price}€<span className="text-sm font-normal text-gray-500">/mois</span>
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

          <div className="flex gap-4">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
              Gérer mon abonnement
            </button>
            {currentSubscription.status === 'active' && (
              <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
                Annuler l'abonnement
              </button>
            )}
          </div>
        </div>
      )}

      {/* Plans disponibles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Plans disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {availablePlans.map((plan) => {
            const isCurrentPlan = currentSubscription?.planId === plan.id;
            
            return (
              <div 
                key={plan.id} 
                className={`rounded-xl p-6 border text-center relative ${
                  plan.popular 
                    ? 'border-purple-500 bg-purple-50' 
                    : isCurrentPlan 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white'
                } ${plan.popular ? 'shadow-lg' : 'shadow'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Populaire
                    </span>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Actuel
                    </span>
                  </div>
                )}

                <div className="font-bold text-lg mb-2">{plan.name}</div>
                <div className="text-gray-600 mb-4 text-sm">{plan.description}</div>
                <div className="text-3xl font-bold mb-4">
                  {plan.price}€
                  <span className="text-sm font-normal text-gray-500">/{plan.interval === 'month' ? 'mois' : 'an'}</span>
                </div>

                <ul className="text-sm text-left mb-6 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-gray-500 mb-4">
                  <div>Nœuds: {plan.limits.nodes === -1 ? 'Illimité' : plan.limits.nodes}</div>
                  <div>API: {plan.limits.apiCalls === -1 ? 'Illimité' : plan.limits.apiCalls.toLocaleString()}/mois</div>
                  <div>Stockage: {plan.limits.storage}</div>
                </div>

                <button
                  onClick={() => handlePlanChange(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                    isCurrentPlan
                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                      : plan.popular
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isCurrentPlan ? 'Plan actuel' : 'Choisir ce plan'}
                </button>

                {plan.trialDays && !isCurrentPlan && (
                  <div className="text-xs text-gray-500 mt-2">
                    Essai gratuit de {plan.trialDays} jours
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
