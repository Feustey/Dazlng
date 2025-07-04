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
              <h3 className="text-xl font-bold text-gray-900">{t('RealisticValueProps.monitoring_avanc')}</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Surveillance en temps réel de votre nœud avec alertes personnalisables 
              et métriques détaillées de performance.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>{t('RealisticValueProps._uptime_et_connectivit')}</li>
              <li>{t('RealisticValueProps._mtriques_de_routage')}</li>
              <li>{t('RealisticValueProps._alertes_configurables')}</li>
              <li>{t('RealisticValueProps._historique_des_performances')}</li>
            </ul>
          </div>

          {/* Optimisation Basée sur les Données */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('RealisticValueProps.optimisation_base_sur_les_donn')}</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Recommandations personnalisées basées sur l'analyse de vos données 
              et des patterns observés sur le réseau Lightning.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>{t('RealisticValueProps._analyse_des_frais_de_routage')}</li>
              <li>{t('RealisticValueProps._suggestions_doptimisation')}</li>
              <li>{t('RealisticValueProps._comparaison_avec_le_rseau')}</li>
              <li>{t('RealisticValueProps._suivi_des_amliorations')}</li>
            </ul>
          </div>

          {/* Support Technique */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('RealisticValueProps.support_technique')}</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Assistance technique spécialisée Lightning Network avec réponse 
              garantie sous 24h pour les utilisateurs premium.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>{t('RealisticValueProps._support_par_email_et_chat')}</li>
              <li>{t('RealisticValueProps._documentation_dtaille')}</li>
              <li>{t('RealisticValueProps._guides_pas_pas')}</li>
              <li>{t('RealisticValueProps._communaut_active')}</li>
            </ul>
          </div>

          {/* Sécurité Renforcée */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('RealisticValueProps.scurit_renforce')}</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Bonnes pratiques de sécurité et monitoring des menaces 
              pour protéger vos fonds et votre infrastructure.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>{t('RealisticValueProps._audit_de_scurit_rgulier')}</li>
              <li>{t('RealisticValueProps._dtection_danomalies')}</li>
              <li>{t('RealisticValueProps._sauvegardes_automatiques')}</li>
              <li>{t('RealisticValueProps._chiffrement_des_donnes')}</li>
            </ul>
          </div>

          {/* Analytics Détaillées */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('RealisticValueProps.analytics_dtailles')}</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Tableaux de bord complets avec métriques de revenus, 
              performance et tendances pour optimiser votre stratégie.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>{t('RealisticValueProps._revenus_de_routage')}</li>
              <li>{t('RealisticValueProps._performance_des_canaux')}</li>
              <li>{t('RealisticValueProps._tendances_du_rseau')}</li>
              <li>{t('RealisticValueProps._rapports_exportables')}</li>
            </ul>
          </div>

          {/* Intégration Facile */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🔌</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('RealisticValueProps.intgration_facile')}</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Connexion simple de votre nœud existant en quelques minutes 
              sans interruption de service.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>{t('RealisticValueProps._support_lnd_et_core_lightning')}</li>
              <li>{t('RealisticValueProps._configuration_automatique')}</li>
              <li>{t('RealisticValueProps._pas_dinterruption')}</li>
              <li>{t('RealisticValueProps._migration_transparente')}</li>
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