import React from 'react';
import { DaznoRecommendation } from '@/lib/dazno-api';

export interface Recommendation {
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

export interface UnifiedRecommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  difficulty: string;
  type?: string;
}

export interface EnhancedRecommendationsProps {
  recommendations: (Recommendation | DaznoRecommendation)[];
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
  // Fonction pour normaliser les recommandations
  const normalizeRecommendation = (rec: Recommendation | DaznoRecommendation): UnifiedRecommendation => {
    // Type guard pour Recommendation
    if ('title' in rec && 'isFree' in rec) {
      return {
        id: rec.id,
        title: rec.title,
        description: rec.description,
        impact: rec.impact,
        difficulty: rec.difficulty
      };
    } else {
      // Type guard pour DaznoRecommendation
      const daznoRec = rec as DaznoRecommendation;
      return {
        id: daznoRec.id || '',
        title: daznoRec.type || 'Recommandation',
        description: daznoRec.description || 'Recommandation d\'optimisation pour votre nœud Lightning',
        impact: daznoRec.impact || 'medium',
        difficulty: daznoRec.difficulty || 'medium',
        type: daznoRec.type
      };
    }
  };

  // Affichage temporaire simplifié pour éviter les erreurs TypeScript
  return (
    <div className="space-y-6">
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
              <div className="text-2xl font-bold text-green-600">{recommendations.length}</div>
              <div className="text-xs text-gray-500">Recommandations</div>
            </div>
            {!isPremium && (
              <button
                onClick={onUpgradeToPremium}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 transition"
              >
                Passer Premium
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec: any, index: any) => {
            const normalizedRec = normalizeRecommendation(rec);
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {normalizedRec.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      {normalizedRec.description}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Impact: {normalizedRec.impact}</span>
                      <span>Difficulté: {normalizedRec.difficulty}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onApplyRecommendation(normalizedRec.id)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
  );
          })}
          
          {recommendations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">💡</div>
              <p>Aucune recommandation disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

export default EnhancedRecommendations; 