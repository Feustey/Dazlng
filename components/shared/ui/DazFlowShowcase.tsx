import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Gauge, TrendingUp, Zap, BarChart3 } from 'lucide-react';

const DazFlowShowcase: React.FC = () => {
  const locale = useLocale();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-6">
            <Gauge className="h-4 w-4 mr-2" />
            Nouveau : DazFlow Index
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            L'Index qui Révolutionne le{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Lightning Network
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DazFlow Index combine IA avancée et données temps réel pour optimiser vos performances de nœud Lightning avec une précision inégalée.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Analyse Prédictive</h3>
            <p className="text-gray-600 mb-4">
              Notre IA analyse les patterns de trafic pour prédire les opportunités de routing optimales.
            </p>
            <div className="text-2xl font-bold text-blue-600">+45%</div>
            <div className="text-sm text-gray-500">Amélioration des revenus</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Optimisation Temps Réel</h3>
            <p className="text-gray-600 mb-4">
              Ajustement automatique des paramètres de frais et de liquidité pour maximiser les profits.
            </p>
            <div className="text-2xl font-bold text-purple-600">99.9%</div>
            <div className="text-sm text-gray-500">Précision d'analyse</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Métriques Avancées</h3>
            <p className="text-gray-600 mb-4">
              Tableaux de bord détaillés avec métriques de performance et alertes intelligentes.
            </p>
            <div className="text-2xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-gray-500">Monitoring continu</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Prêt à Optimiser vos Revenus ?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez les centaines de node runners qui utilisent déjà DazFlow Index
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/user/node"
                locale={locale}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Gauge className="h-5 w-5 mr-2" />
                Tester Gratuitement
                <svg className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/dazflow"
                locale={locale}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                En Savoir Plus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DazFlowShowcase; 