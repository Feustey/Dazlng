"use client";

import React, { useState, useEffect, FC, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DaziaHeader } from './components/DaziaHeader';
import { RecommendationCard } from './components/RecommendationCard';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { usePubkeyCookie } from '@/app/user/hooks/usePubkeyCookie';
import { useGamificationSystem } from '@/app/user/hooks/useGamificationSystem';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { RecommendationFilters } from './components/RecommendationFilters';
import { AdvancedStats } from './components/AdvancedStats';
import { daznoAPI, DaznoRecommendation } from '@/lib/dazno-api';
import { SparklesIcon } from '@/app/components/icons/SparklesIcon';
import { EnhancedRecommendation, DailyRecommendation, DaziaData } from '@/types/recommendations';
import Link from 'next/link';
import { Gauge, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';

export interface RecommendationModal {
  isOpen: boolean;
  recommendation: EnhancedRecommendation | DailyRecommendation | null;
  type: 'enhanced' | 'daily';
}

const DaziaPage: FC = () => {
  const { pubkey, isLoaded: pubkeyLoaded, setPubkey } = usePubkeyCookie();
  const { isLoading: _userLoading } = useGamificationSystem();
  const { loading: _subscriptionLoading } = useSubscription();
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([]);
  const [_dailyRecommendation, setDailyRecommendation] = useState<DailyRecommendation | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [_generatingDaily, setGeneratingDaily] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_hasSubscription, setHasSubscription] = useState(false);
  const [modal, setModal] = useState<RecommendationModal>({ isOpen: false, recommendation: null, type: 'enhanced' });
  const [activeTab, setActiveTab] = useState<'immediate' | 'short_term' | 'long_term'>('immediate');
  const [data, setData] = useState<DaziaData | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    categories: [] as string[],
    impact: [] as string[],
    difficulty: [] as string[]
  });
  const locale = useLocale();

  // Charger les recommandations quand le pubkey est disponible
  useEffect(() => {
    const loadRecommendations = async (): Promise<void> => {
      if (!pubkey || !pubkeyLoaded) {
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
            'Authorization': `Bearer ${pubkey}`,
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
  }, [pubkey, pubkeyLoaded]);

  // Générer la recommandation du jour
  const _generateDailyRecommendation = async (): Promise<void> => {
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
          'Authorization': `Bearer ${pubkey}`,
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

  const _getPriorityColor = (priority: number): string => {
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

  const _openModal = (recommendation: EnhancedRecommendation | DailyRecommendation): void => {
    const type = 'action' in recommendation ? 'enhanced' : 'daily';
    setModal({ isOpen: true, recommendation, type });
  };

  const closeModal = (): void => {
    setModal({ isOpen: false, recommendation: null, type: 'enhanced' });
  };

  const _retryLoadRecommendations = (): void => {
    setError(null);
    setLoading(true);
    // Le useEffect se déclenchera automatiquement
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!pubkey) {
          throw new Error('Clé publique non disponible');
        }

        const [_nodeInfo, _recommendations, _priorities] = await Promise.all([
          daznoAPI.getNodeInfo(pubkey),
          daznoAPI.getRecommendations(pubkey),
          daznoAPI.getPriorities(pubkey)
        ]);

        // Transformer les données
        const transformedData: DaziaData = {
          recommendations: (_recommendations as DaznoRecommendation[]).filter((r: DaznoRecommendation) => 
            r.category !== 'liquidity' && 
            r.category !== 'connectivity' && 
            r.category !== 'fees'
          ).map((r: DaznoRecommendation): EnhancedRecommendation => ({
            id: r.id,
            title: r.title,
            description: r.description,
            priority: Number(r.priority) || 0,
            impact: r.impact,
            difficulty: r.difficulty,
            estimated_gain: Number(r.estimated_gain_sats) || 0,
            category:
              r.category === 'channel_management' ? 'liquidity' :
              r.category === 'fee_optimization' ? 'fees' :
              r.category === 'routing' ? 'connectivity' : 'security',
            action_type: r.action_type,
            steps: [
              {
                order: 1,
                description: 'Analyser la situation actuelle',
                command: 'lncli getinfo'
              },
              {
                order: 2,
                description: "Planifier l'implémentation",
                command: 'lncli listchannels'
              },
              {
                order: 3,
                description: "Exécuter l'action",
                command: 'lncli updatechanpolicy'
              }
            ],
            free: Boolean(r.free)
          })),
          dailyRecommendation: null,
          completedActions: new Set()
        };

        setData(transformedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Erreur lors du chargement des données');
      }
    };

    fetchData();
  }, [pubkey]);

  const handleCompleteAction = (id: string) => {
    setCompletedActions(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const filterRecommendations = (recommendations: EnhancedRecommendation[]) => {
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

  const _renderRecommendations = (): ReactNode => {
    if (!data) return null;

    return (
      <div className="space-y-4">
        {data.recommendations.map((recommendation: EnhancedRecommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onComplete={() => handleCompleteAction(recommendation.id)}
            isPremium={false}
          />
        ))}
      </div>
  );
  };

  const handleTabChange = (newValue: 'immediate' | 'short_term' | 'long_term') => {
    setActiveTab(newValue);
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
        <div className="text-center mt-8">
          <Link
            href="/user/node"
            locale={locale}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Gauge className="h-5 w-5 mr-2" />
            Tester DazFlow Index
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
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

  if (!data || data.recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <SparklesIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Aucune recommandation disponible</h1>
        <p className="text-gray-600 mb-6">
          Nous n'avons pas pu charger de recommandations pour votre nœud.
        </p>
      </div>
  );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6">
      <DaziaHeader />

      <PerformanceMetrics metrics={{
        revenue: {
          current: data.recommendations[0]?.estimated_gain || 0,
          change: 5.2,
          history: []
        },
        efficiency: {
          current: data.recommendations[0]?.priority || 0,
          change: 2.1,
          history: []
        },
        channels: {
          current: data.recommendations.length,
          change: 3.4,
          history: []
        },
        uptime: {
          current: 99.5,
          change: 0.5,
          history: []
        }
      }} />

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
              onClick={() => handleTabChange('immediate')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeTab === 'immediate'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Immédiat
            </button>
            <button
              onClick={() => handleTabChange('short_term')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeTab === 'short_term'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Court terme
            </button>
            <button
              onClick={() => handleTabChange('long_term')}
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
            {filterRecommendations(data.recommendations)
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
          {Object.entries(data.recommendations[0] || {})
            .filter(([key, _value]) => key !== 'id' && key !== 'category' && key !== 'impact' && key !== 'difficulty')
            .slice(0, 6) // Limiter à 6 éléments pour éviter les erreurs
            .map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold capitalize text-gray-900">
                  {key.replace(/_/g, ' ')}
                </h3>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {typeof value === 'number' ? value : String(value).slice(0, 10)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(typeof value === 'number' ? value : 0, 100)}%` }}
                      className="h-full bg-yellow-500"
                    />
                  </div>
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

                {('implementation_details' in modal.recommendation && modal.recommendation.implementation_details?.steps) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Étapes d'implémentation</h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                      {modal.recommendation.implementation_details.steps?.map((step: any, idx: any) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {modal.recommendation.success_criteria && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Critères de succès</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {modal.recommendation.success_criteria.map((criteria: any, idx: any) => (
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
                          : 'estimated_time' in modal.recommendation ? modal.recommendation.estimated_time : '2h'}
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

export default DaziaPage; export const dynamic = "force-dynamic";
