"use client";

import { useEffect, useState, Suspense } from "react";
import { Card } from "@/app/components/ui/card";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Zap, Shield, Globe, MessageSquare } from "lucide-react";
import { NodeSearchDialog } from "@/app/components/NodeSearchDialog";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

// Chargement dynamique des composants non critiques
const DynamicFeatures = dynamic(() => import("@/app/components/Features"), {
  loading: () => <div className="h-96 bg-muted/50 animate-pulse" />,
});

const DynamicStats = dynamic(() => import("@/app/components/NetworkStats"), {
  loading: () => <div className="h-48 bg-muted/50 animate-pulse" />,
});

interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
}

interface HomeContent {
  hero: {
    title: string;
    description: string;
    cta: string;
  };
  features: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  stats: {
    title: string;
    items: Array<{
      value: string;
      label: string;
    }>;
  };
}

export default function HomePage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [content, setContent] = useState<HomeContent | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const t = useTranslations("Home");

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(`/locale/home/${language}.json`);
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Failed to load content:", error);
      }
    }

    loadContent();
  }, [language]);

  const handleSearch = (query: string) => {
    router.push(`/${language}/node/${encodeURIComponent(query)}`);
  };

  if (!content) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encart promotionnel Daznode */}
      <Card className="mb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="hidden md:block w-32 h-32 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
              <Image
                src="/images/Daznode-PI5.png"
                alt="Raspberry Pi 5 pour DazNode"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
                loading="eager"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                {t("daznodePromo.title")}
              </h1>
              <p className="text-lg opacity-90">
                {t("daznodePromo.description")}
              </p>
              <p className="text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full">
                {t("daznodePromo.limitedOffer")}
              </p>
            </div>
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-orange-600 hover:bg-orange-50 whitespace-nowrap"
            asChild
          >
            <Link href="/daznode" aria-label="En savoir plus sur DazNode">
              {t("daznodePromo.button")}
            </Link>
          </Button>
        </div>
      </Card>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">{content.hero.title}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {content.hero.description}
            </p>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              aria-label="Rechercher un nœud Lightning"
            >
              {content.hero.cta}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse" />}>
        <DynamicFeatures content={content.features} />
      </Suspense>

      {/* Stats Section */}
      <Suspense fallback={<div className="h-48 bg-muted/50 animate-pulse" />}>
        <DynamicStats />
      </Suspense>

      <NodeSearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
}
