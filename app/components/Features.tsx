"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  LineChart,
  Zap,
  BarChart,
  Wallet,
  Shield,
  LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

// Utiliser React.memo pour éviter les re-rendus inutiles
const FeatureCard = React.memo(({ feature, index }: FeatureCardProps) => (
  <div
    className="group bg-card/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div
      className={`w-14 h-14 rounded-xl ${feature.bgColor} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
    >
      <feature.icon className="w-7 h-7" />
    </div>
    <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
      {feature.title}
    </h3>
    <p className="text-muted-foreground text-lg">{feature.description}</p>
  </div>
));

FeatureCard.displayName = "FeatureCard";

export default function Features() {
  const t = useTranslations("pages.home");

  const features: Feature[] = [
    {
      icon: BookOpen,
      title: t("features.learning.title"),
      description: t("features.learning.description"),
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-950",
    },
    {
      icon: LineChart,
      title: t("features.transactions.title"),
      description: t("features.transactions.description"),
      color: "text-secondary-600 dark:text-secondary-400",
      bgColor: "bg-secondary-50 dark:bg-secondary-950",
    },
    {
      icon: Zap,
      title: t("features.operations.title"),
      description: t("features.operations.description"),
      color: "text-accent-600 dark:text-accent-400",
      bgColor: "bg-accent-50 dark:bg-accent-950",
    },
    {
      icon: BarChart,
      title: t("features.metrics.title"),
      description: t("features.metrics.description"),
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-950",
    },
    {
      icon: Wallet,
      title: t("features.nwc.title"),
      description: t("features.nwc.description"),
      color: "text-secondary-600 dark:text-secondary-400",
      bgColor: "bg-secondary-50 dark:bg-secondary-950",
    },
    {
      icon: Shield,
      title: t("features.security.title"),
      description: t("features.security.description"),
      color: "text-accent-600 dark:text-accent-400",
      bgColor: "bg-accent-50 dark:bg-accent-950",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/50 via-background to-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            {t("features.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("features.subtitle")}
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
