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
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-background to-secondary-50 dark:from-primary-950 dark:via-background dark:to-secondary-950 pt-32 pb-20">
      {/* Cercles décoratifs améliorés */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-100 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-100 dark:bg-secondary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-accent-100 dark:bg-accent-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-400 text-transparent bg-clip-text animate-fade-in">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in animation-delay-200">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
            <Link
              href={`/${locale}/daznode`}
              className="btn btn-primary px-8 py-3 text-lg group hover:scale-105 transition-transform duration-300"
            >
              {t("hero.cta")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/learn`}
              className="btn btn-secondary px-8 py-3 text-lg hover:scale-105 transition-transform duration-300"
            >
              {tHeader("learn")}
            </Link>
          </div>
        </div>

        {/* Statistiques améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-slide-up">
          <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <h3 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {t("totalNodes")}
            </h3>
            <p className="text-muted-foreground text-lg">10,000+</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <h3 className="text-4xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">
              {t("totalChannels")}
            </h3>
            <p className="text-muted-foreground text-lg">50,000+</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <h3 className="text-4xl font-bold text-accent-600 dark:text-accent-400 mb-2">
              {t("totalCapacity")}
            </h3>
            <p className="text-muted-foreground text-lg">1,000 BTC</p>
          </div>
        </div>
      </div>
    </section>
  );
}
