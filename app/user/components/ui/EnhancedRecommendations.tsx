import React, { useState } from 'react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  isFree: boolean;
  estimatedGain: number; // en sats
  timeToImplement: string;
  category: 'liquidity' | 'routing' | 'efficiency' | 'security';
}

interface EnhancedRecommendationsProps {
  recommendations: Recommendation[];
  isPremium: boolean;
  onApplyRecommendation: (id: string) => void;
  onUpgradeToPremium: () => void;
}

const EnhancedRecommendations: React.FC<EnhancedRecommendationsProps> = ({
  recommendations,
  isPremium,
  onApplyRecommendation,
  onUpgradeToPremium
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const categories = [
    { id: 'all', label: 'Toutes', icon: '📋' },
    { id: 'liquidity', label: 'Liquidité', icon: '💧' },
    { id: 'routing', label: 'Routage', icon: '🛣️' },
    { id: 'efficiency', label: 'Efficacité', icon: '⚡' },
    { id: 'security', label: 'Sécurité', icon: '🔒' }
  ];

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactIcon = (impact: string): string => {
    switch (impact) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '💡';
      default: return '📊';
    }
  };

  const getDifficultyIcon = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const filteredRecommendations = activeCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === activeCategory);

  const freeRecommendations = filteredRecommendations.filter(rec => rec.isFree);
  const premiumRecommendations = filteredRecommendations.filter(rec => !rec.isFree);

  const totalPotentialGain = premiumRecommendations.reduce((sum, rec) => sum + rec.estimatedGain, 0);

  const formatSats = (sats: number): string => {
    return sats.toLocaleString('fr-FR');
  };

  const PremiumModal = (): JSX.Element => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold mb-2">Débloquez Dazia Premium</h3>
          <p className="text-gray-600">
            Accédez à toutes les recommandations personnalisées et optimisez vos revenus
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              +{formatSats(totalPotentialGain)} sats
            </div>
            <div className="text-sm text-purple-600">
              Gain potentiel mensuel avec nos recommandations
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <span className="text-sm">Recommandations IA personnalisées</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <span className="text-sm">Optimisation automatique des frais</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <span className="text-sm">Analyses de performance avancées</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <span className="text-sm">Support prioritaire</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPremiumModal(false)}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Plus tard
          </button>
          <button
            onClick={() => {
              setShowPremiumModal(false);
              onUpgradeToPremium();
            }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
          >
            Upgrader
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">🧠 Recommandations Dazia</h2>
            <p className="text-gray-600 text-sm">
              Optimisez votre nœud avec l'intelligence artificielle
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{freeRecommendations.length}</div>
              <div className="text-xs text-gray-500">Gratuites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{premiumRecommendations.length}</div>
              <div className="text-xs text-gray-500">Premium</div>
            </div>
            {!isPremium && (
              <button
                onClick={() => setShowPremiumModal(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 transition"
              >
                Passer Premium
              </button>
            )}
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommandations gratuites */}
      {freeRecommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-semibold">Recommandations gratuites</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {freeRecommendations.length} disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {freeRecommendations.map((rec) => (
              <div key={rec.id} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                        {getImpactIcon(rec.impact)} {rec.impact}
                      </span>
                      <span className="text-sm">{getDifficultyIcon(rec.difficulty)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱️ {rec.timeToImplement}</span>
                      <span>💰 +{formatSats(rec.estimatedGain)} sats/mois</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onApplyRecommendation(rec.id)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-green-700 transition"
                >
                  Appliquer maintenant
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations Premium */}
      {premiumRecommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⭐</span>
            <h3 className="text-lg font-semibold">Optimisations Premium</h3>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
              {premiumRecommendations.length} disponibles
            </span>
          </div>

          {!isPremium && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6">
              <div className="text-center">
                <h4 className="font-semibold text-purple-800 mb-2">
                  🚀 Débloquez {premiumRecommendations.length} recommandations premium
                </h4>
                <p className="text-purple-700 text-sm mb-4">
                  Gain potentiel: <span className="font-bold">+{formatSats(totalPotentialGain)} sats/mois</span>
                </p>
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                >
                  Upgrader vers Premium
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {premiumRecommendations.map((rec) => (
              <div 
                key={rec.id} 
                className={`border rounded-lg p-4 ${
                  isPremium 
                    ? 'border-purple-200 hover:shadow-md' 
                    : 'border-gray-200 opacity-60'
                } transition`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        ⭐ Premium
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                        {getImpactIcon(rec.impact)} {rec.impact}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱️ {rec.timeToImplement}</span>
                      <span>💰 +{formatSats(rec.estimatedGain)} sats/mois</span>
                    </div>
                  </div>
                </div>
                
                {isPremium ? (
                  <button
                    onClick={() => onApplyRecommendation(rec.id)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-purple-700 transition"
                  >
                    Appliquer maintenant
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-lg font-medium text-sm cursor-not-allowed"
                  >
                    Premium requis
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showPremiumModal && <PremiumModal />}
    </div>
  );
};

export default EnhancedRecommendations; 