'use client';

import React from 'react';
import { LightningROICalculator } from '@/components/lightning/LightningROICalculator';
import type { ROICalculation } from '@/components/lightning/LightningROICalculator';

export const IntegratedROICalculator: React.FC = () => {
  const handleCalculationChange = (calculation: ROICalculation) => {
    // Track ROI calculation event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'roi_calculated', {
        event_category: 'funnel',
        roi_percentage: calculation.roi.toFixed(0),
        yearly_savings: calculation.yearlySavings,
        break_even_months: calculation.breakEvenMonths,
        position: 'integrated_roi_calculator'
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            ⚡ Calculez Votre ROI Lightning
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez combien DazNode peut vous faire économiser en force-closes évités 
            et revenus optimisés. Notre IA prédit et prévient 85% des force-closes.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <LightningROICalculator 
            className="lightning-themed"
            onCalculationChange={handleCalculationChange}
          />
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-yellow-400 font-semibold text-lg mb-2">
              🎯 Pourquoi calculer votre ROI ?
            </h3>
            <p className="text-gray-300 text-sm">
              Un force-close coûte en moyenne 10k sats. Avec DazNode, vous évitez 85% des force-closes 
              et optimisez vos revenus de routing. La plupart de nos clients rentabilisent leur investissement 
              en moins de 3 mois.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}; 