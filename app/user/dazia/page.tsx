"use client";

import React, { useState, useEffect, FC, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DaziaHeader } from "./components/DaziaHeader";
import { RecommendationCard } from "./components/RecommendationCard";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { usePubkeyCookie } from "@/lib/hooks/usePubkeyCookie";
import { useGamificationSystem } from "@/app/user/hooks/useGamificationSystem";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { RecommendationFilters } from "./components/RecommendationFilters";
import { AdvancedStats } from "./components/AdvancedStats";
import { daznoAPI, DaznoRecommendation } from "@/lib/dazno-api";
import { SparklesIcon } from "@/app/components/icons/SparklesIcon";
import { EnhancedRecommendation, DailyRecommendation, DaziaData } from "@/types/recommendations";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Gauge, ArrowRight } from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export interface RecommendationModal {
  isOpen: boolean;
  recommendation: EnhancedRecommendation | DailyRecommendation | null;
  type: "enhanced" | "daily";
}

const DaziaPage: FC = () => {
  const { t } = useAdvancedTranslation("common");

  const { getPubkey, isLoaded: pubkeyLoaded, setPubkey } = usePubkeyCookie();
  const pubkey = getPubkey();
  const { isLoading: _userLoading } = useGamificationSystem();
  const { loading: _subscriptionLoading } = useSubscription();
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([]);
  const [_dailyRecommendation, setDailyRecommendation] = useState<DailyRecommendation | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [_generatingDaily, setGeneratingDaily] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_hasSubscription, setHasSubscription] = useState(false);
  const [modal, setModal] = useState<RecommendationModal>({ 
    isOpen: false, 
    recommendation: null, 
    type: "enhanced" 
  });
  const [activeTab, setActiveTab] = useState<"immediate" | "short_term" | "long_term">("immediate");
  const [data, setData] = useState<DaziaData | null>(null);
  const [filters, setFilters] = useState({
    search: "",
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
          method: "POST",
          headers: {
            "Authorization": `Bearer ${pubkey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            context: "Optimisation complète du nœud Lightning",
            goals: ["increase_revenue", "improve_centrality", "optimize_channels"],
            depth: "detailed"
          })
        });

        if (enhancedResponse.ok) {
          const enhancedData = await enhancedResponse.json();
          if (enhancedData.success && enhancedData.data?.priority_actions) {
            // Enrichir avec des dates et formater pour l'affichage
            const enrichedRecommendations: EnhancedRecommendation[] = enhancedData.data.priority_actions.map((action: any, index: number) => ({
              ...action,
              reasoning: action.reasoning || `Action recommandée pour améliorer les performances de votre nœud Lightning. Impact estimé: ${action.expected_impact}.`,
              date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split("T")[0], // Dates échelonnées
              implementation_details: action.implementation_details || {
                steps: ["Analyser la situation actuelle", "Planifier l'implémentation", "Exécuter l'action"],
                requirements: ["Accès au nœud Lightning", "Outils de gestion"],
                estimated_hours: Math.ceil(action.priority / 2)
              },
              success_criteria: action.success_criteria || [
                `Amélioration de ${action.expected_impact} des métriques ciblées`,
                "Stabilité maintenue du nœud",
                "Aucun impact négatif sur les canaux existants"
              ]
            }));
            
            setRecommendations(enrichedRecommendations);
            console.log(`✅ ${enrichedRecommendations.length} recommandations chargées`);
          } else {
            console.warn("⚠️ Aucune recommandation trouvée dans la réponse");
            setError("Aucune recommandation disponible pour ce nœud");
          }
        } else {
          const errorData = await enhancedResponse.json().catch(() => ({}));
          console.error("❌ Erreur API:", enhancedResponse.status, errorData);
          
          if (enhancedResponse.status === 500) {
            setError("Service temporairement indisponible. Veuillez réessayer dans quelques minutes.");
          } else if (enhancedResponse.status === 401) {
            setError("Session expirée. Veuillez vous reconnecter.");
          } else if (enhancedResponse.status === 400) {
            setError("Clé publique invalide. Vérifiez votre configuration dans \"Mon Nœud\".");
          } else {
            setError(errorData.error?.message || "Erreur lors du chargement des recommandations");
          }
        }

        // Vérifier l'abonnement (simulé)
        setHasSubscription(false); // Par défaut pas d'abonnement premium

      } catch (err) {
        console.error("❌ Erreur lors du chargement des données:", err);
        setError("Erreur de connexion. Vérifiez votre connexion internet et réessayez.");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [pubkey, pubkeyLoaded]);

  // Générer la recommandation du jour
  const _generateDailyRecommendation = async (): Promise<void> => {
    if (!pubkey) {
      setError("Veuillez d'abord renseigner votre clé publique de nœud dans l'onglet \"Mon Nœud\"");
      return;
    }

    setGeneratingDaily(true);
    setError(null);

    try {
      const response = await fetch("/api/user/dazia/generate-recommendation", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${pubkey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ pubkey })
      });

      const data = await response.json();

      if (data.success) {
        setDailyRecommendation(data.data);
        
        // Scroll vers la nouvelle recommandation
        setTimeout(() => {
          document.getElementById("daily-recommendation")?.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
          });
        }, 100);
      } else {
        setError(data.error?.message || "Erreur lors de la génération de la recommandation");
      }
    } catch (err) {
      console.error("Erreur génération recommandation:", err);
      setError("Erreur lors de la génération de la recommandation. Veuillez réessayer.");
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
    if (priority <= 3) return "bg-red-100 text-red-800 border-red-200";
    if (priority <= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getDifficultyIcon = (difficulty: string): string => {
    switch (difficulty) {
      case "low": return "🟢";
      case "medium": return "🟡";
      case "hard": return "🔴";
      default: return "⚪";
    }
  };

  const _openModal = (recommendation: EnhancedRecommendation | DailyRecommendation): void => {
    const type = "action" in recommendation ? "enhanced" : "daily";
    setModal({
      isOpen: true,
      recommendation,
      type
    });
  };

  const closeModal = (): void => {
    setModal({
      isOpen: false,
      recommendation: null,
      type: "enhanced"
    });
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.search && !rec.action.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.categories.length > 0 && !filters.categories.includes(rec.category)) {
      return false;
    }
    if (filters.impact.length > 0 && !filters.impact.includes(rec.expected_impact)) {
      return false;
    }
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(rec.difficulty)) {
      return false;
    }
    return true;
  });

  if (!pubkey) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <SparklesIcon className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("dazia.connect_node_first")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("dazia.connect_node_description")}
          </p>
          <Link
            href="/user/node"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Gauge className="w-5 h-5 mr-2" />
            {t("dazia.connect_node_button")}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <DaziaHeader
        pubkey={pubkey}
        recommendationsCount={recommendations.length}
        completedCount={completedActions.size}
        onGenerateDaily={_generateDailyRecommendation}
        generating={_generatingDaily}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtres */}
        <div className="lg:col-span-1">
          <RecommendationFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t("dazia.loading_recommendations")}</p>
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <div className="text-center py-12">
              <SparklesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("dazia.no_recommendations")}
              </h3>
              <p className="text-gray-600">
                {t("dazia.no_recommendations_description")}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRecommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={index}
                  recommendation={recommendation}
                  isCompleted={completedActions.has(`${index}`)}
                  onToggleCompletion={() => toggleCompletion(index)}
                  onOpenModal={() => _openModal(recommendation)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de recommandation */}
      <AnimatePresence>
        {modal.isOpen && modal.recommendation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {modal.recommendation.action}
                </h2>
                <p className="text-gray-600 mb-4">
                  {modal.recommendation.reasoning}
                </p>
                {/* Contenu détaillé de la recommandation */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DaziaPage;