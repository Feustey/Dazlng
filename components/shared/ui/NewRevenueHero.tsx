import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useConversionTracking } from '../../../hooks/useConversionTracking';

const NewRevenueHero: React.FC = () => {
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
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Générez des{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text">
              revenus passifs
            </span>
            {' '}avec votre nœud Bitcoin
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-green-200 font-semibold">
            Rejoignez une communauté de passionnés et contribuez à la révolution financière
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Transformez votre ordinateur en banque décentralisée. Gagnez des frais de transaction 
            tout en renforçant le réseau Bitcoin. <strong className="text-yellow-300">Aucune compétence technique requise.</strong>
          </p>
        </div>

        {/* Métriques de revenus en avant */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-yellow-400">50-200€</div>
            <div className="text-white text-lg">Revenus mensuels moyens</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-green-400">15-25%</div>
            <div className="text-white text-lg">ROI annuel typique</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-blue-400">4-8 mois</div>
            <div className="text-white text-lg">Amortissement DazBox</div>
          </div>
        </div>

        {/* Preuves sociales communauté */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-green-200 text-sm mt-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>+500 node runners actifs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>Discord privé 24/7</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Entraide technique garantie</span>
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
            <span className="text-yellow-300 font-bold text-xl">✅ Garantie 30 jours satisfait ou remboursé</span>
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
            <span className="text-sm font-medium mb-2">Découvrir pourquoi</span>
            <div className="w-12 h-12 rounded-full bg-yellow-300 text-green-700 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
};
};

export default NewRevenueHero; 