import React, { useState } from 'react';
import { X, Star, Zap, TrendingUp, Shield, Headphones } from 'lucide-react';

interface ConversionCenterPremiumProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  userScore: number;
  hasNode: boolean;
  estimatedSavings?: number;
}

export const ConversionCenterPremium: React.FC<ConversionCenterPremiumProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  userScore,
  hasNode,
  estimatedSavings = 50000
}) => {
  const [activeTab, setActiveTab] = useState<'features' | 'roi' | 'testimonials'>('features');

  if (!isOpen) return null;

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Recommandations IA Personnalisées",
      description: "Dazia analyse votre nœud 24/7 et propose des optimisations spécifiques",
      value: "+15-30% de revenus"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: "Analytics Avancées",
      description: "Métriques détaillées, projections et comparaisons avec le réseau",
      value: "Insights exclusifs"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Monitoring Proactif",
      description: "Alertes automatiques pour les problèmes de performance",
      value: "99.9% uptime"
    },
    {
      icon: <Headphones className="w-6 h-6 text-purple-500" />,
      title: "Support Prioritaire",
      description: "Accès direct aux experts Lightning Network",
      value: "Support 24/7"
    }
  ];

  const roiCalculation = {
    monthlyFees: hasNode ? Math.max(Math.round(estimatedSavings * 0.1 / 30), 1000) : 5000,
    monthlySavings: estimatedSavings,
    paybackMonths: Math.ceil(29000 / Math.max(estimatedSavings, 1000))
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h2 className="text-2xl font-bold">Passez à Premium</h2>
              <p className="text-purple-100">Débloquez le potentiel complet de votre nœud Lightning</p>
            </div>
          </div>
          
          {/* Score utilisateur */}
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Votre score actuel: {userScore}/100</span>
              <span className="text-sm">Score Premium moyen: 85/100</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-2">
              <div 
                className="bg-white h-2 rounded-full"
                style={{ width: `${userScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { key: 'features', label: 'Fonctionnalités', icon: <Star className="w-4 h-4" /> },
            { key: 'roi', label: 'Rentabilité', icon: <TrendingUp className="w-4 h-4" /> },
            { key: 'testimonials', label: 'Témoignages', icon: <Shield className="w-4 h-4" /> }
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
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      {feature.icon}
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
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Analyse de Rentabilité Personnalisée</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">29 000 sats</div>
                    <div className="text-sm text-gray-600">Coût mensuel Premium</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.round(roiCalculation.monthlySavings / 1000)}k sats
                    </div>
                    <div className="text-sm text-gray-600">Gains estimés/mois</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{roiCalculation.paybackMonths}</div>
                    <div className="text-sm text-gray-600">Mois pour rentabilité</div>
                  </div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Projection 6 mois</span>
                    <span className="text-sm text-green-600 font-bold">
                      +{Math.round((roiCalculation.monthlySavings * 6 - 29000 * 6) / 1000)}k sats
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Thomas K.",
                    role: "Opérateur de nœud depuis 2 ans",
                    avatar: "👨‍💻",
                    content: "Dazia a augmenté mes revenus de 40% en optimisant automatiquement mes canaux. L'investissement s'est rentabilisé en 3 semaines.",
                    metrics: "+127k sats/mois"
                  },
                  {
                    name: "Sarah M.",
                    role: "Lightning entrepreneur",
                    avatar: "👩‍💼",
                    content: "Les alertes proactives m'ont évité plusieurs problèmes coûteux. Le support est exceptionnel, vraiment des experts.",
                    metrics: "99.8% uptime"
                  },
                  {
                    name: "Jean-Pierre R.",
                    role: "Bitcoiner passionné",
                    avatar: "🧔",
                    content: "Interface intuitive et recommandations précises. Je comprends enfin comment optimiser mon nœud efficacement.",
                    metrics: "+85% performance"
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                      <div className="ml-auto bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                        {testimonial.metrics}
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.content}"</p>
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
              <div className="text-sm text-gray-600">Garantie satisfaction 30 jours • Annulation à tout moment</div>
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
                Passer Premium - 29 000 sats/mois
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 