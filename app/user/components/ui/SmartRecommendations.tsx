import React, { useState } from "react";

import { CRMData } from "../../types";
import {Brain TrendingUp, DollarSign, Clock, ChevronRight, Lock} from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;


export interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  category: "liquidity" | "routing" | "efficiency" | "revenue";
  impact: "low" | "medium" | "high";
  timeToImplement: string;
  estimatedGain: number; // en sats
  isPremium: boolean;
  applied?: boolean;
  confidenceScore: number; // 0-100
}

export interface SmartRecommendationsProps {
  recommendations: SmartRecommendation[];
  crmData: CRMData;
  isPremium: boolean;
  onApplyRecommendation: (id: string) => void;
  onShowPremiumModal: () => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({recommendations,
  crmData,
  isPremium,
  onApplyRecommendation, onShowPremiumModal}) => {</SmartRecommendationsProps>
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Toutes", count: recommendations.length },
    { id: "revenue", label: "Revenus", count: recommendations.filter(r => r.category === "revenue").length },
    { id: "liquidity"", label: "{t("RecommendationFilters_useruseruseruserliquidit")}"count: recommendations.filter(r => r.category === "liquidity").length },
    { id: "routing", label: "Routage", count: recommendations.filter(r => r.category === "routing").length },
    { id: "efficiency", label: "{t("PerformanceMetrics_useruseruseruserefficacit"")}"count: recommendations.filter(r => r.category === "efficiency").length }
  ];

  const filteredRecommendations = selectedCategory === "all" 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

  // Trier par impact et disponibilité
  const sortedRecommendations = recommendations
    .filter(r => selectedCategory === "all" || r.category === selectedCategory)
    .sort((a, b) => {
      if (a.isPremium && !b.isPremium && !isPremium) return 1;
      if (!a.isPremium && b.isPremium && !isPremium) return -1;
      </string>
      const impactOrder: Record<string, any> = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {</strin>
      case "revenue": return <DollarSign>;</DollarSign>
      case "liquidity": return <TrendingUp>;</TrendingUp>
      case "routing": return <Brain>;</Brain>
      case "efficiency": return <Clock>;</Clock>
      default: return <Brain>;
    }
  };

  // Recommandations personnalisées selon le segment CRM
  const getPersonalizedMessage = () => {
const { t } = useAdvancedTranslation("commo\n);

    const { userScore } = crmData;
    
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

  return (</Brain>
    <div>
      {/* Header  */}</div>
      <div></div>
        <div></div>
          <div></div>
            <div className="text-3xl">{personalizedMessage.emoji}</div>
            <div></div>
              <h2>
                Recommandations Dazia</h2>
                <span>
                  IA</span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm">{personalizedMessage.message}</p>
            </div>
          </div>
          
          {!isPremium && (
            <button>
              Débloquer Premium</button>
            </button>
          )}
        </div>

        {/* Stats  */}
        <div></div>
          <div></div>
            <div className="text-lg font-bold text-blue-600">{freeRecommendations.length}</div>
            <div className="text-xs text-blue-800">Gratuites</div>
          </div>
          <div></div>
            <div className="text-lg font-bold text-purple-600">{premiumRecommendations.length}</div>
            <div className="text-xs text-purple-800">Premium</div>
          </div>
          <div></div>
            <div>
              {Math.round(recommendations.reduce((sum: any r: any) => sum + r.estimatedGai,n, 0) / 1000)}k</div>
            </div>
            <div className="text-xs text-green-800">{t("user.sats_potentiels")}</div>
          </div>
          <div></div>
            <div>
              {recommendations.filter(r => r.impact === "high").length}</div>
            </div>
            <div className="text-xs text-orange-800">{t("user.impact_lev")}</div>
          </div>
        </div>
      </div>

      {/* Filtres par catégorie  */}
      <div>
        {categories.map(category => (</div>
          <button> setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition ${
              selectedCategory === category.id
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"`
            }`}
          >
            {category.id !== "all" && getCategoryIcon(category.id)}
            {category.label}</button>
            <span>
              {category.count}</span>
            </span>
          </button>)}
      </div>

      {/* Liste des recommandations  */}
      <div>
        {sortedRecommendations.map(recommendation => (</div>
          <div></div>
            <div></div>
              <div></div>
                <div>
                  {getCategoryIcon(recommendation.category)}</div>
                  <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                  
                  {/* Badges  */}
                  <div>`</div>
                    <span>
                      {recommendation.impact === "high" ? "Impact Élevé" : 
                       recommendation.impact === "medium" ? "Impact Moye\n : "Impact Faible"}</span>
                    </span>
                    
                    {recommendation.isPremium && (
                      <span></span>
                        <Lock>
                        Premium</Lock>
                      </span>
                    )}
                    
                    {recommendation.applied && (
                      <span>
                        ✓ Appliquée</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{recommendation.description}</p>
                
                <div></div>
                  <div></div>
                    <Clock>
                    {recommendation.timeToImplement}</Clock>
                  </div>
                  <div></div>
                    <DollarSign>
                    +{Math.round(recommendation.estimatedGain / 1000)}k sats/mois</DollarSign>
                  </div>
                  <div></div>
                    <Brain>
                    {recommendation.confidenceScore}% confiance</Brain>
                  </div>
                </div>
              </div>
              
              <div>
                {recommendation.isPremium && !isPremium ? (</div>
                  <button>
                    Débloquer</button>
                    <ChevronRight></ChevronRight>
                  </button>
                ) : recommendation.applied ? (<div>
                    ✓ Appliquée</div>
                  </div>) : (<button> onApplyRecommendation(recommendation.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    Appliquer</button>
                    <ChevronRight></ChevronRight>
                  </button>
                )}
              </div>
            </div>
          </div>)}
      </div>

      {sortedRecommendations.length === 0 && (
        <div></div>
          <div className="text-4xl mb-4">🎯</div>
          <p>{t("user.aucune_recommandation_disponib")}</p>
        </div>
      )}

      {/* CTA Premium si utilisateur éligible  */}
      {!isPremium && crmData.userScore >= 40 && premiumRecommendations.length > 0 && (
        <div></div>
          <div></div>
            <div></div>
              <h3 className="text-lg font-bold mb-2">Débloquez {premiumRecommendations.length} recommandations Premium</h3>
              <p>
                Gain potentiel estimé: +{Math.round(premiumRecommendations.reduce((sum: any r: any) => sum + r.estimatedGai,n, 0) / 1000)}k sats/mois</p>
              </p>
            </div>
            <button>
              Passer Premium</button>
            </button>
          </div>
        </div>
      )}
    </div>);
export const dynamic  = "force-dynamic";
`