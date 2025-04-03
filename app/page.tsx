"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { ArrowRight, Zap, Shield, Globe, MessageSquare } from "lucide-react";

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  features: {
    title: string;
    items: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  stats: {
    title: string;
    items: {
      label: string;
      value: string;
    }[];
  };
}

export default function HomePage() {
  const { language } = useLanguage();
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch(`/locale/home/${language}.json`);
        if (!response.ok) throw new Error("Failed to load content");
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading home content:", error);
      }
    }

    fetchContent();
  }, [language]);

  if (!content) return <div>Chargement...</div>;

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {content.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {content.hero.subtitle}
            </p>
            <Button size="lg" className="gap-2">
              {content.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
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
            {content.stats.items.map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
