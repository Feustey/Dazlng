import React from 'react';
import Link from 'next/link';
import { 
  Gauge, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  ArrowRight,
  Brain,
  Zap,
  CheckCircle
} from 'lucide-react';

export const DazFlowShowcase: React.FC = () => {
  const features = [
    {
      icon: <Gauge className="h-6 w-6 text-blue-600" />,
      title: "Capacité de Routage",
      description: "Mesurez votre capacité réelle de routage avec une précision de 99.9%"
    },
    {
      icon: <Target className="h-6 w-6 text-green-600" />,
      title: "Probabilité de Succès",
      description: "Connaissez vos chances de succès pour chaque montant de paiement"
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-red-600" />,
      title: "Détection de Goulots",
      description: "Identifiez automatiquement les problèmes qui limitent vos revenus"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      title: "Optimisation IA",
      description: "Recommandations personnalisées pour maximiser vos revenus"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <Brain className="h-4 w-4 mr-2" />
            Nouveau : DazFlow Index
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Analysez et Optimisez avec{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              DazFlow Index
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            L'intelligence artificielle au service de vos revenus Lightning. 
            Analysez votre nœud, identifiez les goulots d'étranglement et optimisez vos performances.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/user/node"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <Gauge className="h-5 w-5 mr-2" />
              Tester maintenant
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/dazflow"
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              En savoir plus
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">+45%</div>
            <div className="text-gray-600">Revenus moyens</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">Précision analyse</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">2.3x</div>
            <div className="text-gray-600">ROI amélioré</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
}; 