import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import Features from "../features/Features";
import { AnimatedHero } from "../HomeAnimations";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Zap,
  Box,
  TrendingUp,
  Activity,
  Coins,
  MoveUp,
  Star,
  CheckCircle2,
  Users,
  LineChart,
  Target,
  Rocket,
  Code,
  Shield,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { NetworkStats } from "../components/network/NetworkStats";
import { formatSats, formatNumber } from "../lib/utils";

export default async function HomePage() {
  const t = await getTranslations("pages.home");

  // Données de performance simulées (à remplacer par des données réelles de l'API MCP)
  const performanceData = {
    successRate: 99.8,
    routingTime: 45,
    averageFee: 350,
    monthlyVolume: 2500000000,
    weeklyStats: [
      { day: "Lun", volume: 350000000, successRate: 99.9 },
      { day: "Mar", volume: 380000000, successRate: 99.8 },
      { day: "Mer", volume: 420000000, successRate: 99.7 },
      { day: "Jeu", volume: 450000000, successRate: 99.9 },
      { day: "Ven", volume: 500000000, successRate: 99.8 },
      { day: "Sam", volume: 300000000, successRate: 99.9 },
      { day: "Dim", volume: 250000000, successRate: 99.8 },
    ],
  };

  // Données de comparaison avec les concurrents
  const comparisonData = {
    daznode: {
      successRate: 99.8,
      routingTime: 45,
      averageFee: 350,
      support: "24/7",
      setupTime: "5 min",
    },
    competitors: {
      successRate: 98.5,
      routingTime: 75,
      averageFee: 450,
      support: "9h-18h",
      setupTime: "30 min",
    },
  };

  // Témoignages d'utilisateurs
  const testimonials = [
    {
      name: "Pierre D.",
      role: "Node Operator",
      quote:
        "Daznode a transformé ma gestion de nœud Lightning. En 3 mois, mes revenus ont augmenté de 40% grâce à l'optimisation automatique des canaux.",
      rating: 5,
    },
    {
      name: "Sophie L.",
      role: "Business Owner",
      quote:
        "La simplicité d'utilisation et le support réactif font toute la différence. Je recommande vivement Daznode à tous les entrepreneurs.",
      rating: 5,
    },
    {
      name: "Thomas M.",
      role: "Crypto Enthusiast",
      quote:
        "Le tableau de bord est incroyablement intuitif. J'ai pu démarrer mon nœud en quelques minutes et commencer à générer des revenus.",
      rating: 5,
    },
  ];

  // Données de prévisions de croissance
  const growthData = {
    monthlyProjections: [
      { month: "Mois 1", revenue: 500000, channels: 5 },
      { month: "Mois 2", revenue: 750000, channels: 8 },
      { month: "Mois 3", revenue: 1200000, channels: 12 },
      { month: "Mois 6", revenue: 2500000, channels: 20 },
      { month: "Mois 12", revenue: 5000000, channels: 35 },
    ],
    roi: {
      initialInvestment: 1000000,
      monthlyRevenue: 500000,
      breakEven: 2,
      annualReturn: 6000000,
    },
  };

  // Plans de tarification
  const pricingPlans = [
    {
      name: "Starter",
      price: "0",
      features: [
        "Jusqu'à 5 canaux",
        "Optimisation basique",
        "Support par email",
        "Tableau de bord standard",
      ],
      cta: "Commencer gratuitement",
      popular: false,
    },
    {
      name: "Pro",
      price: "49",
      features: [
        "Jusqu'à 20 canaux",
        "Optimisation avancée",
        "Support prioritaire",
        "Tableau de bord premium",
        "Analyses détaillées",
        "Rebalancing automatique",
      ],
      cta: "Essayer gratuitement",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "99",
      features: [
        "Canaux illimités",
        "Optimisation maximale",
        "Support 24/7",
        "API complète",
        "Statistiques avancées",
        "Gestion multi-nœuds",
      ],
      cta: "Contactez-nous",
      popular: false,
    },
  ];

  // Données d'intégrations
  const integrations = [
    {
      name: "Lightning Network",
      description: "Intégration native avec le protocole Lightning",
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
    },
    {
      name: "API REST",
      description: "API complète pour l'automatisation",
      icon: <Code className="w-8 h-8 text-blue-400" />,
    },
    {
      name: "Sécurité",
      description: "Protocoles de sécurité avancés",
      icon: <Shield className="w-8 h-8 text-green-400" />,
    },
  ];

  // Questions fréquentes
  const faqs = [
    {
      question: "Combien de temps faut-il pour configurer un nœud ?",
      answer:
        "Avec Daznode, vous pouvez démarrer en moins de 5 minutes. Notre interface intuitive et nos guides détaillés vous accompagnent à chaque étape.",
    },
    {
      question: "Quel est le montant minimum d'investissement ?",
      answer:
        "Vous pouvez commencer avec un investissement minimal de 0.01 BTC. Notre algorithme optimise automatiquement votre capital pour maximiser les retours.",
    },
    {
      question: "Comment sont calculés les frais de routage ?",
      answer:
        "Nos algorithmes analysent en temps réel le marché et ajustent dynamiquement vos frais pour maximiser les revenus tout en maintenant une excellente connectivité.",
    },
    {
      question: "Quelle est la politique de support ?",
      answer:
        "Nous offrons un support 24/7 pour tous nos utilisateurs, avec des temps de réponse moyens de moins de 2 heures pour les questions techniques.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-purple-950">
        {/* Effet de grain */}
        <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
        </div>

        <AnimatedHero>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                Propulsez votre présence sur le réseau Lightning avec nos
                solutions clés en main
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                Choisissez entre notre service Daz-IA, l'assistant intelligent
                qui optimise automatiquement vos canaux et votre rentabilité, ou
                notre Daznode Box pré-configurée, prête à l'emploi pour un
                démarrage instantané. Rejoignez les leaders du Lightning Network
                et maximisez votre potentiel dès aujourd'hui.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/get-started">Commencer maintenant →</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/learn">En savoir plus</Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedHero>
      </section>

      {/* Performance Metrics Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Performance du Réseau
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-blue-400">
                  Taux de succès
                </h3>
              </div>
              <p className="text-4xl font-bold">
                {performanceData.successRate}%
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-yellow-400">
                  Temps de routage
                </h3>
              </div>
              <p className="text-4xl font-bold">
                {performanceData.routingTime}ms
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-400">
                  Frais moyens
                </h3>
              </div>
              <p className="text-4xl font-bold">
                {performanceData.averageFee} sats
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-green-400">
                  Volume mensuel
                </h3>
              </div>
              <p className="text-4xl font-bold">
                {formatSats(performanceData.monthlyVolume)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir Daznode ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Daznode vs Concurrents</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Taux de succès</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">
                      {comparisonData.daznode.successRate}%
                    </span>
                    <span className="text-gray-400">
                      vs {comparisonData.competitors.successRate}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Temps de routage</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">
                      {comparisonData.daznode.routingTime}ms
                    </span>
                    <span className="text-gray-400">
                      vs {comparisonData.competitors.routingTime}ms
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Frais moyens</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">
                      {comparisonData.daznode.averageFee} sats
                    </span>
                    <span className="text-gray-400">
                      vs {comparisonData.competitors.averageFee} sats
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Support</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">
                      {comparisonData.daznode.support}
                    </span>
                    <span className="text-gray-400">
                      vs {comparisonData.competitors.support}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Temps de configuration</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">
                      {comparisonData.daznode.setupTime}
                    </span>
                    <span className="text-gray-400">
                      vs {comparisonData.competitors.setupTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Avantages clés</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Optimisation automatique</h4>
                    <p className="text-gray-400">
                      Nos algorithmes ajustent automatiquement vos canaux pour
                      maximiser les revenus
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Support expert 24/7</h4>
                    <p className="text-gray-400">
                      Une équipe dédiée à votre disposition pour toute question
                      ou assistance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Interface intuitive</h4>
                    <p className="text-gray-400">
                      Un tableau de bord clair et simple pour gérer votre nœud
                      efficacement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ce que disent nos utilisateurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <NetworkStats
            totalNodes={25000}
            totalCapacity={1000000000}
            totalChannels={75000}
            avgChannelSize={1500000}
            useApi={false}
          />
        </div>
      </section>

      {/* Growth Projections Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Votre Potentiel de Croissance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LineChart className="w-6 h-6 text-blue-400" />
                Prévisions de revenus
              </h3>
              <div className="space-y-4">
                {growthData.monthlyProjections.map((projection, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-300">{projection.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 font-bold">
                        {formatSats(projection.revenue)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {projection.channels} canaux
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-400" />
                Retour sur investissement
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Investissement initial</span>
                  <span className="text-blue-400 font-bold">
                    {formatSats(growthData.roi.initialInvestment)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Revenu mensuel moyen</span>
                  <span className="text-green-400 font-bold">
                    {formatSats(growthData.roi.monthlyRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Point d'équilibre</span>
                  <span className="text-yellow-400 font-bold">
                    {growthData.roi.breakEven} mois
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Retour annuel estimé</span>
                  <span className="text-purple-400 font-bold">
                    {formatSats(growthData.roi.annualReturn)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choisissez votre plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white/5 p-6 rounded-lg backdrop-blur-sm relative ${
                  plan.popular ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Plus populaire
                    </div>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <Link
                    href={
                      plan.cta === "Contactez-nous" ? "/contact" : "/signup"
                    }
                  >
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Integrations Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Intégrations & Sécurité
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  {integration.icon}
                  <h3 className="text-xl font-bold">{integration.name}</h3>
                </div>
                <p className="text-gray-400">{integration.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="group">
              <Link href="/faq" className="flex items-center gap-2">
                Voir toutes les questions
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-purple-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à démarrer ?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'opérateurs qui ont déjà choisi Daznode pour
            maximiser leurs revenus sur le Lightning Network.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/get-started">Commencer gratuitement →</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Discuter avec un expert</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
