"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Card from "./ui/card";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <section className="relative hero-gradient">
      {/* Effet de grain */}
      <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
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
            <Link
              href={`/${locale}/daznode`}
              className={cn(buttonVariants({ variant: "gradient" }))}
            >
              Obtenez votre Dazbox !{" "}
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </Link>
            <Link
              href={`/${locale}/learn`}
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Apprentissage
            </Link>
          </div>
        </div>

        {/* Statistiques avec animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in">
          <Card translucent className="p-6 shadow-xl">
            <h3 className="text-4xl font-bold text-gradient mb-2">
              Nœuds
              <br />
              Totaux
            </h3>
            <p className="text-gray-300 text-2xl font-semibold">10,000+</p>
          </Card>
          <Card translucent className="p-6 shadow-xl">
            <h3 className="text-4xl font-bold text-gradient mb-2">
              Canaux
              <br />
              Totaux
            </h3>
            <p className="text-gray-300 text-2xl font-semibold">50,000+</p>
          </Card>
          <Card translucent className="p-6 shadow-xl">
            <h3 className="text-4xl font-bold text-gradient mb-2">
              Capacité
              <br />
              Totale
            </h3>
            <p className="text-gray-300 text-2xl font-semibold">1,000 BTC</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
