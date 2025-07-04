"use client";

import React from "react";
import { LightningROICalculator } from "@/components/lightning/LightningROICalculator";
import type { ROICalculation } from "@/components/lightning/LightningROICalculator";

export const IntegratedROICalculator: React.FC = () => {
  const handleCalculationChange = (calculation: ROICalculation) => {
    // Track ROI calculation event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "roi_calculated", {
        event_category: "funnel",
        roi_percentage: calculation.roi.toFixed(0),
        yearly_savings: calculation.yearlySavings,
        break_even_months: calculation.breakEvenMonths,
        position: "integrated_roi_calculator"
      });
    }
  };

  return (
    <section>
      <div>
        <div>
          <h2>
            ⚡ Calculez Votre ROI Lightning
          </h2>
          <p>
            Découvrez combien DazNode peut vous faire économiser en force-closes évités 
            et revenus optimisés. Notre IA prédit et prévient 85% des force-closes.
          </p>
        </div>
        
        <div>
          <LightningROICalculator />
        </div>
        
        <div>
          <div>
            <h3>
              🎯 Pourquoi calculer votre ROI ?
            </h3>
            <p>
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