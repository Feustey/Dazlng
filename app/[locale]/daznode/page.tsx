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

export default function DaznodePage() {
  const locale = useLocale();
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
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
      <div className="bg-gradient-to-br from-background to-background/50 rounded-lg p-8 mb-12 border border-border shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            {content.hero.title}
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            {content.hero.description}
          </p>
          <Button variant="gradient" size="lg">
            {content.hero.cta} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Section Fonctionnalités */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gradient mb-8 text-center">
          {content.features.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.features.items.map((feature: any, index: number) => (
            <Card
              key={index}
              className="p-6 hover:scale-[1.02] transition-transform duration-300"
            >
              <CardHeader>
                <div className="mb-4">{getIcon(feature.icon)}</div>
                <CardTitle className="text-xl font-semibold text-gradient">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Section Dashboard */}
      <div className="mb-16 bg-gradient-to-br from-background/80 to-background/40 rounded-lg p-8 border border-border shadow-lg">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gradient mb-4 text-center">
            {content.dashboard.title}
          </h2>
          <p className="text-lg text-gray-300 mb-8 text-center">
            {content.dashboard.subtitle}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="p-4 text-center">
              <CardContent className="p-2">
                <p className="text-sm text-gray-400">
                  {content.dashboard.metrics.channels}
                </p>
                <p className="text-3xl font-bold text-gradient">250</p>
              </CardContent>
            </Card>
            <Card className="p-4 text-center">
              <CardContent className="p-2">
                <p className="text-sm text-gray-400">
                  {content.dashboard.metrics.activeChannels.replace(
                    "{count}",
                    "120"
                  )}
                </p>
                <p className="text-3xl font-bold text-gradient">120</p>
              </CardContent>
            </Card>
            <Card className="p-4 text-center">
              <CardContent className="p-2">
                <p className="text-sm text-gray-400">
                  {content.dashboard.metrics.capacity}
                </p>
                <p className="text-3xl font-bold text-gradient">5.2 BTC</p>
              </CardContent>
            </Card>
            <Card className="p-4 text-center">
              <CardContent className="p-2">
                <p className="text-sm text-gray-400">
                  {content.dashboard.metrics.fees}
                </p>
                <p className="text-3xl font-bold text-gradient">50,000 sats</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Section Témoignages */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gradient mb-8 text-center">
          {content.testimonials.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.testimonials.items.map((testimonial: any, index: number) => (
            <Card
              key={index}
              gradient
              className="p-6 hover:scale-[1.02] transition-transform duration-300"
            >
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <Quote className="w-10 h-10 text-primary/50 mr-4 flex-shrink-0" />
                  <p className="text-lg text-gray-300 italic">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gradient font-semibold">
                    {testimonial.author}
                  </p>
                </div>
              </CardContent>
            </Card>
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
