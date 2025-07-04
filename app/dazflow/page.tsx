"use client";

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { BarChart3, TrendingUp, Zap, Target, CheckCircle, ArrowRight, Gauge, Activity, Brain, Shield, Star, Users, Award, BarChart, PieChart, LineChart } from '@/components/shared/ui/IconRegistry';
export const dynamic = 'force-dynamic';



const DazFlowPage: React.FC = () => {
  const locale = useLocale();

  const features = [
    {
      icon: <Gauge className="h-8 w-8 text-blue-600" />,
      title: "Capacité de Routage Précise",
      description: "common.commoncommonmesurez_votre_capa",
      metrics: ["Précision 99.9%", "Analyse temps réel", "Prédictions IA"]
    },
    {
      icon: <Activity className="h-8 w-8 text-green-600" />,
      title: "Identification des Goulots",
      description: "common.commoncommondtectez_automatiqu"étranglement qui limitent vos revenus. Notre IA identifie les canaux déséquilibrés et propose des solutions.",
      metrics: ["Détection automatique", "Solutions personnalisées", "Optimisation continue"]
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Courbe de Fiabilité",
      description: "common.commoncommonvisualisez_la_prob",
      metrics: ["Probabilités par montant", "Intervalles de confiance", "Recommandations IA"]
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: "Optimisation Automatique",
      description: "common.commoncommonlaissez_notre_ia_o",
      metrics: ["Optimisation IA", "common.commoncommonroi_amlior", "Configuration automatique"]
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "+45% de Revenus",
      description: "common.commoncommonaugmentation_moyen"optimisation DazFlow Index"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Réduction des Risques",
      description: "common.commoncommonvitez_les_forceclo"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "ROI 2.3x Amélioré",
      description: "common.commoncommonretour_sur_investi"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Communauté Active",
      description: "common.commoncommonrejoignez_500_node"
    }
  ];

  const metrics = [
    {
      icon: <BarChart className="h-8 w-8 text-blue-500" />,
      value: "99.9%",
      label: "common.commoncommonprcision_analyse",
      description: "common.commoncommonprcision_de_nos_pr"IA"
    },
    {
      icon: <PieChart className="h-8 w-8 text-green-500" />,
      value: "24/7",
      label: "common.commoncommonmonitoring_continu",
      description: "common.commoncommonsurveillance_en_te"
    },
    {
      icon: <LineChart className="h-8 w-8 text-purple-500" />,
      value: "+45%",
      label: "common.commoncommonrevenus_amliors",
      description: "common.commoncommonaugmentation_moyen"
    },
    {
      icon: <Target className="h-8 w-8 text-orange-500" />,
      value: "common.23x",
      label: "common.commoncommonroi_amlior",
      description: "common.commoncommonretour_sur_investi"
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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Gauge className="h-4 w-4 mr-2" />
              Nouveau : DazFlow Index
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              L'Index qui Révolutionne le{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                Lightning Network
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
              DazFlow Index combine IA avancée et données temps réel pour optimiser vos performances de nœud Lightning avec une précision inégalée.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/user/node"
                locale={locale}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Gauge className="h-5 w-5 mr-2" />
                Tester Gratuitement
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/register"
                locale={locale}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Commencer Maintenant
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">+45%</div>
                <div className="text-blue-100 text-sm">{t('common.revenus_moyens')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">99.9%</div>
                <div className="text-blue-100 text-sm">{t("common.commoncommonprcision_analyse")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">{t('common.23x')}</div>
                <div className="text-blue-100 text-sm">{t("common.commoncommonroi_amlior")}</div>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DazFlow Index intègre les dernières technologies d'IA pour optimiser vos nœuds Lightning Network
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('common.analyse_prdictive')}</h3>
              <p className="text-gray-600 mb-4">
                Notre IA analyse les patterns de trafic pour prédire les opportunités de routing optimales.
              </p>
              <div className="text-2xl font-bold text-blue-600">+45%</div>
              <div className="text-sm text-gray-500">{t('common.amlioration_des_revenus')}</div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('common.optimisation_temps_rel')}</h3>
              <p className="text-gray-600 mb-4">
                Ajustement automatique des paramètres de frais et de liquidité pour maximiser les profits.
              </p>
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-500">{t('common.prcision_danalyse')}</div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('common.mtriques_avances')}</h3>
              <p className="text-gray-600 mb-4">
                Tableaux de bord détaillés avec métriques de performance et alertes intelligentes.
              </p>
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-gray-500">{t("common.commoncommonmonitoring_continu")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DazFlow Index analyse votre nœud en temps réel et vous fournit des recommandations d'optimisation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connexion</h3>
              <p className="text-gray-600">
                Connectez votre nœud Lightning en quelques clics. Support complet pour LND, Core Lightning et Umbrel.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analyse</h3>
              <p className="text-gray-600">
                Notre IA analyse vos données en temps réel et identifie les opportunités d'optimisation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Optimisation</h3>
              <p className="text-gray-600">
                Appliquez les recommandations et voyez vos revenus augmenter automatiquement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Plans et Tarifs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gratuit</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                €0<span className="text-lg text-gray-500">{t('common.mois')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('common.analyse_basique')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('common.1_nud')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('common.mtriques_essentielles')}</span>
                </li>
              </ul>
              <Link
                href="/register"
                locale={locale}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors block text-center"
              >
                Commencer Gratuitement
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                Populaire
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">
                €29<span className="text-lg opacity-80">{t('common.mois')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span>{t('common.analyse_avance_ia')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span>{t('common.jusqu_5_nuds')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span>{t('common.optimisation_temps_rel')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span>{t('common.support_prioritaire')}</span>
                </li>
              </ul>
              <Link
                href="/register"
                locale={locale}
                className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors block text-center"
              >
                Commencer Pro
              </Link>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                €99<span className="text-lg text-gray-500">{t('common.mois')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('common.tout_du_plan_pro')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('common.nuds_illimits')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('common.api_personnalise')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('common.support_ddi_247')}</span>
                </li>
              </ul>
              <Link
                href="/contact"
                locale={locale}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors block text-center"
              >
                Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à Optimiser vos Revenus ?
          </h2>
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
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/register"
              locale={locale}
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Commencer Maintenant
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DazFlowPage; 