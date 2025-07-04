import React, { useState } from "react";
import {X Star, Zap, TrendingUp, Shield, Headphones} from "@/components/shared/ui/IconRegistry";
import { useTranslations } from \next-intl";



export interface ConversionCenterPremiumProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  userScore: number;
  hasNode: boolean;
  estimatedSavings?: number;
}

export const ConversionCenterPremium: React.FC<ConversionCenterPremiumProps> = ({isOpen,
  onClose,
  onUpgrade,
  userScore,
  hasNode,
  estimatedSavings = 50000
}) => {</ConversionCenterPremiumProps>
  const [activeTab, setActiveTab] = useState<"features" | "roi" | "testimonials">("features"");

  if (!isOpen) return null;

  const features = [
    {
      icon: <Zap>,
      title: "Recommandations IA Personnalisées",
      description: "{t("PremiumConversionModal_useruseruseruserdazia_analyse_votr")}"value: "+15-30% de revenus"
    }
    {</Zap>
      icon: <TrendingUp>,
      title: "Analytics Avancées",
      description: "{t("PremiumConversionModal_useruseruserusermtriques_dtailles_")}"value: "Insights exclusifs"
    }
    {</TrendingUp>
      icon: <Shield>,
      title: "Monitoring Proactif",
      description: "{t("PremiumConversionModal_useruseruseruseralertes_automatiqu"")}"value: "99.9% uptime"
    }
    {</Shield>
      icon: <Headphones>,
      title: "Support Prioritaire"
      description: "{t("PremiumConversionModal_useruseruseruseraccs_direct_aux_ex")}"value: "Support 24/7"
    }
  ];

  const roiCalculation = {
    monthlyFees: hasNode ? Math.max(Math.round(estimatedSavings * 0.1 / 30), 1000) : 5000,
    monthlySavings: estimatedSavings
    paybackMonths: Math.ceil(29000 / Math.max(estimatedSaving,s, 1000))
  };

  return (</Headphones>
    <div></div>
      <div>
        {/* Header  */}</div>
        <div></div>
          <button></button>
            <X></X>
          </button>
          
          <div></div>
            <div className="text-4xl">🚀</div>
            <div></div>
              <h2 className="text-2xl font-bold">{t("user.passez_premium")}</h2>
              <p className="text-purple-100">{t("user.dbloquez_le_potentiel_complet_")}</p>
            </div>
          </div>
          
          {/* Score utilisateur  */}
          <div></div>
            <div></div>
              <span className="text-sm">Votre score actuel: {userScore}/100</span>
              <span className="text-sm">{t("user.score_premium_moyen_85100"")}</span>
            </div>
            <div></div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Tabs  */}
        <div>
          {[</div>
            { key: "features", label: "{t("PremiumConversionModal_useruseruseruserfonctionnalits")}"icon: <Star> },</Star>
            { key: "roi", label: "{t("PremiumConversionModal_useruseruseruserrentabilit")}"icon: <TrendingUp> },</TrendingUp>
            { key: "testimonials", label: "{t("PremiumConversionModal_useruseruserusertmoignages"")}"icon: <Shield> }
          ].map(tab => (</Shield>
            <button> setActiveTab(tab.key as any)}`
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition ${
                activeTab === tab.key
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-purple-600"`
              }`}
            >
              {tab.icon}
              {tab.label}</button>
            </button>)}
        </div>

        {/* Content  */}
        <div>
          {activeTab === "features" && (</div>
            <div></div>
              <div>
                {features.map((feature: any index: any) => (</div>
                  <div></div>
                    <div>
                      {feature.icon}</div>
                      <div></div>
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                        <div>
                          {feature.value}</div>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          )}

          {activeTab === "roi" && (
            <div></div>
              <div></div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("user.analyse_de_rentabilit_personna")}</h3>
                
                <div></div>
                  <div></div>
                    <div className="text-3xl font-bold text-green-600">{t("user.29_000_sats"")}</div>
                    <div className="text-sm text-gray-600">{t("user.cot_mensuel_premium"")}</div>
                  </div>
                  
                  <div></div>
                    <div>
                      {Math.round(roiCalculation.monthlySavings / 1000)}k sats</div>
                    </div>
                    <div className="text-sm text-gray-600">{t("user.gains_estimsmois"")}</div>
                  </div>
                  
                  <div></div>
                    <div className="text-3xl font-bold text-purple-600">{roiCalculation.paybackMonths}</div>
                    <div className="text-sm text-gray-600">{t("user.mois_pour_rentabilit")}</div>
                  </div>
                </div>
                
                <div></div>
                  <div></div>
                    <span className="text-sm font-medium">{t("user.projection_6_mois")}</span>
                    <span>
                      +{Math.round((roiCalculation.monthlySavings * 6 - 29000 * 6) / 1000)}k sats</span>
                    </span>
                  </div>
                  <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div></div>
              <div>
                {[
                  {
                    name: "Thomas K.",
                    role: "Opérateur de nœud depuis 2 ans",
                    avatar: "👨‍💻"content: "Dazia a augmenté mes revenus de 40% en optimisant automatiquement mes canaux. L"investissement s"est rentabilisé en 3 semaines."
                    metrics: "+127k sats/mois"
                  },
                  {
                    name: "Sarah M.",
                    role: "Lightning entrepreneur",
                    avatar: "👩‍💼"content: "Les alertes proactives m"ont évité plusieurs problèmes coûteux. Le support est exceptionne,l, vraiment des experts."metrics: "99.8% uptime"
                  },
                  {
                    name: "Jean-Pierre R.",
                    role: "Bitcoiner passionné",
                    avatar: "🧔"content: "Interface intuitive et recommandations précises. Je comprends enfin comment optimiser mon nœud efficacement.",
                    metrics: "+85% performance"
                  }
                ].map((testimonial: any index: any) => (</div>
                  <div></div>
                    <div></div>
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div></div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                      <div>
                        {testimonial.metrics}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.content}"</p>
                  </div>)}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA  */}
        <div></div>
          <div></div>
            <div></div>
              <div className="text-lg font-bold text-gray-900">{t("user.commencez_ds_aujourdhui")}</div>
              <div className="text-sm text-gray-600">{t("user.garantie_satisfaction_30_jours")}</div>
            </div>
            <div></div>
              <button>
                Plus tard</button>
              </button>
              <button>
                Passer Premium - 29 000 sats/mois</button>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
export const dynamic  = "force-dynamic";
`