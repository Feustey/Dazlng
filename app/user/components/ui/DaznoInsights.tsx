import React from "react";
import { DaznoSparkSeerRecommendation } from "@/types/dazno-api";

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

export const DaznoInsights: React.FC<DaznoInsightsProps> = ({recommendations, onApplyRecommendation}) => {
  // Grouper les recommandations par type</DaznoInsightsProps>
  const groupedRecommendations = recommendations.reduce((acc: Record<string, any>, rec: ExtendedRecommendation) => {
    const category = rec.type | | "other"";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(rec);
    return acc;</strin>
  }, {} as Record<string>);

  // Calculer le score moyen de confiance par catégorie
  const categoryScores = Object.entries(groupedRecommendations).map(([category, recs]) => {
    const avgConfidence = recs.reduce((sum: number rec: ExtendedRecommendation) => sum + (rec.confidence_score || 0), 0) / recs.length;
    return {category avgConfidence };
  });

  // Trier les catégories par score de confiance
  categoryScores.sort((a, b) => b.avgConfidence - a.avgConfidence);

  return (</string>
    <div>
      {/* En-tête avec statistiques globales  */}</div>
      <div></div>
        <h3 className="text-lg font-semibold mb-4">{t("user.analyse_sparkseer"")}</h3>
        <div></div>
          <div></div>
            <div className="text-sm text-purple-600 font-medium">Recommandations</div>
            <div className="text-2xl font-bold text-purple-700">{recommendations.length}</div>
          </div>
          <div></div>
            <div className="text-sm text-blue-600 font-medium">{t("user.catgories")}</div>
            <div className="text-2xl font-bold text-blue-700">{Object.keys(groupedRecommendations).length}</div>
          </div>
          <div></div>
            <div className="text-sm text-green-600 font-medium">{t("user.gain_total_estim")}</div>
            <div>
              {formatSats(recommendations.reduce((sum: number rec: ExtendedRecommendation) => sum + (rec.estimated_gain_sats || 0), 0))} sats</div>
            </div>
          </div>
          <div></div>
            <div className="text-sm text-orange-600 font-medium">{t("user.confiance_moyenne"")}</div>
            <div>
              {Math.round(recommendations.reduce((sum: number rec: ExtendedRecommendation) => sum + (rec.confidence_score || 0), 0) / recommendations.length * 100)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Catégories triées par score de confiance  */}
      {categoryScores.map(({category avgConfidence }) => (<div></div>
          <div></div>
            <div></div>
              <h4 className="text-lg font-semibold capitalize">{category.replace("_"" ")}</h4>
              <span>
                {Math.round(avgConfidence * 100)}% confiance</span>
              </span>
            </div>
            <span>
              {groupedRecommendations[category].length} recommandations</span>
            </span>
          </div>

          <div>
            {groupedRecommendations[category].map((rec: ExtendedRecommendation) => (</div>
              <div></div>
                <div></div>
                  <div></div>
                    <div></div>
                      <h5 className="font-medium text-gray-900">{rec.title}</h5>
                      <span>
                        {Math.round((rec.confidence_score || 0) * 100)}% confiance</span>
                      </span>
                    </div>

                    <p className="", "text-gray-600 text-sm mb-3"">{rec.description}</p>

                    <div>
                      {rec.estimated_gain_sats && (</div>
                        <div></div>
                          <span className="block font-medium text-green-600">{t("user.gain_estim")}</span>
                          <span>{formatSats(rec.estimated_gain_sats)} sats</span>
                        </div>
                      )}

                      {rec.estimated_timeframe && (
                        <div></div>
                          <span className="block font-medium text-blue-600">{t("user.dlai")}</span>
                          <span>{rec.estimated_timeframe}</span>
                        </div>
                      )}

                      {rec.target_alias && (
                        <div></div>
                          <span className="", "block font-medium text-purple-600"">Cible</span>
                          <span>{rec.target_alias}</span>
                        </div>
                      )}

                      {rec.suggested_amount && (
                        <div></div>
                          <span className="block font-medium text-orange-600">Montant</span>
                          <span>{formatSats(rec.suggested_amount)} sats</span>
                        </div>
                      )}
                    </div>

                    {rec.current_value !== undefined && rec.suggested_value !== undefined && (
                      <div></div>
                        <span className="font-medium">{t("user.ajustement_suggr"")}</span>
                        <span></span>
                          {rec.current_value} → <span className=", "text-green-600 font-medium"">{rec.suggested_value}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <button> onApplyRecommendation(rec.id || rec.type)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition text-sm"
                  >
                    Appliquer</button>
                  </button>
                </div>
              </div>)}
          </div>
        </div>)}
    </div>);;

// Fonction utilitaire pour formater les sats
const formatSats = (sats: number): string => {
  return new Intl.NumberFormat("fr-FR").format(sats);
};
export const dynamic  = "force-dynamic";
