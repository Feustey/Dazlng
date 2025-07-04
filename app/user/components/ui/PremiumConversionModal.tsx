import React, { useState } from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export interface PremiumConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  userScore: number;
  hasNode: boolean;
  estimatedSavings?: number;
  userName?: string;
}

export const PremiumConversionModal: React.FC<PremiumConversionModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  userScore,
  hasNode,
  estimatedSavings = 50000,
  userName = "Bitcoiner"
}) => {
  const [activeTab, setActiveTab] = useState<"features" | "roi" | "testimonials">("features");
  const { t } = useAdvancedTranslation("common");

  if (!isOpen) return null;

  const features = [
    {
      icon: "⚡",
      title: "Recommandations IA Personnalisées",
      description: "Dazia analyse votre nœud et propose des optimisations automatiques",
      value: "+15-30% de revenus",
      popular: true
    },
    {
      icon: "📊",
      title: "Analytics Avancées",
      description: "Métriques détaillées et insights exclusifs sur vos performances",
      value: "Insights exclusifs"
    },
    {
      icon: "🔔",
      title: "Monitoring Proactif",
      description: "Alertes automatiques et détection précoce des problèmes",
      value: "99.9% uptime"
    },
    {
      icon: "🎧",
      title: "Support Prioritaire",
      description: "Accès direct aux experts Lightning 24/7",
      value: "Support 24/7"
    },
    {
      icon: "🎯",
      title: "Optimisations Automatiques",
      description: "Application automatique des meilleures pratiques",
      value: "Gain de temps"
    },
    {
      icon: "📈",
      title: "Rapports Détaillés",
      description: "Analyses hebdomadaires et recommandations personnalisées",
      value: "Business intelligence"
    }
  ];

  const roiCalculation = {
    monthlyFees: 2.9,
    monthlySavings: estimatedSavings,
    paybackWeeks: Math.ceil((29 * 100000000) / estimatedSavings * 4) // en semaines
  };

  const testimonials = [
    {
      name: "Thomas K.",
      role: "Opérateur de nœud depuis 2 ans",
      avatar: "👨‍💻",
      content: "Dazia a augmenté mes revenus de 40% en optimisant automatiquement mes canaux. L'investissement s'est rentabilisé en 3 semaines.",
      metrics: "+127k sats/mois",
      score: 89
    },
    {
      name: "Sarah M.",
      role: "Lightning entrepreneur",
      avatar: "👩‍💼",
      content: "Les alertes proactives m'ont évité plusieurs problèmes coûteux. Le support est exceptionnel, vraiment des experts.",
      metrics: "99.8% uptime",
      score: 92
    },
    {
      name: "Jean-Pierre R.",
      role: "Bitcoiner passionné",
      avatar: "🧔",
      content: "Interface intuitive et recommandations précises. Je comprends enfin comment optimiser mon nœud efficacement.",
      metrics: "+85% performance",
      score: 76
    }
  ];

  const getPersonalizedROI = () => {
    const baseGain = 50000; // 50k sats de base
    const scoreMultiplier = userScore / 50; // Multiplier basé sur le score
    const nodeMultiplier = hasNode ? 1.5 : 1; // Bonus si nœud connecté
    
    return Math.round(baseGain * scoreMultiplier * nodeMultiplier);
  };

  const personalizedGain = getPersonalizedROI();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🚀</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Bonjour {userName}, passez à Premium !</h2>
              <p className="text-purple-100">Débloquez le potentiel complet de votre nœud Lightning</p>
            </div>
          </div>
          
          {/* Score et potentiel personnalisé */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{userScore}/100</div>
              <div className="text-sm text-purple-100">Votre score actuel</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">+{Math.round(personalizedGain / 1000)}k</div>
              <div className="text-sm text-purple-100">sats/mois estimés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{roiCalculation.paybackWeeks}</div>
              <div className="text-sm text-purple-100">semaines pour ROI</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { key: "features", label: "Fonctionnalités", icon: "⭐" },
            { key: "roi", label: "Rentabilité", icon: "📈" },
            { key: "testimonials", label: "Témoignages", icon: "💬" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition ${
                activeTab === tab.key
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "features" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Fonctionnalités Premium exclusives
                </h3>
                <p className="text-gray-600">
                  Tout ce dont vous avez besoin pour optimiser votre nœud Lightning
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      feature.popular 
                        ? "border-purple-200 bg-purple-50" 
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {feature.popular && (
                      <div className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded-full mb-2">
                        POPULAIRE
                      </div>
                    )}
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{feature.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                        <div className="text-sm font-medium text-purple-600">
                          {feature.value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "roi" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Analyse de Rentabilité Personnalisée
                </h3>
                <p className="text-gray-600">
                  Basée sur votre profil et vos performances actuelles
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">29 000 sats</div>
                  <div className="text-sm text-gray-600">Coût mensuel Premium</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">+{Math.round(personalizedGain / 1000)}k sats</div>
                  <div className="text-sm text-gray-600">Gain mensuel estimé</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{roiCalculation.paybackWeeks} semaines</div>
                  <div className="text-sm text-gray-600">Temps de retour sur investissement</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Calcul personnalisé</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Gain de base (50k sats)</span>
                    <span>50,000 sats</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multiplicateur score ({userScore}/50)</span>
                    <span>× {(userScore / 50).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonus nœud connecté</span>
                    <span>{hasNode ? "× 1.5" : "× 1.0"}</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between font-semibold">
                    <span>Gain mensuel estimé</span>
                    <span>+{Math.round(personalizedGain / 1000)}k sats</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Témoignages d'utilisateurs Premium
                </h3>
                <p className="text-gray-600">
                  Découvrez comment Dazia transforme leurs nœuds Lightning
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                      <div className="ml-auto text-sm font-medium text-yellow-600">
                        {testimonial.score}/100
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{testimonial.content}</p>
                    <div className="text-sm font-medium text-green-600">
                      {testimonial.metrics}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="text-lg font-bold text-gray-900">
                Prêt à optimiser votre nœud ?
              </div>
              <div className="text-sm text-gray-600">
                Rejoignez les {Math.floor(Math.random() * 1000) + 500} utilisateurs Premium
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Plus tard
              </button>
              <button
                onClick={onUpgrade}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                Passer Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumConversionModal;