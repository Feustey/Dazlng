"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";
import GradientLayout from "../../../components/shared/layout/GradientLayout";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  const router = useRouter();
  const { t } = useAdvancedTranslation("demo");

  const handleBackToHome = (): void => {
    router.push("/");
  };

  const handleStartFree = (): void => {
    router.push("/register");
  };

  return (
    <GradientLayout>
      <div className="min-h-screen">
        {/* Logo avec retour accueil */}
        <div className="absolute top-8 left-8">
          <Image
            src="/assets/images/logo-daznode-white.svg"
            alt="DazNode"
            width={120}
            height={40}
            className="cursor-pointer"
            onClick={handleBackToHome}
          />
        </div>
        
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Découvrez{" "}
              <span className="text-yellow-400">Daznode en action</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Voyez comme il est simple de déployer et gérer vos nœuds Lightning Network
            </p>
          </div>
          
          {/* Contenu de la démo */}
          <div className="space-y-20">
            {/* Étape 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl mr-4">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t("common.inscription_en_30_secondes")}</h3>
                </div>
                <p className="text-gray-300 mb-6">
                  Créez votre compte et accédez immédiatement à votre tableau de bord personnalisé.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Aucune configuration technique
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Interface intuitive
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Support en français
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <Image
                    src="/assets/images/demo-step1.png"
                    alt="Inscription"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center lg:order-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <Image
                    src="/assets/images/demo-step2.png"
                    alt="Déploiement"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="lg:order-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl mr-4">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t("common.deploiement_automatique")}</h3>
                </div>
                <p className="text-gray-300 mb-6">
                  Votre nœud Lightning est déployé automatiquement sur notre infrastructure haute performance.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Déploiement en 5 minutes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Configuration optimisée
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Monitoring temps réel
                  </li>
                </ul>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl mr-4">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t("common.gestion_simplifiee")}</h3>
                </div>
                <p className="text-gray-300 mb-6">
                  Gérez vos canaux, surveillez vos transactions et optimisez vos revenus depuis une interface unifiée.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Gestion des canaux
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Analyse des performances
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Optimisation automatique
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <Image
                    src="/assets/images/demo-step3.png"
                    alt="Gestion"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Stats impressionnantes */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-12">
                Résultats de nos utilisateurs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-yellow-300 mb-2">500+</div>
                  <div className="text-indigo-200">{t("common.noeuds_deployes")}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-yellow-300 mb-2">99.9%</div>
                  <div className="text-indigo-200">{t("common.disponibilite")}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-yellow-300 mb-2">5min</div>
                  <div className="text-indigo-200">{t("common.temps_de_deploiement")}</div>
                </div>
              </div>
            </div>

            {/* CTA Final */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-8">
                Prêt à commencer votre aventure Lightning ?
              </h3>
              <button
                onClick={handleStartFree}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors"
              >
                Démarrer Gratuitement
              </button>
              <p className="text-gray-300 mt-4">
                <span className="text-yellow-300 font-bold">{t("common.essai_gratuit_de_7_jours")}</span> • 
                Pas de carte bancaire requise
              </p>
            </div>
          </div>
        </div>
      </div>
    </GradientLayout>
  );
}
