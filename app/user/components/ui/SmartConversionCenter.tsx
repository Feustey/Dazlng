import React, { useState } from "react";
import {Zap, TrendingUp, DollarSign, Clock, Star, Lock, ChevronRight} from "@/components/shared/ui/IconRegistry";

export interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  category: "revenue" | "efficiency" | "security" | "growth";
  impact: "high" | "medium" | "low";
  estimatedGain: number;
  timeToImplement: string;
  isPremium: boolean;
  appliedBy?: number; // Nombre d'utilisateurs qui l'ont appliquée
}

export interface SmartConversionCenterProps {
  recommendations: SmartRecommendation[];
  userScore: number;
  isPremium: boolean;
  hasNode: boolean;
  onApplyRecommendation: (id: string) => void;
  onShowPremiumModal: () => void;
}

export const SmartConversionCenter: React.FC<SmartConversionCenterProps> = ({
  recommendations,
  userScore,
  isPremium,
  hasNode,
  onApplyRecommendation,
  onShowPremiumModal
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "free" | "premium">("all");

  const freeRecommendations = recommendations.filter(r => !r.isPremium);
  const premiumRecommendations = recommendations.filter(r => r.isPremium);
  
  const getFilteredRecommendations = () => {
    switch (activeTab) {
      case "free": return freeRecommendations;
      case "premium": return premiumRecommendations;
      default: return recommendations;
    }
  };

  const filteredRecommendations = getFilteredRecommendations();

  const getPersonalizedMessage = () => {
    if (userScore >= 80) {
      return {
        emoji: "🏆",
        title: "Optimisations d'Expert",
        message: "Voici des stratégies avancées pour maximiser vos performances Lightning"
      };
    } else if (userScore >= 60) {
      return {
        emoji: "🚀",
        title: "Améliorations Stratégiques",
        message: "Optimisez votre configuration avec ces recommandations personnalisées"
      };
    } else {
      return {
        emoji: "💡",
        title: "Premiers Pas",
        message: "Commencez par ces optimisations fondamentales pour votre nœud"
      };
    }
  };

  const personalizedMessage = getPersonalizedMessage();
  const totalPotentialGain = filteredRecommendations.reduce((sum, r) => sum + r.estimatedGain, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "revenue": return <DollarSign className="w-4 h-4" />;
      case "efficiency": return <Zap className="w-4 h-4" />;
      case "security": return <Lock className="w-4 h-4" />;
      case "growth": return <TrendingUp className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-500 bg-red-50";
      case "medium": return "text-orange-500 bg-orange-50";
      case "low": return "text-green-500 bg-green-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="text-center mb-8">
        <span className="text-4xl mb-4 block">{personalizedMessage.emoji}</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{personalizedMessage.title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{personalizedMessage.message}</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: "all", label: `Toutes (${recommendations.length})`, count: recommendations.length },
            { key: "free", label: `Gratuites (${freeRecommendations.length})`, count: freeRecommendations.length },
            { key: "premium", label: `Premium (${premiumRecommendations.length})`, count: premiumRecommendations.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {totalPotentialGain > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Gain Potentiel: {totalPotentialGain.toLocaleString()} sats/mois
              </h3>
              <p className="text-green-600">
                En appliquant ces {filteredRecommendations.length} recommandations
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune recommandation disponible pour cette catégorie
          </div>
        ) : (
          filteredRecommendations.map((recommendation) => (
            <div 
              key={recommendation.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(recommendation.category)}
                    <h4 className="font-semibold text-gray-800">{recommendation.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(recommendation.impact)}`}>
                      {recommendation.impact}
                    </span>
                    {recommendation.isPremium && <Lock className="w-4 h-4 text-amber-500" />}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{recommendation.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>+{recommendation.estimatedGain.toLocaleString()} sats/mois</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recommendation.timeToImplement}</span>
                    </div>
                    {recommendation.appliedBy && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{recommendation.appliedBy} utilisateurs</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4">
                  {recommendation.isPremium && !isPremium ? (
                    <button
                      onClick={() => onShowPremiumModal()}
                      className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Premium
                    </button>
                  ) : (
                    <button
                      onClick={() => onApplyRecommendation(recommendation.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      Appliquer
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!isPremium && premiumRecommendations.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-amber-800 mb-2">
              Débloquez {premiumRecommendations.length} recommandations premium
            </h3>
            <p className="text-amber-600 mb-4">
              Gain potentiel supplémentaire: +{premiumRecommendations.reduce((sum, r) => sum + r.estimatedGain, 0).toLocaleString()} sats/mois
            </p>
            <button
              onClick={() => onShowPremiumModal()}
              className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
            >
              Passer à Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
};