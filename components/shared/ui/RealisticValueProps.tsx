"use client";

import React from 'react';

const RealisticValueProps: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ce que DazNode fait vraiment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des fonctionnalités concrètes et mesurables, sans promesses irréalistes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Monitoring Avancé */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Monitoring Avancé</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Surveillance en temps réel de votre nœud avec alertes personnalisables 
              et métriques détaillées de performance.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Uptime et connectivité</li>
              <li>• Métriques de routage</li>
              <li>• Alertes configurables</li>
              <li>• Historique des performances</li>
            </ul>
          </div>

          {/* Optimisation Basée sur les Données */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Optimisation Basée sur les Données</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Recommandations personnalisées basées sur l'analyse de vos données 
              et des patterns observés sur le réseau Lightning.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Analyse des frais de routage</li>
              <li>• Suggestions d'optimisation</li>
              <li>• Comparaison avec le réseau</li>
              <li>• Suivi des améliorations</li>
            </ul>
          </div>

          {/* Support Technique */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Support Technique</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Assistance technique spécialisée Lightning Network avec réponse 
              garantie sous 24h pour les utilisateurs premium.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Support par email et chat</li>
              <li>• Documentation détaillée</li>
              <li>• Guides pas à pas</li>
              <li>• Communauté active</li>
            </ul>
          </div>

          {/* Sécurité Renforcée */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Sécurité Renforcée</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Bonnes pratiques de sécurité et monitoring des menaces 
              pour protéger vos fonds et votre infrastructure.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Audit de sécurité régulier</li>
              <li>• Détection d'anomalies</li>
              <li>• Sauvegardes automatiques</li>
              <li>• Chiffrement des données</li>
            </ul>
          </div>

          {/* Analytics Détaillées */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Analytics Détaillées</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Tableaux de bord complets avec métriques de revenus, 
              performance et tendances pour optimiser votre stratégie.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Revenus de routage</li>
              <li>• Performance des canaux</li>
              <li>• Tendances du réseau</li>
              <li>• Rapports exportables</li>
            </ul>
          </div>

          {/* Intégration Facile */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🔌</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Intégration Facile</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Connexion simple de votre nœud existant en quelques minutes 
              sans interruption de service.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Support LND et Core Lightning</li>
              <li>• Configuration automatique</li>
              <li>• Pas d'interruption</li>
              <li>• Migration transparente</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🎯 Ce que nous ne promettons PAS
          </h3>
          <p className="text-gray-600 text-sm">
            Nous ne garantissons pas de rendements spécifiques, de prédictions infaillibles 
            ou de résultats miraculeux. Lightning Network reste un écosystème complexe 
            où les performances varient selon de nombreux facteurs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RealisticValueProps; 