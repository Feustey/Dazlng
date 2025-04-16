"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  TrendingUp,
  RefreshCw,
  MessageCircle,
  CheckCircle2,
  Quote,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DaznodeContent {
  title: string;
  description: string;
  features: {
    title: string;
    items: string[];
  };
  dashboard: {
    title: string;
    subtitle: string;
    metrics: Record<string, string>;
  };
  testimonials: {
    title: string;
    items: Array<{
      quote: string;
      author: string;
    }>;
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
}

export default function DaznodePage() {
  const locale = useLocale();
  const router = useRouter();
  const [content, setContent] = useState<DaznodeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(`/locale/daznode/${locale}.json`);
        if (!response.ok) {
          throw new Error("Failed to load content");
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading daznode content:", error);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [locale]);

  // Fonction pour obtenir l'icône correspondante
  const getIcon = (iconName: string) => {
    const iconSize = "w-8 h-8 text-primary";
    switch (iconName) {
      case "zap":
        return <Zap className={iconSize} />;
      case "trending-up":
        return <TrendingUp className={iconSize} />;
      case "refresh-cw":
        return <RefreshCw className={iconSize} />;
      case "message-circle":
        return <MessageCircle className={iconSize} />;
      default:
        return <Zap className={iconSize} />;
    }
  };

  if (loading || !content) {
    return (
      <PageContainer title="Daznode">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={content.title} subtitle={content.description}>
      {/* Section Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-purple-950 rounded-xl p-12 mb-16 relative overflow-hidden">
        {/* Effet de grain */}
        <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/20 mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Offre de lancement - 10 premières commandes
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent mb-6">
            Dazbox : Votre nœud Lightning
            <br />
            prêt à l'emploi
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Une box pré-configurée avec un nœud Lightning Network, connectée à
            Daz-IA et un abonnement annuel inclus. Branchez, allumez, et entrez
            dans l'ère de l'IA décentralisée.
          </p>
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                400 000 sats
              </span>
              <span className="text-sm text-gray-400 line-through">
                500 000 sats
              </span>
            </div>
            <span className="text-sm text-gray-400">
              Prix de lancement limité aux 10 premières commandes
            </span>
          </div>
          <Link
            href={`/${locale}/checkout?order=dazbox`}
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-coral-500 hover:from-blue-600 hover:via-purple-600 hover:to-coral-600 text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-coral-600 opacity-50 blur-xl" />
            </div>
            <span className="relative flex items-center gap-2">
              Commander ma Dazbox
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        </div>
      </div>

      {/* Section Image Dazbox */}
      <div className="relative bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm rounded-xl p-8 md:p-12 mb-16 border border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image de la Box */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-xl opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/dazbox.png"
                alt="Dazbox - Nœud Lightning Network pré-configuré"
                fill
                className="object-cover transform group-hover:scale-105 transition duration-500"
                priority
              />
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
              Découvrez la Dazbox
            </h2>
            <p className="text-lg text-gray-300">
              Une solution clé en main pour rejoindre le réseau Lightning
              Network et profiter de l'intelligence artificielle décentralisée.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  Nœud Lightning Network pré-configuré et optimisé
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  Intégration native avec Daz-IA et abonnement annuel inclus
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-coral-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  Installation plug-and-play : branchez et c'est parti !
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  Support technique dédié et mises à jour automatiques
                </span>
              </li>
            </ul>
            <div className="pt-4">
              <Link
                href={`/${locale}/checkout?order=dazbox`}
                className="group relative inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-coral-500 hover:from-blue-600 hover:via-purple-600 hover:to-coral-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                <span className="relative flex items-center gap-2">
                  Commander maintenant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent mb-8 text-center">
          {content.features.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.features.items.map((feature: any, index: number) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-50" />
              </div>
              <div className="relative z-10">
                <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                  <div className="w-full h-full rounded-xl bg-background/90 flex items-center justify-center">
                    {getIcon(feature.icon)}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Dashboard */}
      <div className="mb-16 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm rounded-xl p-12 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent mb-4 text-center">
            {content.dashboard.title}
          </h2>
          <p className="text-lg text-gray-300 mb-8 text-center">
            {content.dashboard.subtitle}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(content.dashboard.metrics).map(
              ([key, value], index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] text-center"
                >
                  <p className="text-sm text-gray-400 mb-2">{value}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {key === "activeChannels"
                      ? "120"
                      : key === "channels"
                        ? "250"
                        : key === "capacity"
                          ? "5.2 BTC"
                          : "50,000 sats"}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Section Témoignages */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent mb-8 text-center">
          {content.testimonials.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.testimonials.items.map((testimonial: any, index: number) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-50" />
              </div>
              <div className="relative z-10">
                <div className="flex items-start mb-4">
                  <Quote className="w-10 h-10 text-blue-400/50 mr-4 flex-shrink-0 group-hover:text-blue-400/70 transition-colors duration-300" />
                  <p className="text-lg text-gray-300 italic group-hover:text-gray-200 transition-colors duration-300">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="text-right">
                  <p className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                    {testimonial.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section FAQ */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gradient mb-8 text-center">
          {content.faq.title}
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6">
          {content.faq.items.map((item: any, index: number) => (
            <Card key={index} className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gradient">
                  {item.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section CTA */}
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8 border border-border shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gradient mb-4">
          {content.cta.title}
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          {content.cta.description}
        </p>
        <Button variant="gradient" size="lg">
          {content.cta.button} <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </PageContainer>
  );
}
