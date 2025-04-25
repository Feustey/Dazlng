"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Zap,
  BarChart2,
  Shield,
  Settings,
  Bot,
  Network,
  LucideIcon,
  ArrowUpRight,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  link?: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = React.memo(({ feature, index }: FeatureCardProps) => {
  const content = (
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-xl ${feature.gradient} p-0.5`}>
          <div className="w-full h-full rounded-xl bg-background/90 flex items-center justify-center">
            <feature.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        {feature.link && (
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        )}
      </div>
      <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
        {feature.title}
      </h3>
      <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
        {feature.description}
      </p>
    </div>
  );

  const baseClasses =
    "group relative bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] animate-fade-in overflow-hidden active:scale-95";

  if (feature.link) {
    return (
      <Link
        href={`/${feature.link}`}
        className={baseClasses}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`absolute inset-0 ${feature.gradient} opacity-10`} />
        </div>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`absolute inset-0 ${feature.gradient} opacity-10`} />
      </div>
      {content}
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

export default function Features() {
  const t = useTranslations("Home");

  const features: Feature[] = [
    {
      icon: Bot,
      title: "Assistant IA Intégré",
      description:
        "Optimisez automatiquement vos canaux et votre rentabilité grâce à notre intelligence artificielle qui analyse en temps réel le réseau.",
      gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
      link: "daz-ia",
    },
    {
      icon: Settings,
      title: "Configuration Automatisée",
      description:
        "Démarrez en quelques minutes avec notre Daznode Box pré-configurée. Branchez, connectez, et commencez à gagner.",
      gradient: "bg-gradient-to-r from-purple-500 to-coral-500",
      link: "daznode",
    },
    {
      icon: Network,
      title: "Gestion Multi-Nœuds",
      description:
        "Gérez tous vos nœuds Lightning depuis une interface unique et intuitive. Visualisez, analysez, optimisez.",
      gradient: "bg-gradient-to-r from-coral-500 to-amber-500",
    },
    {
      icon: BarChart2,
      title: "Analyses Avancées",
      description:
        "Suivez vos performances avec des métriques détaillées, des graphiques en temps réel et des prévisions de rentabilité.",
      gradient: "bg-gradient-to-r from-emerald-500 to-blue-500",
    },
    {
      icon: Zap,
      title: "Routage Intelligent",
      description:
        "Maximisez vos revenus grâce à notre algorithme de routage qui optimise automatiquement vos frais et vos chemins de paiement.",
      gradient: "bg-gradient-to-r from-amber-500 to-coral-500",
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description:
        "Protégez vos fonds avec notre système de sécurité multicouche, la sauvegarde automatique et le monitoring 24/7.",
      gradient: "bg-gradient-to-r from-blue-500 to-emerald-500",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-900/5 via-purple-900/5 to-blue-900/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
            Fonctionnalités Clés
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez les outils puissants qui font de Daznode la solution la
            plus complète pour gérer et optimiser vos nœuds Lightning Network.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
