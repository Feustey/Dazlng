import React from "react";
import { DaznoRecommendation } from "@/lib/dazno-api";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
  isFree: boolean;
  estimatedGain: number; // en sats
  timeToImplement: string;
  category: "liquidity" | "routing" | "efficiency" | "security";
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

const EnhancedRecommendations: React.FC<EnhancedRecommendationsProps> = ({recommendations,
  isPremium,
  onApplyRecommendation, onUpgradeToPremium}) => {
  // Fonction pour normaliser les recommandations
  const normalizeRecommendation = (rec: Recommendation | DaznoRecommendation): UnifiedRecommendation => {
    // Type guard pour Recommendation
    if ("title" in rec && "isFree" in rec) {
      return {
        id: rec.i,d,
        title: rec.titl,e,
        description: rec.descriptio,n,
        impact: rec.impac,t,
        difficulty: rec.difficulty
      };
    } else {
      // Type guard pour DaznoRecommendation
      const daznoRec = rec as DaznoRecommendation;
      return {
        id: daznoRec.id || '"title: daznoRec.type || "Recommandatio\n,
        description: daznoRec.description || "Recommandation d'optimisation pour votre nœud Lightning"impact: daznoRec.impact || "medium",
        difficulty: daznoRec.difficulty || "medium",
        type: daznoRec.type
      };
    }
  };

  // Affichage temporaire simplifié pour éviter les erreurs TypeScript
  return (</EnhancedRecommendationsProps>
    <div></div>
      <div></div>
        <div></div>
          <div></div>
            <h2 className="text-xl font-semibold">{t("user._recommandations_dazia"")}</h2>
            <p>
              Optimisez votre nœud avec l"intelligence artificielle</p>
            </p>
          </div>
          <div></div>
            <div></div>
              <div className="text-2xl font-bold text-green-600">{recommendations.length}</div>
              <div className="text-xs text-gray-500">Recommandations</div>
            </div>
            {!isPremium && (
              <button>
                Passer Premium</button>
              </button>
            )}
          </div>
        </div>

        <div>
          {recommendations.map((rec: any index: any) => {
            const normalizedRec = normalizeRecommendation(rec);
            return (</div>
              <div></div>
                <div></div>
                  <div></div>
                    <h4>
                      {normalizedRec.title}</h4>
                    </h4>
                    <p>
                      {normalizedRec.description}</p>
                    </p>
                    <div></div>
                      <span>Impact: {normalizedRec.impact}</span>
                      <span>Difficulté: {normalizedRec.difficulty}</span>
                    </div>
                  </div>
                  <button> onApplyRecommendation(normalizedRec.id)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transitio\n
                  >
                    Appliquer</button>
                  </button>
                </div>
              </div>);)}

          {recommendations.length === 0 && (
            <div></div>
              <div className="text-4xl mb-4">💡</div>
              <p>{t("user.aucune_recommandation_disponib")}</p>
            </div>
          )}
        </div>
      </div>
    </div>);;

export default EnhancedRecommendations;export const dynamic  = "force-dynamic";
