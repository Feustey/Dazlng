import React, { useState } from 'react';
import { Brain, TrendingUp, DollarSign, Clock, ChevronRight, Lock } from 'lucide-react';
import { CRMData } from '../../types';

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'liquidity' | 'routing' | 'efficiency' | 'revenue';
  impact: 'low' | 'medium' | 'high';
  timeToImplement: string;
  estimatedGain: number; // en sats
  isPremium: boolean;
  applied?: boolean;
  confidenceScore: number; // 0-100
}

interface SmartRecommendationsProps {
  recommendations: SmartRecommendation[];
  crmData: CRMData;
  isPremium: boolean;
  onApplyRecommendation: (id: string) => void;
  onShowPremiumModal: () => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations,
  crmData,
  isPremium,
  onApplyRecommendation,
  onShowPremiumModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Toutes', count: recommendations.length },
    { id: 'revenue', label: 'Revenus', count: recommendations.filter(r => r.category === 'revenue').length },
    { id: 'liquidity', label: 'Liquidité', count: recommendations.filter(r => r.category === 'liquidity').length },
    { id: 'routing', label: 'Routage', count: recommendations.filter(r => r.category === 'routing').length },
    { id: 'efficiency', label: 'Efficacité', count: recommendations.filter(r => r.category === 'efficiency').length }
  ];

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

  // Trier par impact et disponibilité
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    if (a.isPremium && !b.isPremium && !isPremium) return 1;
    if (!a.isPremium && b.isPremium && !isPremium) return -1;
    
    const impactOrder = { high: 3, medium: 2, low: 1 };
    return impactOrder[b.impact] - impactOrder[a.impact];
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <DollarSign className="w-4 h-4" />;
      case 'liquidity': return <TrendingUp className="w-4 h-4" />;
      case 'routing': return <Brain className="w-4 h-4" />;
      case 'efficiency': return <Clock className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  // Recommandations personnalisées selon le segment CRM
  const getPersonalizedMessage = () => {
    const { userScore, engagementLevel } = crmData;
    
    if (userScore >= 80) {
      return {
        message: "Excellent ! Voici des optimisations avancées pour maximiser vos performances",
        emoji: "🏆"
      };
    }
    
    if (userScore >= 60) {
      return {
        message: "Votre nœud progresse bien. Ces recommandations vous feront passer au niveau supérieur",
        emoji: "⚡"
      };
    }
    
    if (userScore >= 40) {
      return {
        message: "Commencez par ces optimisations pour améliorer significativement vos revenus",
        emoji: "🚀"
      };
    }
    
    return {
      message: "Bienvenue ! Ces premières optimisations vont transformer votre nœud",
      emoji: "👋"
    };
  };

  const personalizedMessage = getPersonalizedMessage();
  const freeRecommendations = recommendations.filter(r => !r.isPremium);
  const premiumRecommendations = recommendations.filter(r => r.isPremium);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{personalizedMessage.emoji}</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Recommandations Dazia
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  IA
                </span>
              </h2>
              <p className="text-gray-600 text-sm">{personalizedMessage.message}</p>
            </div>
          </div>
          
          {!isPremium && (
            <button
              onClick={onShowPremiumModal}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 transition"
            >
              Débloquer Premium
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
              {Math.round(recommendations.reduce((sum, r) => sum + r.estimatedGain, 0) / 1000)}k
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

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition ${
              selectedCategory === category.id
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.id !== 'all' && getCategoryIcon(category.id)}
            {category.label}
            <span className="bg-white rounded-full px-2 py-0.5 text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Liste des recommandations */}
      <div className="space-y-4">
        {sortedRecommendations.map(recommendation => (
          <div
            key={recommendation.id}
            className={`border rounded-lg p-4 transition ${
              recommendation.isPremium && !isPremium
                ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
                : recommendation.applied
                ? 'bg-green-50 border-green-200'
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
                    
                    {recommendation.applied && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        ✓ Appliquée
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
                  <div className="flex items-center gap-1">
                    <Brain className="w-4 h-4" />
                    {recommendation.confidenceScore}% confiance
                  </div>
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
                ) : recommendation.applied ? (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm">
                    ✓ Appliquée
                  </div>
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

      {sortedRecommendations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p>Aucune recommandation disponible dans cette catégorie.</p>
        </div>
      )}

      {/* CTA Premium si utilisateur éligible */}
      {!isPremium && crmData.userScore >= 40 && premiumRecommendations.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Débloquez {premiumRecommendations.length} recommandations Premium</h3>
              <p className="text-purple-100 text-sm">
                Gain potentiel estimé: +{Math.round(premiumRecommendations.reduce((sum, r) => sum + r.estimatedGain, 0) / 1000)}k sats/mois
              </p>
            </div>
            <button
              onClick={onShowPremiumModal}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Passer Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 