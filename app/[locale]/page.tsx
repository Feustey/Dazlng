"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Zap, Shield, Globe, MessageSquare } from "lucide-react";
import { NodeSearchDialog } from "@/app/components/NodeSearchDialog";
import { useRouter } from "next/navigation";

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
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    async function loadNetworkStats() {
      try {
        const response = await fetch("/api/network-summary");
        const data = await response.json();
        setNetworkStats(data);
      } catch (error) {
        console.error("Failed to load network stats:", error);
      }
    }

    loadContent();
    loadNetworkStats();
  }, [language]);

  const handleSearch = (query: string) => {
    // Rediriger vers la page du nœud avec le query en paramètre
    router.push(`/${language}/node/${encodeURIComponent(query)}`);
  };

  if (!content) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatSats = (sats: number) => {
    if (sats >= 100000000) {
      return `${(sats / 100000000).toFixed(1)} BTC`;
    }
    return `${formatNumber(sats)} sats`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">{content.hero.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {content.hero.description}
            </p>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              {content.hero.cta}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {content.features.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.features.items.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon === "zap" && (
                    <Zap className="h-6 w-6 text-primary" />
                  )}
                  {feature.icon === "shield" && (
                    <Shield className="h-6 w-6 text-primary" />
                  )}
                  {feature.icon === "globe" && (
                    <Globe className="h-6 w-6 text-primary" />
                  )}
                  {feature.icon === "message" && (
                    <MessageSquare className="h-6 w-6 text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {content.stats.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {networkStats ? (
              <>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">
                    {formatNumber(networkStats.totalNodes)}
                  </div>
                  <div className="text-muted-foreground">Nœuds Totaux</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">
                    {formatNumber(networkStats.totalChannels)}
                  </div>
                  <div className="text-muted-foreground">Canaux Totaux</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">
                    {formatSats(networkStats.totalCapacity)}
                  </div>
                  <div className="text-muted-foreground">Capacité Totale</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">
                    {formatNumber(networkStats.avgChannelsPerNode)}
                  </div>
                  <div className="text-muted-foreground">Canaux par Nœud</div>
                </Card>
              </>
            ) : (
              <div className="col-span-4 text-center text-muted-foreground">
                Chargement des statistiques...
              </div>
            )}
          </div>
        </div>
      </section>

      <NodeSearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
}
