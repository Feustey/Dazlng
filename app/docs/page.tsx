"use client";

import React from "react";
import Link from "next/link";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const DocsPage: React.FC = () => {
  const { t } = useAdvancedTranslation("docs");

  const documentationSections = [
    {
      title: "Architecture Technique",
      description: t("page.details_tech"),
      items: [
        { title: "Architecture des nœuds", link: "/docs/architecture/nodes" },
        { title: "API Documentation", link: "/docs/api" },
        { title: "Sécurité", link: "/docs/security" },
        { title: "Performance", link: "/docs/performance" }
      ]
    },
    {
      title: "Intégration",
      description: t("page.guides_d"),
      items: [
        { title: "Guide de démarrage", link: "/docs/integration/getting-started" },
        { title: "SDK JavaScript", link: "/docs/integration/sdk" },
        { title: "Webhooks", link: "/docs/integration/webhooks" },
        { title: "Exemples de code", link: "/docs/integration/examples" }
      ]
    },
    {
      title: "Monitoring",
      description: t("page.configuration"),
      items: [
        { title: "Configuration des alertes", link: "/docs/monitoring/alerts" },
        { title: "Métriques disponibles", link: "/docs/monitoring/metrics" },
        { title: "Dashboard personnalisé", link: "/docs/monitoring/dashboard" },
        { title: "API de monitoring", link: "/docs/monitoring/api" }
      ]
    },
    {
      title: "Troubleshooting",
      description: t("page.solutions_au"),
      items: [
        { title: "Problèmes de connexion", link: "/docs/troubleshooting/connection" },
        { title: "Erreurs de paiement", link: "/docs/troubleshooting/payments" },
        { title: "Performance lente", link: "/docs/troubleshooting/performance" },
        { title: "Support", link: "/docs/troubleshooting/support" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation Technique
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Documentation complète et transparente de notre infrastructure
            API et processus techniques.
          </p>
        </div>

        {/* Sections */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {documentationSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 mb-6">{section.description}</p>
              
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link 
                      href={item.link}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span className="mr-2">📄</span>
                      {item.title}
                      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔓 Open Source et Transparence
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t("common.code_source")}</h3>
              <p className="text-gray-600 mb-6">
                Une grande partie de notre code est open source et disponible 
                sur GitHub pour audit et contribution.
              </p>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <span className="mr-2">📦</span>
                  DazNode Core
                </a>
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <span className="mr-2">🔌</span>
                  API Documentation
                </a>
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <span className="mr-2">⚙️</span>
                  SDK JavaScript
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t("common.audits_et_securite")}</h3>
              <p className="text-gray-600 mb-6">
                Nos audits de sécurité et rapports de vulnérabilités 
                sont publics et accessibles.
              </p>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <span className="mr-2">🔍</span>
                  Audit de Sécurité 2024
                </a>
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <span className="mr-2">🐛</span>
                  Programme Bug Bounty
                </a>
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <span className="mr-2">⚠️</span>
                  Vulnérabilités connues
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques Publiques */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            📊 Métriques Publiques
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-2 text-gray-600">
                <div>{t("home.uptime_999")}</div>
                <div>{t("common.latence_moyenne_45ms")}</div>
                <div>{t("common.throughput_12m_txjour")}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("common.securite")}</h3>
              <div className="space-y-2 text-gray-600">
                <div>{t("common.vulnerabilites_critiques_0")}</div>
                <div>{t("common.bugs_corriges_23")}</div>
                <div>{t("common.dernier_audit_jan_2024")}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("common.communaute")}</h3>
              <div className="space-y-2 text-gray-600">
                <div>{t("common.contributeurs_47")}</div>
                <div>{t("common.stars_github_12k")}</div>
                <div>{t("home.forks_234")}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
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