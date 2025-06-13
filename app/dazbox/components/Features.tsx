'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useConversionTracking } from '../../../hooks/useConversionTracking';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
  stats?: string;
}

const DazBoxFeatures: React.FC = (): React.ReactElement => {
  const { trackProductInterest } = useConversionTracking();
  const [visibleFeatures, setVisibleFeatures] = useState<Set<string>>(new Set());
  const featuresRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      id: 'plug-play',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Installation Plug & Play',
      description: 'Branchez votre DazBox, elle se configure automatiquement. Aucune compétence technique requise.',
      benefit: 'Prêt en 5 minutes',
      stats: '95% de nos utilisateurs sont opérationnels en moins de 10 minutes'
    },
    {
      id: 'passive-income',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: 'Revenus Passifs Garantis',
      description: 'Votre DazBox génère des revenus automatiquement grâce au routage des paiements Lightning.',
      benefit: 'Jusqu\'à 15% APY',
      stats: 'Revenus moyens: 50-200Sats/mois selon votre configuration'
    },
    {
      id: 'auto-updates',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: 'Mises à Jour Automatiques',
      description: 'Votre nœud reste toujours à jour avec les dernières améliorations et correctifs de sécurité.',
      benefit: 'Zéro maintenance',
      stats: 'Mises à jour silencieuses 24/7 sans interruption de service'
    },
    {
      id: 'monitoring',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Monitoring Intelligent',
      description: 'Surveillance 24/7 de votre nœud avec alertes en temps réel et optimisation automatique.',
      benefit: '99.9% uptime',
      stats: 'Détection et résolution automatique de 99% des problèmes'
    },
    {
      id: 'support',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
        </svg>
      ),
      title: 'Support Expert 24/7',
      description: 'Notre équipe d\'experts Lightning est disponible 24/7 pour vous accompagner.',
      benefit: 'Support humain',
      stats: 'Temps de réponse moyen: 5 minutes'
    },
    {
      id: 'security',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Sécurité Maximale',
      description: 'Chiffrement de niveau militaire et architecture sécurisée pour protéger vos fonds.',
      benefit: 'Audit de sécurité',
      stats: 'Conforme aux standards de sécurité Bitcoin Core'
    }
  ];

  // Intersection Observer pour les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureId = entry.target.getAttribute('data-feature-id');
            if (featureId) {
              setVisibleFeatures(prev => new Set([...prev, featureId]));
              trackProductInterest('dazbox', 'feature_view', { 
                feature: featureId 
              });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const featureElements = featuresRef.current?.querySelectorAll('[data-feature-id]');
    featureElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [trackProductInterest]);

  const handleFeatureClick = (featureId: string): void => {
    trackProductInterest('dazbox', 'feature_interaction', { 
      feature: featureId,
      action: 'click'
    });
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi Choisir{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              DazBox ?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DazBox révolutionne l'accès au Lightning Network avec une solution 
            simple, sécurisée et rentable pour tous.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              data-feature-id={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              className={`
                group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl 
                transform transition-all duration-700 cursor-pointer
                hover:scale-105 border border-gray-100
                ${visibleFeatures.has(feature.id) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
                }
              `}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefit Badge */}
                <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature.benefit}
                </div>

                {/* Stats */}
                {feature.stats && (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700 font-medium">
                      📊 {feature.stats}
                    </p>
                  </div>
                )}
              </div>

              {/* Hover indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          ))}
        </div>

  
      </div>
    </section>
  );
};

export default DazBoxFeatures; 