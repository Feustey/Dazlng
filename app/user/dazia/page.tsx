"use client";

import React, { useState, useEffect, FC } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { CheckCircleIcon, ClockIcon, SparklesIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface EnhancedRecommendation {
  priority: number;
  action: string;
  timeline: string;
  expected_impact: string;
  difficulty: 'low' | 'medium' | 'high';
  category: string;
  urgency: 'low' | 'medium' | 'high';
  implementation_details: {
    steps: string[];
    requirements: string[];
    estimated_hours: number;
  };
  success_criteria: string[];
  reasoning: string;
  date: string;
}

interface RecommendationModal {
  isOpen: boolean;
  recommendation: EnhancedRecommendation | null;
}

const DaziaPage: FC = () => {
  const { session } = useSupabase();
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([]);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [modal, setModal] = useState<RecommendationModal>({ isOpen: false, recommendation: null });

  // Charger le profil utilisateur et les recommandations
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      try {
        // Charger le profil pour récupérer la pubkey
        const profileResponse = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userPubkey = profileData.profile?.pubkey;
          
          if (userPubkey) {
            setPubkey(userPubkey);
            
            // Charger les recommandations avancées
            const enhancedResponse = await fetch(`/api/dazno/priorities-enhanced/${userPubkey}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                context: "Optimisation complète avec recommandations Dazia",
                goals: ["increase_revenue", "improve_centrality", "optimize_channels"],
                depth: 'detailed'
              })
            });

            if (enhancedResponse.ok) {
              const enhancedData = await enhancedResponse.json();
              if (enhancedData.success && enhancedData.data?.priority_actions) {
                // Enrichir avec des dates et formater pour l'affichage
                const enrichedRecommendations: EnhancedRecommendation[] = enhancedData.data.priority_actions.map((action: any, index: number) => ({
                  ...action,
                  reasoning: action.reasoning || `Action recommandée pour améliorer les performances de votre nœud Lightning. Impact estimé: ${action.expected_impact}.`,
                  date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Dates échelonnées
                  implementation_details: action.implementation_details || {
                    steps: ['Analyser la situation actuelle', 'Planifier l\'implémentation', 'Exécuter l\'action'],
                    requirements: ['Accès au nœud Lightning', 'Outils de gestion'],
                    estimated_hours: Math.ceil(action.priority / 2)
                  },
                  success_criteria: action.success_criteria || [
                    `Amélioration de ${action.expected_impact} des métriques ciblées`,
                    'Stabilité maintenue du nœud',
                    'Aucun impact négatif sur les canaux existants'
                  ]
                }));
                
                setRecommendations(enrichedRecommendations);
              }
            }
          }
        }

        // Vérifier l'abonnement (simulé)
        setHasSubscription(false); // Par défaut pas d'abonnement premium

      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les recommandations. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session]);

  const toggleCompletion = (index: number): void => {
    const newCompleted = new Set(completedActions);
    const actionKey = `${index}`;
    
    if (newCompleted.has(actionKey)) {
      newCompleted.delete(actionKey);
    } else {
      newCompleted.add(actionKey);
    }
    
    setCompletedActions(newCompleted);
  };

  const getPriorityColor = (priority: number): string => {
    if (priority <= 3) return 'bg-red-100 text-red-800 border-red-200';
    if (priority <= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getDifficultyIcon = (difficulty: string): string => {
    switch (difficulty) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const openModal = (recommendation: EnhancedRecommendation): void => {
    setModal({ isOpen: true, recommendation });
  };

  const closeModal = (): void => {
    setModal({ isOpen: false, recommendation: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des recommandations Dazia...</p>
        </div>
      </div>
    );
  }

  if (!pubkey) {
    return (
      <div className="text-center py-12">
        <SparklesIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dazia IA - Assistant Lightning</h1>
        <p className="text-gray-600 mb-6">
          Connectez d'abord votre nœud Lightning dans l'onglet "Mon Nœud" pour accéder aux recommandations personnalisées.
        </p>
        <a
          href="/user/node"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
        >
          Connecter mon nœud
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <SparklesIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Dazia IA</h1>
        </div>
        <p className="text-lg opacity-90">
          Recommandations intelligentes pour optimiser votre nœud Lightning
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {recommendations.length} recommandations
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {completedActions.size} actions complétées
          </span>
        </div>
      </div>

      {/* Actions recommandées */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Actions Recommandées</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const isCompleted = completedActions.has(`${index}`);
            const isBlurred = !hasSubscription && index >= recommendations.length - 4;
            
            return (
              <div
                key={index}
                className={`bg-white rounded-xl shadow border p-6 transition-all duration-200 hover:shadow-lg ${
                  isCompleted ? 'bg-green-50 border-green-200' : 'hover:border-yellow-300'
                } ${isBlurred ? 'relative' : ''}`}
              >
                {isBlurred && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <LockClosedIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Contenu Premium</h3>
                      <p className="text-gray-600 mb-4">Débloquez toutes les recommandations</p>
                      <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                        Passer à Premium
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleCompletion(index)}
                      className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                      disabled={isBlurred}
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(rec.priority)}`}>
                          Priorité {rec.priority}/10
                        </span>
                        <span className="text-sm text-gray-500">
                          {getDifficultyIcon(rec.difficulty)} {rec.difficulty}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {rec.category}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{rec.timeline}</span>
                    </div>

                    <h3 className={`text-lg font-semibold mb-2 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {rec.action}
                    </h3>

                    <p className="text-gray-600 mb-3">
                      Impact estimé: <span className="font-medium text-green-600">{rec.expected_impact}</span>
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{rec.implementation_details?.estimated_hours || 2}h estimées</span>
                        </span>
                        {isCompleted && (
                          <span className="flex items-center space-x-1 text-green-600">
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Complété</span>
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => openModal(rec)}
                        className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                        disabled={isBlurred}
                      >
                        Voir détails →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historique des recommandations */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Historique des Recommandations</h2>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="space-y-3">
            {recommendations.slice(0, 8).map((rec, index) => (
              <div
                key={`history-${index}`}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-900">{rec.action}</h4>
                  <p className="text-sm text-gray-500">Catégorie: {rec.category}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{rec.date}</span>
                  <button
                    onClick={() => openModal(rec)}
                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                  >
                    Lire →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      {modal.isOpen && modal.recommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{modal.recommendation.action}</h3>
                  <p className="text-gray-600 mt-1">{modal.recommendation.category} • {modal.recommendation.timeline}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Justification</h4>
                  <p className="text-gray-700">{modal.recommendation.reasoning}</p>
                </div>

                {modal.recommendation.implementation_details?.steps && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Étapes d'implémentation</h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                      {modal.recommendation.implementation_details.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {modal.recommendation.success_criteria && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Critères de succès</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {modal.recommendation.success_criteria.map((criteria, idx) => (
                        <li key={idx}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Impact estimé:</span>
                      <span className="ml-2 font-medium text-green-600">{modal.recommendation.expected_impact}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulté:</span>
                      <span className="ml-2">{getDifficultyIcon(modal.recommendation.difficulty)} {modal.recommendation.difficulty}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Temps estimé:</span>
                      <span className="ml-2">{modal.recommendation.implementation_details?.estimated_hours || 2}h</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Urgence:</span>
                      <span className="ml-2">{modal.recommendation.urgency}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    const index = recommendations.indexOf(modal.recommendation!);
                    if (index !== -1) toggleCompletion(index);
                    closeModal();
                  }}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Marquer comme complété
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaziaPage; 