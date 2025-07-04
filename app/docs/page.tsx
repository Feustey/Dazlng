"use client";

import React from 'react';
import Link from 'next/link';

const DocsPage: React.FC = () => {
  const documentationSections = [
    {
      title: "Architecture Technique",
      description: "common.commoncommondtails_techniques_",
      items: [
        { title: "Architecture des nœuds", link: "/docs/architecture/nodes" },
        { title: "API Documentation", link: "/docs/api" },
        { title: "common.scurit", link: "/docs/security" },
        { title: "Performance", link: "/docs/performance" }
      ]
    },
    {
      title: "Intégration",
      description: "common.commonhomeguides_d"intégration et exemples de code",
      items: [
        { title: "Guide de démarrage", link: "/docs/integration/getting-started" },
        { title: "SDK JavaScript", link: "/docs/integration/sdk" },
        { title: "Webhooks", link: "/docs/integration/webhooks" },
        { title: "Exemples de code", link: "/docs/integration/examples" }
      ]
    },
    {
      title: "Monitoring",
      description: "common.commoncommonconfiguration_et_u",
      items: [
        { title: "Configuration des alertes", link: "/docs/monitoring/alerts" },
        { title: "Métriques disponibles", link: "/docs/monitoring/metrics" },
        { title: "Dashboard personnalisé", link: "/docs/monitoring/dashboard" },
        { title: "API de monitoring", link: "/docs/monitoring/api" }
      ]
    },
    {
      title: "Troubleshooting",
      description: "common.commoncommonsolutions_aux_prob",
      items: [
        { title: "Problèmes de connexion", link: "/docs/troubleshooting/connection" },
        { title: "Erreurs de paiement", link: "/docs/troubleshooting/payments" },
        { title: "Performance lente", link: "/docs/troubleshooting/performance" },
        { title: "Support", link: "/docs/troubleshooting/support" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Documentation Technique
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Documentation complète et transparente de notre infrastructure, 
            API et processus techniques.
          </p>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {documentationSections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 mb-6">{section.description}</p>
              
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link 
                      href={item.link}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
                    >
                      <span className="mr-2">📄</span>
                      {item.title}
                      <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* GitHub et Open Source */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🔓 Open Source et Transparence
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('common.code_source')}</h3>
              <p className="text-gray-600 mb-4">
                Une grande partie de notre code est open source et disponible 
                sur GitHub pour audit et contribution.
              </p>
              <div className="space-y-3">
                <a 
                  href="https://github.com/daznode/core"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span className="mr-2">📦</span>
                  DazNode Core
                </a>
                <a 
                  href="https://github.com/daznode/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span className="mr-2">🔌</span>
                  API Documentation
                </a>
                <a 
                  href="https://github.com/daznode/sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span className="mr-2">⚙️</span>
                  SDK JavaScript
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('common.audits_et_scurit')}</h3>
              <p className="text-gray-600 mb-4">
                Nos audits de sécurité et rapports de vulnérabilités 
                sont publics et accessibles.
              </p>
              <div className="space-y-3">
                <a 
                  href="/docs/security/audit-2024"
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span className="mr-2">🔍</span>
                  Audit de Sécurité 2024
                </a>
                <a 
                  href="https://hackerone.com/daznode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span className="mr-2">🐛</span>
                  Programme Bug Bounty
                </a>
                <a 
                  href="/docs/security/vulnerabilities"
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span className="mr-2">⚠️</span>
                  Vulnérabilités connues
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques Publiques */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            📊 Métriques Publiques
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>{t('home.uptime_999')}</div>
                <div>{t('common.latence_moyenne_45ms')}</div>
                <div>{t('common.throughput_12m_txjour')}</div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('common.scurit')}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>{t('common.vulnrabilits_critiques_0')}</div>
                <div>{t('common.bugs_corrigs_23')}</div>
                <div>{t('common.dernier_audit_jan_2024')}</div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('common.communaut')}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>{t('common.contributeurs_47')}</div>
                <div>{t('common.stars_github_12k')}</div>
                <div>{t('home.forks_234')}</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              * Données mises à jour en temps réel. Vérifiables sur nos repositories GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage; 