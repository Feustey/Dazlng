'use client';

import React from 'react';
import { OptimizedHero } from '@/components/optimized/OptimizedHero';
import { LightningPricingSection } from '@/components/lightning/SatsPricingCard';
import { LightningROICalculator } from '@/components/lightning/LightningROICalculator';
import { SocialProofSection } from '@/components/lightning/LiveMetrics';
import { LiveChannelMonitor } from '@/components/lightning/LiveChannelMonitor';
import { ProofOfPerformance, LightningAnalyticsDashboard } from '@/components/lightning/ProofOfPerformance';
import { MobileOptimizedPricing, MobileHero } from '@/components/mobile/MobileOptimized';

export const dynamic = 'force-dynamic';
export default function OptimizedDemoPage() {
  return (
    <div className="optimized-demo min-h-screen bg-gray-950">
      
      {/* Desktop Hero */}
      <div className="hidden md:block">
        <OptimizedHero variant="demo" />
      </div>

      {/* Mobile Hero */}
      <MobileHero />

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* Live Channel Monitor Demo */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Monitoring IA en Action
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Démonstration live de notre système de monitoring intelligent des canaux Lightning.
              Données mises à jour en temps réel.
            </p>
          </div>
          
          <LiveChannelMonitor isDemo={true} maxChannels={4} />
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LightningROICalculator 
            onCalculationChange={(calculation) => {
              // Track calculator usage
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'roi_calculator_used', {
                  event_category: 'engagement',
                  roi_percentage: calculation.roi.toFixed(0),
                  break_even_months: calculation.breakEvenMonths
                });
              }
            }}
          />
        </div>
      </section>

      {/* Pricing Section */}
      <LightningPricingSection />

      {/* Mobile Pricing */}
      <MobileOptimizedPricing />

      {/* Proof of Performance */}
      <ProofOfPerformance />

      {/* Lightning Analytics */}
      <LightningAnalyticsDashboard />

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à Optimiser Vos Revenus Lightning ?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Rejoignez les 500+ node runners qui utilisent l'IA DazNode pour 
              maximiser leurs revenus et éviter les force-closes coûteux.
            </p>
          </div>

          {/* Final CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => window.location.href = '/register?plan=pro&trial=7days'}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:from-yellow-300 hover:to-orange-300 hover:shadow-xl hover:shadow-yellow-400/30 hover:transform hover:scale-105"
            >
              ⚡ Commencer l'Essai Gratuit
            </button>

            <button
              onClick={() => window.open('https://demo.dazno.de', '_blank')}
              className="border-2 border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
            >
              Voir la Démo Live
            </button>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t('common.7_jours_gratuits')}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t('common.aucune_carte_bancaire')}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t('common.configuration_en_5_minutes')}</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 p-6 bg-gray-800/30 rounded-2xl">
            <div className="flex items-center justify-center space-x-8 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">500+</div>
                <div className="text-xs text-gray-400">{t('home.node_runners')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">₿47.3</div>
                <div className="text-xs text-gray-400">{t('common.sous_gestion')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">99.7%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">87%</div>
                <div className="text-xs text-gray-400">{t('common.prcision_ia')}</div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              "DazNode m'a fait économiser 0.2 BTC en frais de force-close cette année" 
              - Node Runner anonyme
            </p>
          </div>
        </div>
      </section>

      {/* Footer with additional links */}
      <footer className="bg-gray-950 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <span className="text-white font-bold text-xl">DazNode</span>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>{t('common.systme_oprationnel')}</span>
              </div>
            </div>

            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Confidentialité
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Conditions
              </a>
              <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}