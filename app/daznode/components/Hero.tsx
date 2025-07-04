'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useConversionTracking } from '../../../hooks/useConversionTracking';

const DazNodeHero: React.FC = () => {
  const router = useRouter();
  const { trackProductInterest } = useConversionTracking();

  const handleStartProfessional = (): void => {
    trackProductInterest('daznode', 'hero_cta', { action: 'start_professional' });
    router.push('/checkout/daznode?plan=professional');
  };

  const handleLearnMore = (): void => {
    trackProductInterest('daznode', 'hero_cta', { action: 'learn_more' });
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewDemo = (): void => {
    trackProductInterest('daznode', 'hero_cta', { action: 'view_demo' });
    router.push('/demo');
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.svg')] bg-center bg-repeat opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Contenu texte */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Badge professionnel */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-blue-100 text-sm font-medium border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            Solution Professionnelle Lightning Network
          </div>

          {/* Titre principal */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              DazNode
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text">
                IA + Analytics
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl lg:max-w-none">
              Optimisez vos nœuds Lightning avec notre{' '}
              <span className="font-bold text-cyan-300">
                Intelligence Artificielle avancée
              </span>
              . Analytics temps réel, optimisation des canaux et revenus maximisés.
            </p>
          </div>

          {/* Métriques clés */}
          <div className="grid sm:grid-cols-3 gap-6 text-center lg:text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-cyan-300 mb-2">+40%</div>
              <div className="text-blue-100 text-sm">{t('Hero.revenus_optimiss')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-green-300 mb-2">99.98%</div>
              <div className="text-blue-100 text-sm">{t('Hero.uptime_garanti')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-purple-300 mb-2">24/7</div>
              <div className="text-blue-100 text-sm">{t('Hero.ia_monitoring')}</div>
            </div>
          </div>

          {/* Points clés techniques */}
          <div className="space-y-4 text-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">{t('Hero.optimisation_ia_des_routes_de_')}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">{t('Hero.analytics_predictives_et_alert')}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">{t('Hero.gestion_multinuds_avec_api_com')}</span>
            </div>
          </div>

          {/* Call-to-Action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              onClick={handleStartProfessional}
              className="group bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Commencer</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button 
              onClick={handleViewDemo}
              className="border-2 border-cyan-300 text-cyan-300 hover:bg-cyan-300 hover:text-gray-900 px-8 py-4 text-lg bg-transparent rounded-xl font-bold transition-all duration-300"
            >
              Voir la Démo Live
            </button>
          </div>

          {/* Garanties professionnelles */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t('Hero.sla_9998_avec_compensation')}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t('Hero.support_prioritaire_247')}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t('Hero.audit_de_scurit_inclus')}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t('Hero.conformit_rglementaire')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="relative mx-auto max-w-lg lg:max-w-none">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-3xl blur-3xl opacity-30 scale-110"></div>
            
            {/* Dashboard mock */}
            <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <Image
                src="/assets/images/dashboard-daznode.png"
                alt="Hero.heroherodaznode_dashboard_inte"
                width={500}
                height={400}
                className="w-full h-auto object-cover rounded-2xl"
                priority
              />
              
              {/* Floating metrics */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                +40% ROI
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                IA Active
              </div>
              
              <div className="absolute top-1/2 -left-6 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform -rotate-12">
                Analytics Live
              </div>
            </div>

            {/* Demo overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button 
                onClick={handleViewDemo}
                className="group bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full p-6 transition-all duration-300 hover:scale-110 border border-white/20"
              >
                <svg className="w-12 h-12 text-white group-hover:text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={handleLearnMore}
          className="group text-cyan-300 hover:text-cyan-200 transition-all duration-300 flex flex-col items-center"
        >
          <span className="text-sm font-medium mb-2">{t('Hero.dcouvrir_les_fonctionnalits')}</span>
          <div className="w-12 h-12 rounded-full border-2 border-cyan-300 text-cyan-300 flex items-center justify-center group-hover:border-cyan-200 group-hover:text-cyan-200 transition-colors">
            <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>

      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default DazNodeHero; export const dynamic = "force-dynamic";
