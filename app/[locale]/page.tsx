"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import {
  BookOpenIcon,
  BarChartIcon,
  ZapIcon,
  ShieldIcon,
  RocketIcon,
  UsersIcon,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const t = useTranslations("Home");

  const features = [
    {
      id: "learning",
      icon: <BookOpenIcon className="h-8 w-8" />,
      title: t("features.learning.title"),
      description: t("features.learning.description"),
    },
    {
      id: "transactions",
      icon: <BarChartIcon className="h-8 w-8" />,
      title: t("features.transactions.title"),
      description: t("features.transactions.description"),
    },
    {
      id: "operations",
      icon: <ZapIcon className="h-8 w-8" />,
      title: t("features.operations.title"),
      description: t("features.operations.description"),
    },
    {
      id: "metrics",
      icon: <BarChartIcon className="h-8 w-8" />,
      title: t("features.metrics.title"),
      description: t("features.metrics.description"),
    },
    {
      id: "nwc",
      icon: <ZapIcon className="h-8 w-8" />,
      title: t("features.nwc.title"),
      description: t("features.nwc.description"),
    },
  ];

  const benefits = [
    {
      id: "simplicity",
      icon: <RocketIcon className="h-6 w-6" />,
      title: t("benefits.items.simplicity"),
    },
    {
      id: "security",
      icon: <ShieldIcon className="h-6 w-6" />,
      title: t("benefits.items.security"),
    },
    {
      id: "performance",
      icon: <ZapIcon className="h-6 w-6" />,
      title: t("benefits.items.performance"),
    },
    {
      id: "support",
      icon: <UsersIcon className="h-6 w-6" />,
      title: t("benefits.items.support"),
    },
    {
      id: "community",
      icon: <UsersIcon className="h-6 w-6" />,
      title: t("benefits.items.community"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{t("hero.title")}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t("hero.subtitle")}
            </p>
            <Button
              size="lg"
              variant="orange"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="/daznode">{t("hero.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 text-primary">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DazLng Box Promo Section */}
      <section className="py-10 bg-gradient-to-r from-orange-500/10 to-blue-500/10">
        <div className="container mx-auto px-4">
          <Card className="p-8 border-2 border-orange-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-orange-500" />
                  <h3 className="text-2xl font-bold text-orange-500">
                    {t("daznodePromo.title")}
                  </h3>
                </div>
                <p className="text-lg mb-4">{t("daznodePromo.description")}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("daznodePromo.limitedOffer")}
                </p>
                <Button size="lg" variant="default" asChild>
                  <Link href="/daznode">{t("daznodePromo.button")}</Link>
                </Button>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full opacity-20 relative">
                  <Image
                    src="/images/dazbox.png"
                    alt="Dazlng Box"
                    width={120}
                    height={120}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("benefits.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="flex items-center space-x-4">
                <div className="text-primary">{benefit.icon}</div>
                <span className="text-lg">{benefit.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t("cta.description")}
            </p>
            <Button size="lg" asChild>
              <Link href="/register">{t("cta.button")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
