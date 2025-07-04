"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BarChart3, TrendingUp, Zap, Target, CheckCircle, ArrowRight, Gauge, Activity, Brain, Shield, Star, Users, Award, BarChart, PieChart, LineChart } from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

const DazFlowPage: React.FC = () => {
  const locale = useLocale();
  const { t } = useAdvancedTranslation("dazflow");

  const features = [
    {
      icon: <Gauge />,
      title: "Capacité de Routage Précise",
      description: t("page_common.mesurez_votre_capacite_de_routage"),
      metrics: ["Précision 99.9%", "Analyse temps réel", "Prédictions IA"]
    },
    {
      icon: <Activity />,
      title: "Identification des Goulots",
      description: "Détectez automatiquement les goulots d'étranglement qui limitent vos revenus. Notre IA identifie les canaux déséquilibrés et propose des solutions.",
      metrics: ["Détection automatique", "Solutions personnalisées", "Optimisation continue"]
    },
    {
      icon: <Brain />,
      title: "Courbe de Fiabilité",
      description: "Visualisez la probabilité de succès de vos paiements selon le montant.",
      metrics: ["Probabilités par montant", "Intervalles de confiance", "Recommandations IA"]
    },
    {
      icon: <Target />,
      title: "Optimisation Automatique",
      description: "Laissez notre IA optimiser vos paramètres pour maximiser vos revenus.",
      metrics: ["Optimisation IA", "ROI amélioré", "Configuration automatique"]
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp />,
      title: "+45% de Revenus",
      description: t("page_common.augmentation_moyenne_des_revenus"),
      detail: "grâce à l'optimisation DazFlow Index"
    },
    {
      icon: <Shield />,
      title: "Réduction des Risques",
      description: t("page_common.evitez_les_forceclose_couteux_grace")
    },
    {
      icon: <Zap />,
      title: "ROI 2.3x Amélioré",
      description: t("page_common.retour_sur_investissement_significatif")
    },
    {
      icon: <Users />,
      title: "Communauté Active",
      description: t("page_common.rejoignez_500_node_runners_qui")
    }
  ];

  const metrics = [
    {
      icon: <BarChart />,
      value: "99.9%",
      label: t("page_common.precision_analyse"),
      description: t("page_common.precision_de_nos_predictions_ia")
    },
    {
      icon: <PieChart />,
      value: "24/7",
      label: t("page_common.monitoring_continu"),
      description: t("page_common.surveillance_en_temps_reel")
    },
    {
      icon: <LineChart />,
      value: "+45%",
      label: t("page_common.revenus_ameliores"),
      description: t("page_common.augmentation_moyenne")
    },
    {
      icon: <Target />,
      value: "2.3x",
      label: t("page_common.roi_ameliore"),
      description: t("page_common.retour_sur_investissement")
    }
  ];

  const testimonials = [
    {
      name: "Node Runner Anonyme",
      role: "Opérateur Lightning",
      content: "DazFlow Index m'a fait économiser 0.2 BTC en frais de force-close cette année. L'analyse des goulots d'étranglement est révolutionnaire.",
      rating: 5
    },
    {
      name: "Bitcoin Maximalist",
      role: "Node Operator",
      content: "Grâce à DazFlow Index, mes revenus ont augmenté de 60% en 3 mois. La courbe de fiabilité m'aide à optimiser mes paramètres.",
      rating: 5
    },
    {
      name: "Lightning Enthusiast",
      role: "Network Participant",
      content: "L'identification automatique des goulots d'étranglement m'a permis de résoudre des problèmes que je ne soupçonnais même pas.",
      rating: 5
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-yellow-300 text-sm font-medium mb-6">
              <Gauge className="w-4 h-4 mr-2" />
              Nouveau : DazFlow Index
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              L'Index qui Révolutionne le{" "}
              <span className="text-yellow-400">Lightning Network</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              DazFlow Index combine IA avancée et données temps réel pour optimiser vos performances de nœud Lightning avec une précision inégalée.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/demo"
                className="inline-flex items-center px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
              >
                <Gauge className="w-5 h-5 mr-2" />
                Tester Gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/checkout/dazflow"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Commencer Maintenant
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">+45%</div>
                <div className="text-blue-100 text-sm">{t("common.revenus_moyens")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">99.9%</div>
                <div className="text-blue-100 text-sm">{t("common.precision_analyse")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">2.3x</div>
                <div className="text-blue-100 text-sm">{t("common.roi_ameliore")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-400 mb-1">24/7</div>
                <div className="text-blue-100 text-sm">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-lg text-gray-600">
              DazFlow Index intègre les dernières technologies d'IA pour optimiser vos nœuds Lightning Network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <TrendingUp className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t("common.analyse_predictive")}</h3>
              <p className="text-gray-600 mb-4">
                Notre IA analyse les patterns de trafic pour prédire les opportunités de routing optimales.
              </p>
              <div className="text-2xl font-bold text-blue-600">+45%</div>
              <div className="text-sm text-gray-500">{t("common.amelioration_des_revenus")}</div>
            </div>

            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t("common.optimisation_temps_reel")}</h3>
              <p className="text-gray-600 mb-4">
                Ajustement automatique des paramètres de frais et de liquidité pour maximiser les profits.
              </p>
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-500">{t("common.precision_analyse")}</div>
            </div>

            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <BarChart3 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t("common.metriques_avancees")}</h3>
              <p className="text-gray-600 mb-4">
                Tableaux de bord détaillés avec métriques de performance et alertes intelligentes.
              </p>
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-gray-500">{t("common.monitoring_continu")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir DazFlow Index ?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
                {benefit.detail && (
                  <p className="text-indigo-600 text-xs mt-2">{benefit.detail}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                    {metric.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">{metric.label}</div>
                <div className="text-sm text-gray-500">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce Que Disent Nos Utilisateurs
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-xl">★★★★★</div>
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à Optimiser Votre Nœud Lightning ?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Rejoignez les centaines d'opérateurs qui utilisent déjà DazFlow Index
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout/dazflow"
              className="inline-flex items-center px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Commencer Maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Voir la Démo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DazFlowPage; 