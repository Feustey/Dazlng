import React, { useState } from 'react';
import { Zap, TrendingUp, DollarSign, Clock, Star, Lock, ChevronRight } from 'lucide-react';

export interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'efficiency' | 'security' | 'growth';
  impact: 'high' | 'medium' | 'low';
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
  hasNode: _hasNode,
  onApplyRecommendation,
  onShowPremiumModal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all');

  const freeRecommendations = recommendations.filter(r => !r.isPremium);
  const premiumRecommendations = recommendations.filter(r => r.isPremium);
  
  const getFilteredRecommendations = () => {
    switch (activeTab) {
      case 'free': return freeRecommendations;
      case 'premium': return premiumRecommendations;
      default: return recommendations;
    }
  };

  const filteredRecommendations = getFilteredRecommendations();

  const getPersonalizedMessage = () => {
    if (userScore >= 80) {
      return {
        emoji: '🏆',
        title: 'Optimisations d\'Expert',
        message: 'Voici des stratégies avancées pour maximiser vos performances Lightning'
      };
    }
    if (userScore >= 60) {
      return {
        emoji: '⚡',
        title: 'Optimisations Intelligentes',
        message: 'Débloquez le potentiel de votre nœud avec ces recommandations ciblées'
      };
    }
    if (userScore >= 40) {
      return {
        emoji: '🚀',
        title: 'Boostez vos Performances',
        message: 'Ces optimisations vont considérablement améliorer vos revenus'
      };
    }
    return {
      emoji: '💡',
      title: 'Premières Optimisations',
      message: 'Commencez par ces améliorations pour transformer votre nœud'
    };
  };

  const personalizedMessage = getPersonalizedMessage();
  const totalPotentialGain = premiumRecommendations.reduce((sum: any, r: any) => sum + r.estimatedGain, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'efficiency': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'security': return <Lock className="w-4 h-4 text-red-500" />;
      case 'growth': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{personalizedMessage.emoji}</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                {personalizedMessage.title}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Dazia IA
                </span>
              </h2>
              <p className="text-gray-600 text-sm">{personalizedMessage.message}</p>
            </div>
          </div>
          
          {!isPremium && (
            <button
              onClick={onShowPremiumModal}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition transform hover:scale-105"
            >
              🚀 Débloquer Premium
            </button>
          )}
        </div>

        {/* Métriques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="text-lg font-bold text-blue-600">{freeRecommendations.length}</div>
            <div className="text-xs text-blue-800">Gratuites</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="text-lg font-bold text-purple-600">{premiumRecommendations.length}</div>
            <div className="text-xs text-purple-800">Premium</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="text-lg font-bold text-green-600">
              {Math.round(totalPotentialGain / 1000)}k
            </div>
            <div className="text-xs text-green-800">Sats potentiels</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <div className="text-lg font-bold text-orange-600">
              {recommendations.filter(r => r.impact === 'high').length}
            </div>
            <div className="text-xs text-orange-800">Impact élevé</div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
        {[
          { id: 'all', label: 'Toutes', count: recommendations.length },
          { id: 'free', label: 'Gratuites', count: freeRecommendations.length },
          { id: 'premium', label: 'Premium', count: premiumRecommendations.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Liste des recommandations */}
      <div className="space-y-4">
                 {filteredRecommendations.map((recommendation: any) => (
          <div
            key={recommendation.id}
            className={`border rounded-lg p-4 transition ${
              recommendation.isPremium && !isPremium
                ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getCategoryIcon(recommendation.category)}
                  <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                  
                  {/* Badges */}
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(recommendation.impact)}`}>
                      {recommendation.impact === 'high' ? 'Impact Élevé' : 
                       recommendation.impact === 'medium' ? 'Impact Moyen' : 'Impact Faible'}
                    </span>
                    
                    {recommendation.isPremium && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{recommendation.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recommendation.timeToImplement}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    +{Math.round(recommendation.estimatedGain / 1000)}k sats/mois
                  </div>
                  {recommendation.appliedBy && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {recommendation.appliedBy} utilisateurs l'ont appliquée
                    </div>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                {recommendation.isPremium && !isPremium ? (
                  <button
                    onClick={onShowPremiumModal}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 transition flex items-center gap-2"
                  >
                    Débloquer
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onApplyRecommendation(recommendation.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    Appliquer
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Premium contextuel */}
      {!isPremium && premiumRecommendations.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">
                Débloquez {premiumRecommendations.length} recommandations Premium
              </h3>
              <p className="text-purple-100 text-sm mb-1">
                Gain potentiel estimé: +{Math.round(totalPotentialGain / 1000)}k sats/mois
              </p>
              <p className="text-purple-200 text-xs">
                ROI Premium: ~3 semaines avec votre profil actuel
              </p>
            </div>
            <button
              onClick={onShowPremiumModal}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
            >
              Passer Premium
            </button>
          </div>
        </div>
      )}

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p>Aucune recommandation disponible dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
}
