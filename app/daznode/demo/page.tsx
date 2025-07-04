'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GradientLayout from '../../../components/shared/layout/GradientLayout';

export const dynamic = 'force-dynamic';
export default function DemoPage() {
  const router = useRouter();

  const handleBackToHome = (): void => {
    router.push('/');
  };

  const handleStartFree = (): void => {
    router.push('/register');
  };

  return (
    <GradientLayout>
      <div className="max-w-6xl mx-auto py-20 px-4">
        {/* Logo avec retour accueil */}
        <div className="flex justify-center mb-8 cursor-pointer" onClick={handleBackToHome}>
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="Daznode"
            width={200}
            height={80}
            className="h-16 w-auto hover:scale-105 transition-transform"
            priority
          />
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Découvrez{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-pink-400 text-transparent bg-clip-text">
              Daznode en action
            </span>
          </h1>
          
          <p className="text-xl text-indigo-200 text-center mb-12 max-w-3xl mx-auto">
            Voyez comme il est simple de déployer et gérer vos nœuds Lightning Network
          </p>
          
          {/* Contenu de la démo */}
          <div className="space-y-12">
            {/* Étape 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center text-black font-bold">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t('common.inscription_en_30_secondes')}</h3>
                </div>
                <p className="text-indigo-200 text-lg">
                  Créez votre compte et accédez immédiatement à votre tableau de bord personnalisé.
                </p>
                <ul className="space-y-2 text-indigo-200">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Aucune configuration technique
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Interface intuitive
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Support en français
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                <div className="h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/assets/images/onboarding-daznode.png"
                    alt="common.commoncommoncran_d"inscription Daznode"
                    width={400}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="bg-white/5 rounded-xl p-6 border border-white/20 order-2 lg:order-1">
                <div className="h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/assets/images/dashboard-daznode.png"
                    alt="common.commoncommondashboard_de_gesti"
                    width={400}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 order-1 lg:order-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center text-black font-bold">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t('common.dploiement_automatique')}</h3>
                </div>
                <p className="text-indigo-200 text-lg">
                  Votre nœud Lightning est déployé automatiquement sur notre infrastructure haute performance.
                </p>
                <ul className="space-y-2 text-indigo-200">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Déploiement en 5 minutes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Configuration optimisée
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Monitoring temps réel
                  </li>
                </ul>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center text-black font-bold">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t('common.gestion_simplifie')}</h3>
                </div>
                <p className="text-indigo-200 text-lg">
                  Gérez vos canaux, surveillez vos transactions et optimisez vos revenus depuis une interface unifiée.
                </p>
                <ul className="space-y-2 text-indigo-200">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Gestion des canaux
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Analyse des performances
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Optimisation automatique
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                <div className="h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/assets/images/gestion-daznode.png"
                    alt="common.commoncommoninterface_de_gesti"
                    width={400}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stats impressionnantes */}
            <div className="bg-gradient-to-r from-yellow-400/10 to-pink-500/10 rounded-2xl p-8 border border-yellow-300/20">
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                Résultats de nos utilisateurs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">500+</div>
                  <div className="text-indigo-200">{t('common.nuds_dploys')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">99.9%</div>
                  <div className="text-indigo-200">{t('common.disponibilit')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">{t('common.5min')}</div>
                  <div className="text-indigo-200">{t('common.temps_de_dploiement')}</div>
                </div>
              </div>
            </div>

            {/* CTA Final */}
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-white">
                Prêt à commencer votre aventure Lightning ?
              </h3>
              <button
                onClick={handleStartFree}
                className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-black font-bold px-8 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all rounded-xl"
              >
                Démarrer Gratuitement
              </button>
              <p className="text-indigo-200 text-sm">
                <span className="text-yellow-300 font-bold">{t('common.essai_gratuit_ia_de_7_jours')}</span> • 
                Pas de carte bancaire requise
              </p>
            </div>
          </div>
        </div>
      </div>
    </GradientLayout>
  );
}
