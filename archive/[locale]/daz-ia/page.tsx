"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";
import {
  Zap,
  Brain,
  Rocket,
  Shield,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Settings,
  Users,
} from "lucide-react";

export default function DazIAPage() {
  const t = useTranslations("daz-ia");
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "fr";

  return (
    <PageContainer>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Fond avec dégradé et grain */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-blue-950 dark:to-purple-950">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          {/* En-tête */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/20 mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                Propulsé par l'Intelligence Artificielle
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
              Optimisez votre nœud Lightning
              <br />
              avec l'intelligence artificielle
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Daz-IA analyse en temps réel votre nœud Lightning Network pour
              maximiser vos revenus et optimiser vos performances. Rejoignez les
              leaders du réseau qui font déjà confiance à notre technologie.
            </p>
          </div>

          {/* Caractéristiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Brain className="w-8 h-8 text-blue-400" />,
                title: "IA Avancée",
                description:
                  "Algorithmes d'apprentissage automatique pour des recommandations personnalisées",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
                title: "Optimisation Continue",
                description:
                  "Amélioration constante de vos performances et de votre rentabilité",
              },
              {
                icon: <Shield className="w-8 h-8 text-coral-400" />,
                title: "Sécurité Maximale",
                description:
                  "Protection avancée de vos fonds et de vos données",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-50" />
                </div>
                <div className="relative z-10">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-white mt-4 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Plans tarifaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Plan One-Shot */}
            <div className="relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-50" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      Analyse One-Shot
                    </h3>
                    <p className="text-gray-400">
                      Diagnostic complet et recommandations personnalisées
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-white">10K sats</div>
                </div>

                <ul className="space-y-3">
                  {[
                    "Recommandations personnalisées",
                    "Rapport détaillé",
                    "Support pendant 48h",
                    "Analyse des opportunités",
                    "Diagnostic de sécurité",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/checkout?order=one-shot`}
                  className="group relative w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    Commander maintenant 10K sats
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Plan Abonnement */}
            <div className="relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-50" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/20 mb-2">
                      <span className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                        Plus populaire
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      Abonnement Annuel
                    </h3>
                    <p className="text-gray-400">
                      Optimisation continue et support prioritaire
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      100K sats
                    </div>
                    <div className="text-sm text-gray-400">/an</div>
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    "Analyse en temps réel",
                    "Optimisation continue",
                    "Support prioritaire",
                    "Mises à jour exclusives",
                    "Rapports hebdomadaires",
                    "Alertes personnalisées",
                    "Accès aux fonctionnalités premium",
                    "Communauté privée",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/checkout?order=subscription`}
                  className="group relative w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-purple-500 to-coral-500 hover:from-purple-600 hover:via-purple-600 hover:to-coral-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    S'abonner maintenant 100K sats/an
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Section Avantages */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent mb-12">
              Pourquoi choisir Daz-IA ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BarChart3 className="w-12 h-12 text-blue-400" />,
                  title: "Rentabilité Maximisée",
                  description:
                    "Augmentez vos revenus grâce à nos algorithmes d'optimisation qui analysent en permanence les meilleures opportunités du réseau.",
                },
                {
                  icon: <Settings className="w-12 h-12 text-purple-400" />,
                  title: "Configuration Optimale",
                  description:
                    "Bénéficiez de recommandations personnalisées pour optimiser vos canaux et votre liquidité en fonction de vos objectifs.",
                },
                {
                  icon: <Users className="w-12 h-12 text-coral-400" />,
                  title: "Communauté Active",
                  description:
                    "Rejoignez une communauté dynamique de nodes operators et partagez les meilleures pratiques pour réussir sur le réseau.",
                },
              ].map((advantage, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="flex justify-center">{advantage.icon}</div>
                  <h3 className="text-xl font-semibold text-white">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-400">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
