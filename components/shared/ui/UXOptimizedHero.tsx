import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useConversionTracking } from '../../../hooks/useConversionTracking';
import { Shield, Zap, TrendingUp, Clock, Users, CheckCircle } from 'lucide-react';

const UXOptimizedHero: React.FC = () => {
  const router = useRouter();
  const { trackStep } = useConversionTracking();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartFree = (): void => {
    trackStep('cta_click', 'Start free clicked', { location: 'UXOptimizedHero' });
    router.push('/register');
  };

  const handleViewDemo = (): void => {
    trackStep('demo_click', 'View demo clicked', { location: 'UXOptimizedHero' });
    router.push('/demo');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
        <div className="inline-flex items-center bg-gradient-to-r from-[#FFE500] to-[#F7931A] text-black px-6 py-3 rounded-full text-sm font-bold shadow-lg animate-pulse mb-8">
          <Clock className="h-4 w-4 mr-2" />
          Offre limitée : {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </div>

        <div className="flex justify-center mb-8">
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="DazNode"
            width={280}
            height={110}
            className="h-20 md:h-28 w-auto object-contain"
            priority
          />
        </div>

        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            L&apos;IA qui surveille vos{' '}
            <span className="bg-gradient-to-r from-[#F7931A] to-[#FFE500] text-transparent bg-clip-text">
              canaux Lightning
            </span>{' '}
            24/7
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Évitez les force-closes et maximisez vos revenus automatiquement. 
            <br className="hidden md:block" />
            <strong className="text-[#00D4AA]">Seule IA qui prédit les force-closes 6h en avance.</strong>
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#00D4AA]" />
              <span>2 ans d&apos;expérience en production</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#F7931A]" />
              <span>+500 node runners actifs</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#00D4AA]" />
              <span>99.9% de précision</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleStartFree}
            className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#F7931A] to-[#FFE500] text-black font-bold rounded-xl text-xl shadow-2xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <Zap className="h-6 w-6 mr-3" />
              Essai gratuit 7 jours
            </span>
          </button>
          
          <button
            onClick={handleViewDemo}
            className="inline-flex items-center px-10 py-5 border-2 border-[#00D4AA] text-[#00D4AA] font-bold rounded-xl text-xl hover:bg-[#00D4AA] hover:text-black transition-all duration-200"
          >
            <TrendingUp className="h-6 w-6 mr-3" />
            Voir la démo
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-[#F7931A] mb-2">50-200€</div>
            <div className="text-gray-300 text-sm">Revenus mensuels</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-[#00D4AA] mb-2">15-25%</div>
            <div className="text-gray-300 text-sm">ROI annuel</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-[#FFE500] mb-2">4-8 mois</div>
            <div className="text-gray-300 text-sm">Amortissement</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-[#00D4AA] mb-2">6h</div>
            <div className="text-gray-300 text-sm">Prédiction avance</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#00D4AA]/20 to-[#F7931A]/20 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-[#00D4AA] mr-3" />
            <h3 className="text-xl font-bold text-white">Garantie 30 jours satisfait ou remboursé</h3>
          </div>
          <p className="text-gray-300 text-lg">
            Si vous ne générez pas au moins <strong className="text-[#F7931A]">50€ de revenus</strong> dans vos 30 premiers jours, 
            nous vous remboursons intégralement.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="group text-[#F7931A] hover:text-[#FFE500] transition-all duration-300 flex flex-col items-center cursor-pointer"
               onClick={() => document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="text-sm font-medium mb-2">Découvrir le problème</span>
            <div className="w-12 h-12 rounded-full bg-[#F7931A] text-black flex items-center justify-center group-hover:bg-[#FFE500] transition-colors">
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

export default UXOptimizedHero; 