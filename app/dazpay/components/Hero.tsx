'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useConversionTracking } from '../../../hooks/useConversionTracking';

const DazPayHero: React.FC = () => {
  const router = useRouter();
  const { trackProductInterest } = useConversionTracking();

  const handleStartFree = (): void => {
    trackProductInterest('dazpay', 'hero_cta', { action: 'start_free' });
    router.push('/register');
  };

  const _handleLearnMore = (): void => {
    trackProductInterest('dazpay', 'hero_cta', { action: 'learn_more' });
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewDemo = (): void => {
    trackProductInterest('dazpay', 'hero_cta', { action: 'view_demo' });
    router.push('/dazpay/demo');
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center px-4 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.svg')] bg-center bg-repeat"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Contenu texte */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Badge de confiance */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-orange-100 text-sm font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Solution Certifiée Lightning Network
          </div>

          {/* Titre principal */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              DazPay
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-200 text-transparent bg-clip-text">
                Terminal Lightning
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 leading-relaxed max-w-2xl lg:max-w-none">
              Acceptez les paiements Bitcoin en quelques minutes.{' '}
              <span className="font-bold text-yellow-300">
                0Sats d'installation
              </span>{' '}
              et commencez à encaisser dès aujourd'hui.
            </p>
          </div>

          {/* Points clés */}
          <div className="grid sm:grid-cols-2 gap-4 text-orange-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">Installation instantanée</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">Conversion BTC/EUR</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">Dashboard marchand</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">Support multidevice</span>
            </div>
          </div>

          {/* Offre spéciale */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-black">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-bold text-lg">Offre de Lancement</p>
                <p className="text-orange-800">Premier mois gratuit</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">1%</p>
                <p className="text-sm text-orange-800">par transaction</p>
              </div>
            </div>
          </div>

          {/* Call-to-Action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={handleStartFree}
              className="group bg-white text-orange-600 font-bold px-8 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Commencer Gratuitement</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button 
              onClick={handleViewDemo}
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg bg-transparent rounded-xl font-bold transition-all duration-300"
            >
              Voir une Démo
            </button>
          </div>

          {/* Garantie */}
          <div className="flex items-center justify-center lg:justify-start gap-3 text-orange-100 text-sm">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Pas d'engagement, résiliable à tout moment</span>
          </div>
        </div>

        {/* Image du produit */}
        <div className="relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-3xl blur-3xl opacity-30 scale-110"></div>
            
            {/* Product showcase */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <Image
                src="/assets/images/dazpay-terminal.png"
                alt="DazPay - Terminal de Paiement Lightning Network"
                width={400}
                height={300}
                className="w-full h-auto object-contain"
                priority
              />
              
              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Instantané
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                0 Sats installation
              </div>
            </div>

            {/* Features floating */}
            <div className="absolute top-1/4 -left-8 bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm hidden lg:block">
              ⚡ Paiements Lightning
            </div>
            
            <div className="absolute bottom-1/4 -right-8 bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm hidden lg:block">
              💰 Conversion EUR
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="text-white/60 text-center">
          <p className="text-sm mb-2">Découvrir les fonctionnalités</p>
          <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DazPayHero; 