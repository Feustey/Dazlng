"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("Home");
  const tHeader = useTranslations("Header");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-background dark:from-primary-950 dark:to-background pt-32 pb-20">
      {/* Cercles décoratifs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-100 dark:bg-secondary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent-100 dark:bg-accent-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 text-transparent bg-clip-text animate-fade-in">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in animation-delay-200">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
            <Link
              href={`/${locale}/daznode`}
              className="btn btn-primary px-8 py-3 text-lg group"
            >
              {t("hero.cta")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/learn`}
              className="btn btn-secondary px-8 py-3 text-lg"
            >
              {tHeader("learn")}
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-slide-up">
          <div className="bg-card p-6 rounded-xl shadow-lg">
            <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {t("totalNodes")}
            </h3>
            <p className="text-muted-foreground">10,000+</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-lg">
            <h3 className="text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">
              {t("totalChannels")}
            </h3>
            <p className="text-muted-foreground">50,000+</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-lg">
            <h3 className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">
              {t("totalCapacity")}
            </h3>
            <p className="text-muted-foreground">1,000 BTC</p>
          </div>
        </div>
      </div>
    </section>
  );
}
