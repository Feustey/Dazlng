"use client";

import React, { useState, useEffect, FC } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { usePubkeyCookie } from '@/app/user/hooks/usePubkeyCookie';
import { CheckCircleIcon, ClockIcon, SparklesIcon, LockClosedIcon, StarIcon, BoltIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { DaziaHeader } from './components/DaziaHeader';
import { RecommendationCard } from './components/RecommendationCard';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { useSession } from 'next-auth/react';
import { daznoAPI } from '@/lib/dazno-api';
import { RecommendationFilters } from './components/RecommendationFilters';
import { AdvancedStats } from './components/AdvancedStats';

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

interface DailyRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: number;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: string;
  implementation_steps: string[];
  success_criteria: string[];
  generated_at: string;
  expires_at: string;
}

interface RecommendationModal {
  isOpen: boolean;
  recommendation: EnhancedRecommendation | DailyRecommendation | null;
  type: 'enhanced' | 'daily';
}

interface DaziaData {
  overview: {
    health_score: number;
    revenue_7d: number;
    efficiency: number;
    network_rank: number;
  };
  priorities: {
    immediate: any[];
    short_term: any[];
    long_term: any[];
  };
  analysis: {
    liquidity: {
      score: number;
      recommendations: any[];
    };
    connectivity: {
      score: number;
      recommendations: any[];
    };
    fees: {
      score: number;
      recommendations: any[];
    };
  };
  metrics: {
    revenue: {
      current: number;
      change: number;
      history: { date: string; value: number }[];
    };
    efficiency: {
      current: number;
      change: number;
      history: { date: string; value: number }[];
    };
    channels: {
      current: number;
      change: number;
      history: { date: string; value: number }[];
    };
    uptime: {
      current: number;
      change: number;
      history: { date: string; value: number }[];
    };
  };
}

interface User {
  id: string;
  name?: string;
  email: string;
  pubkey?: string;
  // ... autres propriétés
}

const DaziaPage: FC = () => {
  const { session } = useSupabase();
  const { pubkey, isLoaded: pubkeyLoaded } = usePubkeyCookie();
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([]);
  const [dailyRecommendation, setDailyRecommendation] = useState<DailyRecommendation | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [generatingDaily, setGeneratingDaily] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [modal, setModal] = useState<RecommendationModal>({ isOpen: false, recommendation: null, type: 'enhanced' });
  const [activeTab, setActiveTab] = useState<'immediate' | 'short_term' | 'long_term'>('immediate');
  const [data, setData] = useState<DaziaData | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    categories: [] as string[],
    impact: [] as string[],
    difficulty: [] as string[]
  });

  // Charger les recommandations quand le pubkey est disponible
  useEffect(() => {
    const loadRecommendations = async (): Promise<void> => {
      if (!session?.access_token || !pubkey || !pubkeyLoaded) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        console.log(`🔍 Chargement des recommandations pour ${pubkey.substring(0, 10)}...`);
        
        // Charger les recommandations avancées
        const enhancedResponse = await fetch(`/api/dazno/priorities-enhanced/${pubkey}`, {
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
            console.log(`✅ ${enrichedRecommendations.length} recommandations chargées`);
          } else {
            console.warn('⚠️ Aucune recommandation trouvée dans la réponse');
            setError('Aucune recommandation disponible pour ce nœud');
          }
        } else {
          const errorData = await enhancedResponse.json().catch(() => ({}));
          console.error('❌ Erreur API:', enhancedResponse.status, errorData);
          
          if (enhancedResponse.status === 500) {
            setError('Service temporairement indisponible. Veuillez réessayer dans quelques minutes.');
          } else if (enhancedResponse.status === 401) {
            setError('Session expirée. Veuillez vous reconnecter.');
          } else if (enhancedResponse.status === 400) {
            setError('Clé publique invalide. Vérifiez votre configuration dans "Mon Nœud".');
          } else {
            setError(errorData.error?.message || 'Erreur lors du chargement des recommandations');
          }
        }

        // Vérifier l'abonnement (simulé)
        setHasSubscription(false); // Par défaut pas d'abonnement premium

      } catch (err) {
        console.error('❌ Erreur lors du chargement des données:', err);
        setError('Erreur de connexion. Vérifiez votre connexion internet et réessayez.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [session, pubkey, pubkeyLoaded]);

  // Générer la recommandation du jour
  const generateDailyRecommendation = async (): Promise<void> => {
    if (!session?.access_token) {
      setError('Vous devez être connecté pour générer une recommandation');
      return;
    }

    if (!pubkey) {
      setError('Veuillez d\'abord renseigner votre clé publique de nœud dans l\'onglet "Mon Nœud"');
      return;
    }

    setGeneratingDaily(true);
    setError(null);

    try {
      const response = await fetch('/api/user/dazia/generate-recommendation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pubkey })
      });

      const data = await response.json();

      if (data.success) {
        setDailyRecommendation(data.data);
        
        // Scroll vers la nouvelle recommandation
        setTimeout(() => {
          document.getElementById('daily-recommendation')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 100);
      } else {
        setError(data.error?.message || 'Erreur lors de la génération de la recommandation');
      }
    } catch (err) {
      console.error('Erreur génération recommandation:', err);
      setError('Erreur lors de la génération de la recommandation. Veuillez réessayer.');
    } finally {
      setGeneratingDaily(false);
    }
  };

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

  const openModal = (recommendation: EnhancedRecommendation | DailyRecommendation): void => {
    const type = 'action' in recommendation ? 'enhanced' : 'daily';
    setModal({ isOpen: true, recommendation, type });
  };

  const closeModal = (): void => {
    setModal({ isOpen: false, recommendation: null, type: 'enhanced' });
  };

  const retryLoadRecommendations = (): void => {
    setError(null);
    setLoading(true);
    // Le useEffect se déclenchera automatiquement
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session?.user?.pubkey) {
          throw new Error('Clé publique non disponible');
        }

        const [nodeInfo, recommendations, priorities] = await Promise.all([
          daznoAPI.getNodeInfo(session.user.pubkey),
          daznoAPI.getRecommendations(session.user.pubkey),
          daznoAPI.getPriorities(session.user.pubkey, {
            context: 'node_optimization',
            goals: ['increase_revenue', 'improve_connectivity'],
            preferences: {
              risk_tolerance: 'medium',
              investment_horizon: 'medium_term'
            }
          })
        ]);

        // Transformer les données
        const transformedData: DaziaData = {
          overview: {
            health_score: nodeInfo.health_score,
            revenue_7d: nodeInfo.routing_revenue_7d,
            efficiency: nodeInfo.forwarding_efficiency,
            network_rank: nodeInfo.network_rank
          },
          priorities: {
            immediate: priorities.actions.filter(a => a.priority === 1),
            short_term: priorities.actions.filter(a => a.priority === 2),
            long_term: priorities.actions.filter(a => a.priority === 3)
          },
          analysis: {
            liquidity: {
              score: nodeInfo.liquidity_score,
              recommendations: recommendations.filter(r => r.category === 'liquidity')
            },
            connectivity: {
              score: nodeInfo.connectivity_score,
              recommendations: recommendations.filter(r => r.category === 'connectivity')
            },
            fees: {
              score: nodeInfo.fee_score || 0,
              recommendations: recommendations.filter(r => r.category === 'fees')
            }
          },
          metrics: {
            revenue: {
              current: nodeInfo.routing_revenue_7d,
              change: 5.2, // À calculer avec l'historique
              history: [] // À remplir avec l'historique
            },
            efficiency: {
              current: nodeInfo.forwarding_efficiency,
              change: 2.1,
              history: []
            },
            channels: {
              current: nodeInfo.active_channels,
              change: 3.4,
              history: []
            },
            uptime: {
              current: nodeInfo.uptime_percentage,
              change: 0.5,
              history: []
            }
          }
        };

        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
    };

    fetchData();
  }, [session]);

  const handleCompleteAction = (id: string) => {
    setCompletedActions(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const filterRecommendations = (recommendations: any[]) => {
    return recommendations.filter(rec => {
      const matchesSearch = filters.search === '' || 
        rec.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        rec.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(rec.category);
      
      const matchesImpact = filters.impact.length === 0 || 
        filters.impact.includes(rec.impact);
      
      const matchesDifficulty = filters.difficulty.length === 0 || 
        filters.difficulty.includes(rec.difficulty);
      
      return matchesSearch && matchesCategory && matchesImpact && matchesDifficulty;
    });
  };

  if (!pubkeyLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!pubkeyLoaded ? 'Chargement de la configuration...' : 'Chargement des recommandations Dazia...'}
          </p>
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

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800">Erreur</h2>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6">
      <DaziaHeader />

      <PerformanceMetrics metrics={data.metrics} />

      <AdvancedStats stats={{
        channelDistribution: {
          labels: ['Petits', 'Moyens', 'Grands'],
          data: [30, 50, 20]
        },
        revenueByCategory: {
          labels: ['Routage', 'Frais', 'Autres'],
          data: [60, 30, 10]
        },
        networkMetrics: {
          centrality: 0.75,
          betweenness: 0.82,
          eigenvector: 0.68
        },
        feeMetrics: {
          baseFee: 1000,
          feeRate: 500,
          htlcFee: 100
        }
      }} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Recommandations IA
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('immediate')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeTab === 'immediate'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Immédiat
            </button>
            <button
              onClick={() => setActiveTab('short_term')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeTab === 'short_term'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Court terme
            </button>
            <button
              onClick={() => setActiveTab('long_term')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeTab === 'long_term'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Long terme
            </button>
          </div>
        </div>

        <RecommendationFilters onFilterChange={setFilters} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filterRecommendations(data.priorities[activeTab])
              .filter(rec => !completedActions.has(rec.id))
              .map(recommendation => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onComplete={handleCompleteAction}
                />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section Analyse détaillée */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Analyse détaillée
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data.analysis).map(([category, data]) => (
            <div
              key={category}
              className="rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold capitalize text-gray-900">
                {category}
              </h3>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {data.score}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.score}%` }}
                    className="h-full bg-yellow-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600">
                  Recommandations
                </h4>
                <ul className="mt-2 space-y-2">
                  {data.recommendations.slice(0, 3).map(rec => (
                    <li
                      key={rec.id}
                      className="text-sm text-gray-600"
                    >
                      • {rec.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de détails */}
      {modal.isOpen && modal.recommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {'action' in modal.recommendation ? modal.recommendation.action : modal.recommendation.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {modal.recommendation.category}
                    {'timeline' in modal.recommendation && ` • ${modal.recommendation.timeline}`}
                  </p>
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
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {'reasoning' in modal.recommendation ? 'Justification' : 'Description'}
                  </h4>
                  <p className="text-gray-700">
                    {'reasoning' in modal.recommendation ? modal.recommendation.reasoning : modal.recommendation.description}
                  </p>
                </div>

                {(('implementation_details' in modal.recommendation && modal.recommendation.implementation_details?.steps) || 
                  ('implementation_steps' in modal.recommendation && modal.recommendation.implementation_steps)) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Étapes d'implémentation</h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                      {('implementation_details' in modal.recommendation 
                        ? modal.recommendation.implementation_details?.steps 
                        : modal.recommendation.implementation_steps
                      )?.map((step, idx) => (
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
                      <span className="ml-2 font-medium text-green-600">
                        {'expected_impact' in modal.recommendation 
                          ? modal.recommendation.expected_impact 
                          : `${modal.recommendation.impact} impact`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulté:</span>
                      <span className="ml-2">{getDifficultyIcon(modal.recommendation.difficulty)} {modal.recommendation.difficulty}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Temps estimé:</span>
                      <span className="ml-2">
                        {'implementation_details' in modal.recommendation
                          ? `${modal.recommendation.implementation_details?.estimated_hours || 2}h`
                          : modal.recommendation.estimated_time}
                      </span>
                    </div>
                    {('urgency' in modal.recommendation) && (
                      <div>
                        <span className="text-gray-500">Urgence:</span>
                        <span className="ml-2">{modal.recommendation.urgency}</span>
                      </div>
                    )}
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
                    if (modal.type === 'enhanced' && modal.recommendation) {
                      const index = recommendations.indexOf(modal.recommendation as EnhancedRecommendation);
                      if (index !== -1) toggleCompletion(index);
                    }
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