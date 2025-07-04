import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useConversionTracking } from "../../../hooks/useConversionTracking";
import Link from "next/link";
import { useLocale } from "next-intl";
import { GaugeArrowRight } from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const NewRevenueHero: React.FC = () => {
  const router = useRouter();
  const { trackEvent } = useConversionTracking();
  const locale = useLocale();
  const { t } = useAdvancedTranslation("home");

  const handleGetStarted = () => {
    trackEvent("hero_cta_clicked");
    router.push("/checkout");
  };

  const handleLearnMore = () => {
    trackEvent("hero_learn_more_clicked");
    router.push("/about");
  };

  const handleStartFree = (): void => {
    trackEvent("cta_click", "Start free clicked", { location: "NewRevenueHero" });
    router.push(`/${locale}/register`);
  };

  const handleViewDemo = (): void => {
    trackEvent("demo_click", "View demo clicked", { location: "NewRevenueHero" });
    router.push(`/${locale}/optimized-demo`);
  };

  const handleJoinCommunity = (): void => {
    trackEvent("community_click", "Join community clicked", { location: "NewRevenueHero" });
    window.open("https://t.me/tokenforgood", "_blank");
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Générez des{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                revenus passifs
              </span>{" "}
              avec le Lightning Network
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              DazNode optimise automatiquement votre nœud Lightning avec l'IA pour maximiser vos revenus. 
              Rejoignez plus de 1000 opérateurs qui gagnent déjà en moyenne 40% de plus.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={handleGetStarted}
                className="bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-700 transition-colors transform hover:scale-105"
              >
                Commencer maintenant
              </button>
              
              <button
                onClick={handleLearnMore}
                className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-600 hover:text-white transition-colors"
              >
                En savoir plus
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Installation en 5 minutes</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Support 24/7</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Essai gratuit</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-amber-600 mb-2">+40%</div>
                <div className="text-gray-600">Augmentation moyenne des revenus</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Performance</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">85%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sécurité</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">92%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Uptime</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewRevenueHero;