"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen hero-gradient">
      {/* Effet de grain */}
      <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 animate-fade-in">
            <span className="text-gradient">
              Gérez vos nœuds
              <br />
              Lightning Network en
              <br />
              toute simplicité
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 animate-slide-up">
            Optimisez vos performances et votre rentabilité avec Daznode
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
            <Link href={`/${locale}/daznode`} className="btn-gradient">
              Obtenez votre Dazbox !{" "}
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </Link>
            <Link
              href={`/${locale}/learn`}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              Apprentissage
            </Link>
          </div>
        </div>

        {/* Statistiques avec animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 animate-fade-in">
          <div className="card-glass p-6">
            <h3 className="text-4xl font-bold text-gradient mb-2">
              Nœuds
              <br />
              Totaux
            </h3>
            <p className="text-gray-300 text-2xl font-semibold">10,000+</p>
          </div>
          <div className="card-glass p-6">
            <h3 className="text-4xl font-bold text-gradient mb-2">
              Canaux
              <br />
              Totaux
            </h3>
            <p className="text-gray-300 text-2xl font-semibold">50,000+</p>
          </div>
          <div className="card-glass p-6">
            <h3 className="text-4xl font-bold text-gradient mb-2">
              Capacité
              <br />
              Totale
            </h3>
            <p className="text-gray-300 text-2xl font-semibold">1,000 BTC</p>
          </div>
        </div>
      </div>
    </section>
  );
}
