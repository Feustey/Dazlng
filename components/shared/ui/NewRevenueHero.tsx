import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useConversionTracking } from '../../../hooks/useConversionTracking';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Gauge, ArrowRight } from '@/components/shared/ui/IconRegistry';


const NewRevenueHero: React.FC = () => {
  const router = useRouter();
  const { trackStep } = useConversionTracking();
  const locale = useLocale();

  const handleStartFree = (): void => {
    trackStep('cta_click', 'Start free clicked', { location: 'NewRevenueHero' });
    router.push(`/${locale}/register`);
  };

  const handleViewDemo = (): void => {
    trackStep('demo_click', 'View demo clicked', { location: 'NewRevenueHero' });
    router.push(`/${locale}/optimized-demo`);
  };

  const handleJoinCommunity = (): void => {
    trackStep('community_click', 'Join community clicked', { location: 'NewRevenueHero' });
    window.open('https://t.me/tokenforgood', '_blank');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-600 via-blue-700 to-purple-800 flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="Daznode"
            width={280}
            height={110}
            className="h-20 md:h-28 w-auto object-contain"
            priority
          />
        </div>

        {/* Nouveau titre centré sur les revenus */}
        <div className="relative">
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
              <div className="flex items-center">
                <Gauge className="h-4 w-4 mr-2" />
                Nouveau : DazFlow Index
              </div>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Gagnez des{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                Revenus Passifs
              </span>{' '}
              avec le Lightning Network
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
              Devenez opérateur de nœud Lightning et générez des revenus automatiques. 
              Avec <strong>{t('NewRevenueHero.dazflow_index')}</strong>, optimisez vos performances avec une précision inégalée.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/user/node"
                locale={locale}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Gauge className="h-5 w-5 mr-2" />
                Tester DazFlow Index
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/dazflow"
                locale={locale}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Découvrir DazFlow Index
              </Link>
            </div>

            {/* Stats avec DazFlow Index */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">+45%</div>
                <div className="text-blue-100 text-sm">{t('NewRevenueHero.revenus_avec_dazflow')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-blue-100 text-sm">{t('NewRevenueHero.prcision_analyse')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-blue-100 text-sm">{t('NewRevenueHero.monitoring_continu')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{t('NewRevenueHero.23x')}</div>
                <div className="text-blue-100 text-sm">{t('NewRevenueHero.roi_amlior')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques de revenus en avant */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-yellow-400">50-200€</div>
            <div className="text-white text-lg">{t('NewRevenueHero.revenus_mensuels_moyens')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-green-400">15-25%</div>
            <div className="text-white text-lg">{t('NewRevenueHero.roi_annuel_typique')}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-blue-400">{t('NewRevenueHero.48_mois')}</div>
            <div className="text-white text-lg">{t('NewRevenueHero.amortissement_dazbox')}</div>
          </div>
        </div>

        {/* Preuves sociales communauté */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-green-200 text-sm mt-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{t('NewRevenueHero.500_node_runners_actifs')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>{t('NewRevenueHero.discord_priv_247')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>{t('NewRevenueHero.entraide_technique_garantie')}</span>
          </div>
        </div>

        {/* Call-to-Action principal */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <button 
            onClick={handleStartFree}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-10 py-5 text-xl shadow-2xl transform hover:scale-105 transition-all rounded-xl"
          >
            🚀 Commencer à Gagner
          </button>
          
          <button 
            onClick={handleJoinCommunity}
            className="border-2 border-green-300 text-green-300 hover:bg-green-300 hover:text-green-900 px-10 py-5 text-xl bg-transparent rounded-xl font-bold transition-all"
          >
            💬 Rejoindre la Communauté
          </button>
        </div>

        {/* Garantie et bénéfices */}
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 mt-12 max-w-3xl mx-auto border border-white/30">
          <p className="text-white font-medium text-lg">
            <span className="text-yellow-300 font-bold text-xl">{t('NewRevenueHero._garantie_30_jours_satisfait_o')}</span>
            <br className="md:hidden" />
            <span className="block mt-2">
              Si vous ne générez pas au moins 50€ de revenus dans vos 30 premiers jours, nous vous remboursons intégralement.
            </span>
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <div className="group text-yellow-300 hover:text-yellow-200 transition-all duration-300 flex flex-col items-center cursor-pointer"
               onClick={() => document.getElementById('why-become-runner')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="text-sm font-medium mb-2">{t('NewRevenueHero.dcouvrir_pourquoi')}</span>
            <div className="w-12 h-12 rounded-full bg-yellow-300 text-green-700 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewRevenueHero; 