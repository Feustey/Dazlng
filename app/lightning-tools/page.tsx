"use client";

import React, { useState } from 'react';
import { Zap, Calculator, Key, BarChart3, Crown } from 'lucide-react';
import { LightningExplorer } from '@/components/lightning/LightningExplorer';
import { LightningCalculator } from '@/components/lightning/LightningCalculator';
import { LightningDecoder } from '@/components/lightning/LightningDecoder';

export default function LightningToolsPage() {
  const [activeTab, setActiveTab] = useState('explorer');

  const tools = [
    {
      id: 'explorer',
      name: 'Explorateur',
      icon: BarChart3,
      description: 'Explorez le réseau Lightning Network',
      component: LightningExplorer,
      free: true
    },
    {
      id: 'calculator',
      name: 'Calculateur',
      icon: Calculator,
      description: 'Convertissez BTC, sats et devises fiat',
      component: LightningCalculator,
      free: true
    },
    {
      id: 'decoder',
      name: 'Décodeur',
      icon: Key,
      description: 'Décodez BOLT11, LNURL et Lightning Address',
      component: LightningDecoder,
      free: true
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Analytics avancées de nœuds',
      component: null,
      free: false,
      comingSoon: true
    }
  ];

  const ActiveComponent = tools.find(tool => tool.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Outils Lightning Network
                </h1>
                <p className="text-gray-600">
                  Suite d'outils gratuits pour explorer et utiliser le Lightning Network
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu latéral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Outils disponibles
              </h2>
              
              <nav className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTab === tool.id;
                  const isDisabled = !tool.free && !tool.comingSoon;
                  
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        if (!isDisabled && !tool.comingSoon) {
                          setActiveTab(tool.id);
                        }
                      }}
                      disabled={isDisabled || tool.comingSoon}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : isDisabled || tool.comingSoon
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tool.name}</span>
                          {!tool.free && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                          {tool.comingSoon && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              Bientôt
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {tool.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Informations sur les fonctionnalités premium */}
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-indigo-900">
                    Fonctionnalités Premium
                  </span>
                </div>
                <p className="text-xs text-indigo-700 mb-3">
                  Débloquez des outils avancés avec un abonnement DazNode
                </p>
                <ul className="text-xs text-indigo-600 space-y-1 mb-3">
                  <li>• Analytics de nœuds avancées</li>
                  <li>• Alertes personnalisées</li>
                  <li>• Historique étendu</li>
                  <li>• API access</li>
                </ul>
                <button className="w-full bg-indigo-600 text-white text-xs py-2 px-3 rounded hover:bg-indigo-700 transition-colors">
                  Découvrir Premium
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {ActiveComponent ? (
              <ActiveComponent />
            ) : (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Fonctionnalité Premium
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Cette fonctionnalité est disponible avec un abonnement DazNode Premium
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Ce que vous obtiendrez :
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Analytics de performance détaillées
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Monitoring en temps réel
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Alertes personnalisées
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Historique étendu (30+ jours)
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      Commencer l'essai gratuit
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Voir les tarifs
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section informative */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pourquoi utiliser nos outils Lightning ?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              DazNode propose la suite d'outils Lightning la plus complète 
              pour les utilisateurs européens, avec une interface en français 
              et une conformité RGPD native.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Rapide et Fiable
              </h3>
              <p className="text-gray-600">
                Outils optimisés pour des performances maximales 
                avec des données en temps réel.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics Avancées
              </h3>
              <p className="text-gray-600">
                Insights détaillés sur le réseau Lightning 
                et la performance de vos nœuds.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sécurisé et Privé
              </h3>
              <p className="text-gray-600">
                Aucune donnée sensible n'est stockée. 
                Conformité RGPD et respect de votre vie privée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 