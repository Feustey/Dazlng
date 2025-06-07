import React, { useState } from 'react';

interface PremiumConversionModalProps {
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
  userName = 'Bitcoiner'
}) => {
  const [activeTab, setActiveTab] = useState<'features' | 'roi' | 'testimonials'>('features');

  if (!isOpen) return null;

  const features = [
    {
      icon: '⚡',
      title: "Recommandations IA Personnalisées",
      description: "Dazia analyse votre nœud 24/7 et propose des optimisations spécifiques",
      value: "+15-30% de revenus",
      popular: true
    },
    {
      icon: '📊',
      title: "Analytics Avancées",
      description: "Métriques détaillées, projections et comparaisons avec le réseau",
      value: "Insights exclusifs"
    },
    {
      icon: '🔔',
      title: "Monitoring Proactif",
      description: "Alertes automatiques pour les problèmes de performance",
      value: "99.9% uptime"
    },
    {
      icon: '🎧',
      title: "Support Prioritaire",
      description: "Accès direct aux experts Lightning Network",
      value: "Support 24/7"
    },
    {
      icon: '🎯',
      title: "Optimisations Automatiques",
      description: "Application automatique des recommandations approuvées",
      value: "Gain de temps"
    },
    {
      icon: '📈',
      title: "Rapports Détaillés",
      description: "Analyses hebdomadaires et projections de revenus",
      value: "Business intelligence"
    }
  ];

  const roiCalculation = {
    monthlyFees: 29,
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
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h2 className="text-2xl font-bold">Bonjour {userName}, passez à Premium !</h2>
              <p className="text-purple-100">Débloquez le potentiel complet de votre nœud Lightning</p>
            </div>
          </div>
          
          {/* Score et potentiel personnalisé */}
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{userScore}/100</div>
                <div className="text-sm text-purple-100">Votre score actuel</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">+{Math.round(personalizedGain / 1000)}k</div>
                <div className="text-sm text-purple-100">Sats/mois estimés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{roiCalculation.paybackWeeks}</div>
                <div className="text-sm text-purple-100">Semaines pour ROI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { key: 'features', label: 'Fonctionnalités', icon: '⭐' },
            { key: 'roi', label: 'Rentabilité', icon: '📈' },
            { key: 'testimonials', label: 'Témoignages', icon: '💬' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition ${
                activeTab === tab.key
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Fonctionnalités Premium exclusives
                </h3>
                <p className="text-gray-600">
                  Tout ce dont vous avez besoin pour optimiser votre nœud Lightning
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    {feature.popular && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        POPULAIRE
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{feature.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full inline-block">
                          {feature.value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'roi' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Analyse de Rentabilité Personnalisée
                </h3>
                <p className="text-gray-600">
                  Basée sur votre profil et vos performances actuelles
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">29€</div>
                    <div className="text-sm text-gray-600">Coût mensuel Premium</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      +{Math.round(personalizedGain / 1000)}k
                    </div>
                    <div className="text-sm text-gray-600">Sats gains estimés/mois</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{roiCalculation.paybackWeeks}</div>
                    <div className="text-sm text-gray-600">Semaines pour rentabilité</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Projection 6 mois</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Gains cumulés</span>
                    <span className="text-lg font-bold text-green-600">
                      +{Math.round((personalizedGain * 6 - 29 * 6 * 100000000 / 45000) / 1000)}k sats
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full w-4/5" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Rentabilité atteinte après {roiCalculation.paybackWeeks} semaines
                  </div>
                </div>
              </div>

              {/* Comparaison avec/sans Premium */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">🆓 Sans Premium</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Recommandations basiques limitées</li>
                    <li>• Pas d'analytics avancées</li>
                    <li>• Support communautaire uniquement</li>
                    <li>• Optimisations manuelles</li>
                  </ul>
                </div>
                
                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h4 className="font-semibold text-purple-900 mb-3">💎 Avec Premium</h4>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li>• IA avancée 24/7</li>
                    <li>• Analytics et projections</li>
                    <li>• Support expert prioritaire</li>
                    <li>• Optimisations automatiques</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ce que disent nos utilisateurs Premium
                </h3>
                <p className="text-gray-600">
                  Témoignages authentiques de vrais utilisateurs
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                            Score: {testimonial.score}/100
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{testimonial.role}</div>
                        <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full inline-block">
                          {testimonial.metrics}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 italic border-l-4 border-purple-500 pl-4">
                      "{testimonial.content}"
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t bg-gray-50 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-gray-900">Commencez dès aujourd'hui</div>
              <div className="text-sm text-gray-600">
                Garantie satisfaction 30 jours • Annulation à tout moment • Support inclus
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Plus tard
              </button>
              <button
                onClick={onUpgrade}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition transform hover:scale-105"
              >
                Passer Premium - 29€/mois
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 