"use client";

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Gauge,
  Activity,
  Brain,
  Shield,
  Rocket,
  Star,
  Users,
  Award,
  Lightbulb,
  BarChart,
  PieChart,
  LineChart,
  Target as TargetIcon,
  Zap as ZapIcon,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';

export default function DazFlowPage() {
  const features = [
    {
      icon: <Gauge className="h-8 w-8 text-blue-600" />,
      title: "Capacité de Routage Précise",
      description: "Mesurez votre capacité réelle de routage Lightning avec une précision inégalée. DazFlow Index analyse la liquidité disponible et calcule votre potentiel de revenus.",
      metrics: ["Précision 99.9%", "Analyse temps réel", "Prédictions IA"]
    },
    {
      icon: <Activity className="h-8 w-8 text-green-600" />,
      title: "Identification des Goulots",
      description: "Détectez automatiquement les goulots d'étranglement qui limitent vos revenus. Notre IA identifie les canaux déséquilibrés et propose des solutions.",
      metrics: ["Détection automatique", "Solutions personnalisées", "Optimisation continue"]
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Courbe de Fiabilité",
      description: "Visualisez la probabilité de succès de vos paiements selon le montant. Optimisez vos paramètres pour maximiser vos revenus.",
      metrics: ["Probabilités par montant", "Intervalles de confiance", "Recommandations IA"]
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: "Optimisation Automatique",
      description: "Laissez notre IA optimiser votre configuration pour maximiser le flux de paiements. Recommandations basées sur des millions de transactions.",
      metrics: ["Optimisation IA", "ROI amélioré", "Configuration automatique"]
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "+45% de Revenus",
      description: "Augmentation moyenne des revenus grâce à l'optimisation DazFlow Index"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Réduction des Risques",
      description: "Évitez les force-closes coûteux avec notre analyse prédictive"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "ROI 2.3x Amélioré",
      description: "Retour sur investissement significativement amélioré"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Communauté Active",
      description: "Rejoignez 500+ node runners qui utilisent DazFlow Index"
    }
  ];

  const metrics = [
    {
      icon: <BarChart className="h-8 w-8 text-blue-500" />,
      value: "99.9%",
      label: "Précision Analyse",
      description: "Précision de nos prédictions basée sur l'IA"
    },
    {
      icon: <PieChart className="h-8 w-8 text-green-500" />,
      value: "24/7",
      label: "Monitoring Continu",
      description: "Surveillance en temps réel de votre nœud"
    },
    {
      icon: <LineChart className="h-8 w-8 text-purple-500" />,
      value: "+45%",
      label: "Revenus Améliorés",
      description: "Augmentation moyenne des revenus"
    },
    {
      icon: <TargetIcon className="h-8 w-8 text-orange-500" />,
      value: "2.3x",
      label: "ROI Amélioré",
      description: "Retour sur investissement multiplié"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
              <Gauge className="h-4 w-4 mr-2" />
              Nouveau : DazFlow Index
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Optimisez Vos Revenus Lightning avec{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                DazFlow Index
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
              L'index révolutionnaire qui analyse votre capacité de routage, identifie les goulots d'étranglement 
              et optimise automatiquement vos revenus Lightning Network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/user/node"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Gauge className="h-5 w-5 mr-2" />
                Tester DazFlow Index
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Commencer Gratuitement
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">{metric.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-blue-100 text-sm">{metric.label}</div>
                  <div className="text-blue-200 text-xs mt-1">{metric.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Fonctionnalités Révolutionnaires
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DazFlow Index combine intelligence artificielle et analyse de données pour optimiser 
              votre nœud Lightning comme jamais auparavant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pourquoi Choisir DazFlow Index ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez les centaines de node runners qui ont déjà transformé leurs revenus 
              grâce à notre technologie d'optimisation avancée.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-full shadow-lg">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les témoignages de node runners qui ont transformé leurs revenus 
              grâce à DazFlow Index.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Optimiser Vos Revenus ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les 500+ node runners qui utilisent DazFlow Index pour maximiser 
            leurs revenus Lightning Network.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/user/node"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Gauge className="h-5 w-5 mr-2" />
              Tester DazFlow Index
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Commencer Gratuitement
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-blue-200">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>7 jours gratuits</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Aucune carte bancaire</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Configuration en 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Gauge className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-2xl font-bold">DazFlow Index</span>
            </div>
            <p className="text-gray-400 mb-6">
              Optimisation Lightning Network par Intelligence Artificielle
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Conditions
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 