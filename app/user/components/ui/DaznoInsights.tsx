import React from 'react';
import { DaznoSparkSeerRecommendation } from '@/types/dazno-api';

// Type étendu pour le composant avec propriétés optionnelles
interface ExtendedRecommendation extends DaznoSparkSeerRecommendation {
  id?: string;
  title?: string;
  description?: string;
  confidence_score?: number;
  estimated_gain_sats?: number;
  estimated_timeframe?: string;
  target_alias?: string;
  suggested_amount?: number;
  current_value?: number;
  suggested_value?: number;
}

export interface DaznoInsightsProps {
  recommendations: ExtendedRecommendation[];
  onApplyRecommendation: (id: string) => void;
}

export const DaznoInsights: React.FC<DaznoInsightsProps> = ({
  recommendations,
  onApplyRecommendation,
}) => {
  // Grouper les recommandations par type
  const groupedRecommendations = recommendations.reduce((acc: any, rec: any) => {
    const category = rec.type || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(rec);
    return acc;
  }, {} as Record<string, ExtendedRecommendation[]>);

  // Calculer le score moyen de confiance par catégorie
  const categoryScores = Object.entries(groupedRecommendations).map(([category, recs]) => {
    const avgConfidence = recs.reduce((sum: any, rec: any) => sum + (rec.confidence_score || 0), 0) / recs.length;
    return { category, avgConfidence };
  });

  // Trier les catégories par score de confiance
  categoryScores.sort((a: any, b: any) => b.avgConfidence - a.avgConfidence);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques globales */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Analyse SparkSeer</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Recommandations</div>
            <div className="text-2xl font-bold text-purple-700">{recommendations.length}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Catégories</div>
            <div className="text-2xl font-bold text-blue-700">{Object.keys(groupedRecommendations).length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Gain total estimé</div>
            <div className="text-2xl font-bold text-green-700">
              {formatSats(recommendations.reduce((sum: any, rec: any) => sum + (rec.estimated_gain_sats || 0), 0))} sats
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-orange-600 font-medium">Confiance moyenne</div>
            <div className="text-2xl font-bold text-orange-700">
              {Math.round(recommendations.reduce((sum: any, rec: any) => sum + (rec.confidence_score || 0), 0) / recommendations.length * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Catégories triées par score de confiance */}
      {categoryScores.map(({ category, avgConfidence }) => (
        <div key={category} className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold capitalize">{category.replace('_', ' ')}</h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                {Math.round(avgConfidence * 100)}% confiance
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {groupedRecommendations[category].length} recommandations
            </span>
          </div>

          <div className="space-y-4">
            {groupedRecommendations[category].map((rec: any) => (
              <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-gray-900">{rec.title}</h5>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {Math.round((rec.confidence_score || 0) * 100)}% confiance
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{rec.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-500">
                      {rec.estimated_gain_sats && (
                        <div>
                          <span className="block font-medium text-green-600">Gain estimé</span>
                          <span>{formatSats(rec.estimated_gain_sats)} sats</span>
                        </div>
                      )}

                      {rec.estimated_timeframe && (
                        <div>
                          <span className="block font-medium text-blue-600">Délai</span>
                          <span>{rec.estimated_timeframe}</span>
                        </div>
                      )}

                      {rec.target_alias && (
                        <div>
                          <span className="block font-medium text-purple-600">Cible</span>
                          <span>{rec.target_alias}</span>
                        </div>
                      )}

                      {rec.suggested_amount && (
                        <div>
                          <span className="block font-medium text-orange-600">Montant</span>
                          <span>{formatSats(rec.suggested_amount)} sats</span>
                        </div>
                      )}
                    </div>

                    {rec.current_value !== undefined && rec.suggested_value !== undefined && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <span className="font-medium">Ajustement suggéré:</span>
                        <span className="ml-2">
                          {rec.current_value} → <span className="text-green-600 font-medium">{rec.suggested_value}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onApplyRecommendation(rec.id || rec.type)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition text-sm"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
};
};

// Fonction utilitaire pour formater les sats
const formatSats = (sats: number): string => {
  return new Intl.NumberFormat('fr-FR').format(sats);
}
