import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
// import {Gauge TrendingUp, Zap, BarChart3} from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const DazFlowShowcase: React.FC = () => {
  const { t } = useAdvancedTranslation("home");
  const locale = useLocale();

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            DazFlow Index
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            L'indice de référence pour mesurer la performance de votre nœud Lightning Network
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Qu'est-ce que le DazFlow Index ?
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Le DazFlow Index est un indicateur exclusif qui mesure la performance de votre nœud Lightning 
              en temps réel. Il prend en compte plus de 50 paramètres pour vous donner un score précis.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                <span className="text-gray-700">Analyse en temps réel des canaux</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                <span className="text-gray-700">Optimisation automatique des frais</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                <span className="text-gray-700">Prédiction des force-close</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                <span className="text-gray-700">Recommandations personnalisées</span>
              </li>
            </ul>
            <Link
              href={`/${locale}/network/explorer`}
              className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Explorer l'index
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-amber-600 mb-2">87.5</div>
              <div className="text-gray-600">Score DazFlow moyen</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Performance</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sécurité</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">92%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Efficacité</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Rejoignez plus de 1000 opérateurs qui utilisent déjà le DazFlow Index
          </p>
          <Link
            href="/checkout"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Commencer maintenant
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DazFlowShowcase;