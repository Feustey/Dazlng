import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import Features from "@components/features/Features";
import { AnimatedHero } from "@components/ui/HomeAnimations";
import { cn } from "@/lib/utils";
import { Button } from "@components/ui/button";
import { Zap, Box } from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations("pages.home");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-purple-950">
        {/* Effet de grain */}
        <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
        </div>

        <AnimatedHero>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                Propulsez votre présence sur le réseau Lightning avec nos
                solutions clés en main
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                Choisissez entre notre service Daz-IA, l'assistant intelligent
                qui optimise automatiquement vos canaux et votre rentabilité, ou
                notre Daznode Box pré-configurée, prête à l'emploi pour un
                démarrage instantané. Rejoignez les leaders du Lightning Network
                et maximisez votre potentiel dès aujourd'hui.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/daznode"
                  className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-coral-500 hover:from-blue-600 hover:via-purple-600 hover:to-coral-600 text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-coral-600 opacity-50 blur-xl" />
                  </div>
                  <span className="relative flex items-center justify-center gap-2">
                    <Box className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Commandez votre Daznode !
                  </span>
                </Link>
                <Link
                  href="/daz-ia"
                  className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-coral-500 to-amber-500 hover:from-purple-600 hover:via-coral-600 hover:to-amber-600 text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-coral-600 to-amber-600 opacity-50 blur-xl" />
                  </div>
                  <span className="relative flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Découvrir Daz-IA
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedHero>
      </section>

      {/* Features Section */}
      <Features />
    </div>
  );
}
