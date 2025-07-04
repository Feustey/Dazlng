'use client';

import React, { useState, useMemo } from 'react';

export interface ROICalculation {
  monthlySavings: number;
  yearlySavings: number;
  planCostPerYear: number;
  netSavings: number;
  roi: number;
  breakEvenMonths: number;
}

interface LightningROICalculatorProps {
  className?: string;
  onCalculationChange?: (calculation: ROICalculation) => void;
}

export const LightningROICalculator: React.FC<LightningROICalculatorProps> = ({ 
  className = '', 
  onCalculationChange 
}) => {
  const [nodeCapacity, setNodeCapacity] = useState<number>(5); // BTC
  const [monthlyForceClosed, setMonthlyForceClosed] = useState<number>(2);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [currentMonthlyFees, setCurrentMonthlyFees] = useState<number>(25000); // sats
  
  const planCosts = {
    starter: 50500, // 50k sats + 1% commission
    pro: 151500,    // 150k sats + 1% commission  
    enterprise: 404000 // 400k sats + 1% commission
  };

  const planFeatures = {
    starter: ['Monitoring IA 24/7', 'Prédiction force-close', '1 node'],
    pro: ['Tout Starter +', 'Routing optimisé', 'DazBox incluse', '3 nodes'],
    enterprise: ['Tout Pro +', 'Nodes illimités', 'API complète', 'Support 24/7']
  };
  
  const calculateSavings = useMemo(() => {
    const averageForceCloseCost = 10000; // sats (coût moyen d'un force-close)
    const preventionRate = 0.85; // 85% de prévention grâce à l'IA
    const routingOptimization = selectedPlan === 'starter' ? 1.15 : selectedPlan === 'pro' ? 1.4 : 1.6; // Amélioration des revenus
    
    // Économies sur force-closes
    const forceCloseSavings = monthlyForceClosed * averageForceCloseCost * preventionRate;
    
    // Revenus additionnels via optimisation
    const additionalRevenue = selectedPlan === 'starter' ? 0 : currentMonthlyFees * (routingOptimization - 1);
    
    const totalMonthlySavings = forceCloseSavings + additionalRevenue;
    const yearlySavings = totalMonthlySavings * 12;
    const planCostPerYear = planCosts[selectedPlan] * 12;
    const netSavings = yearlySavings - planCostPerYear;
    const roi = planCostPerYear > 0 ? (netSavings / planCostPerYear) * 100 : 0;
    const breakEvenMonths = totalMonthlySavings > 0 ? Math.ceil(planCosts[selectedPlan] / totalMonthlySavings) : 999;
    
    const calculation: ROICalculation = {
      monthlySavings: totalMonthlySavings,
      yearlySavings,
      planCostPerYear,
      netSavings,
      roi,
      breakEvenMonths
    };

    // Notify parent component
    if (onCalculationChange) {
      onCalculationChange(calculation);
    }

    return calculation;
  }, [nodeCapacity, monthlyForceClosed, selectedPlan, currentMonthlyFees, onCalculationChange]);
  
  const formatSats = (sats: number): string => {
    if (sats >= 1000000) return `${(sats / 1000000).toFixed(1)}M sats`;
    if (sats >= 1000) return `${(sats / 1000).toFixed(0)}k sats`;
    return `${sats.toFixed(0)} sats`;
  };

  const formatBTC = (sats: number): string => {
    return `₿${(sats / 100000000).toFixed(4)}`;
  };

  const handleStartTrial = () => {
    // Track ROI calculator conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'roi_calculator_conversion', {
        event_category: 'funnel',
        plan: selectedPlan,
        projected_roi: calculateSavings.roi.toFixed(0),
        break_even_months: calculateSavings.breakEvenMonths
      });
    }

    // Redirect to signup with pre-filled plan
    window.location.href = `/register?plan=${selectedPlan}&roi=${calculateSavings.roi.toFixed(0)}`;
  };
  
  return (
    <div id="roi-calculator" className={`roi-calculator lightning-themed bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-yellow-400 rounded-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-2">{t('LightningROICalculator._calculez_vos_conomies_lightni')}</h3>
        <p className="text-gray-400">
          Découvrez combien DazNode peut vous faire économiser en force-closes évités et revenus optimisés
        </p>
      </div>
      
      <div className="calculator-inputs grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="input-group">
          <label className="block text-yellow-400 font-semibold mb-2">
            Capacité totale de vos nodes (BTC)
          </label>
          <input 
            type="number" 
            value={nodeCapacity}
            onChange={(e) => setNodeCapacity(Number(e.target.value))}
            min="0.1"
            step="0.1"
            className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg font-mono focus:border-yellow-400 focus:outline-none"
          />
          <small className="text-gray-500 mt-1 block">
            Capacité totale de tous vos canaux Lightning
          </small>
        </div>
        
        <div className="input-group">
          <label className="block text-yellow-400 font-semibold mb-2">
            Force-closes par mois (moyenne)
          </label>
          <input 
            type="number" 
            value={monthlyForceClosed}
            onChange={(e) => setMonthlyForceClosed(Number(e.target.value))}
            min="0"
            step="1"
            className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg font-mono focus:border-yellow-400 focus:outline-none"
          />
          <small className="text-gray-500 mt-1 block">
            Nombre moyen de force-closes subis par mois
          </small>
        </div>

        <div className="input-group">
          <label className="block text-yellow-400 font-semibold mb-2">
            Revenus routing actuels (sats/mois)
          </label>
          <input 
            type="number" 
            value={currentMonthlyFees}
            onChange={(e) => setCurrentMonthlyFees(Number(e.target.value))}
            min="0"
            step="1000"
            className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg font-mono focus:border-yellow-400 focus:outline-none"
          />
          <small className="text-gray-500 mt-1 block">
            Vos revenus de routing actuels par mois
          </small>
        </div>
        
        <div className="input-group">
          <label className="block text-yellow-400 font-semibold mb-2">
            Plan DazNode
          </label>
          <select 
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value as any)}
            className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-yellow-400 focus:outline-none"
          >
            <option value="starter">{t('LightningROICalculator.starter_50k_satsmois')}</option>
            <option value="pro">{t('LightningROICalculator.pro_150k_satsmois')}</option>
            <option value="enterprise">{t('LightningROICalculator.enterprise_400k_satsmois')}</option>
          </select>
          <div className="mt-2">
            <small className="text-gray-500">{t('LightningROICalculator.inclus')}</small>
            <ul className="text-xs text-gray-400 mt-1">
              {planFeatures[selectedPlan].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-400 mr-1">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="results-section grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="result-card bg-gradient-to-br from-green-400/10 to-green-600/10 border border-green-400/20 rounded-xl p-6 text-center">
          <h4 className="text-green-400 font-semibold mb-2">{t('LightningROICalculator._conomies_totales')}</h4>
          <div className="big-number text-3xl font-bold text-green-400 font-mono mb-2">
            {formatSats(calculateSavings.yearlySavings)}
          </div>
          <div className="sub-text text-gray-400 text-sm">
            par an ({formatBTC(calculateSavings.yearlySavings)})
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Force-closes évités + revenus optimisés
          </div>
        </div>
        
        <div className="result-card bg-gradient-to-br from-orange-400/10 to-orange-600/10 border border-orange-400/20 rounded-xl p-6 text-center">
          <h4 className="text-orange-400 font-semibold mb-2">{t('LightningROICalculator._cot_daznode')}</h4>
          <div className="big-number text-3xl font-bold text-orange-400 font-mono mb-2">
            {formatSats(calculateSavings.planCostPerYear)}
          </div>
          <div className="sub-text text-gray-400 text-sm">
            par an ({formatBTC(calculateSavings.planCostPerYear)})
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Commission de 1% incluse
          </div>
        </div>
        
        <div className="result-card bg-gradient-to-br from-purple-400/10 to-purple-600/10 border border-purple-400/20 rounded-xl p-6 text-center">
          <h4 className="text-purple-400 font-semibold mb-2">{t('LightningROICalculator._profit_net')}</h4>
          <div className={`big-number text-3xl font-bold font-mono mb-2 ${calculateSavings.netSavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {calculateSavings.netSavings > 0 ? '+' : ''}{formatSats(calculateSavings.netSavings)}
          </div>
          <div className="sub-text text-gray-400 text-sm mb-2">
            ROI: {calculateSavings.roi > 0 ? '+' : ''}{calculateSavings.roi.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">
            Rentable en {calculateSavings.breakEvenMonths === 999 ? '∞' : calculateSavings.breakEvenMonths} mois
          </div>
        </div>
      </div>

      {/* Detailed breakdown */}
      <div className="breakdown-section bg-gray-800/50 rounded-xl p-6 mb-8">
        <h4 className="text-white font-semibold mb-4">{t('LightningROICalculator._dtail_des_conomies')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="text-gray-400">{t('LightningROICalculator.forcecloses_vitsmois')}</span>
            <span className="text-white font-mono">{(monthlyForceClosed * 0.85).toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="text-gray-400">{t('LightningROICalculator.conomies_forceclosesmois')}</span>
            <span className="text-green-400 font-mono">{formatSats(monthlyForceClosed * 10000 * 0.85)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="text-gray-400">{t('LightningROICalculator.optimisation_routing')}</span>
            <span className="text-yellow-400 font-mono">
              {selectedPlan === 'starter' ? '+15%' : selectedPlan === 'pro' ? '+40%' : '+60%'}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="text-gray-400">{t('LightningROICalculator.revenus_additionnelsmois')}</span>
            <span className="text-blue-400 font-mono">
              {selectedPlan === 'starter' ? '0 sats' : formatSats(currentMonthlyFees * (selectedPlan === 'pro' ? 0.4 : 0.6))}
            </span>
          </div>
        </div>
      </div>
      
      <div className="cta-section text-center">
        <div className="mb-4">
          <p className="assumption text-gray-400 text-sm mb-2">
            <strong>{t('LightningROICalculator.hypothses_de_calcul_')}</strong>
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>{t('LightningROICalculator._cot_moyen_dun_forceclose_10k_')}</li>
            <li>{t('LightningROICalculator._taux_de_prvention_ia_85')}</li>
            <li>{t('LightningROICalculator._optimisation_routing_15_start')}</li>
            <li>{t('LightningROICalculator._commission_daznode_1_du_prix_')}</li>
          </ul>
        </div>
        
        {calculateSavings.roi > 50 && (
          <div className="bg-green-400/10 border border-green-400 rounded-lg p-4 mb-6">
            <p className="text-green-400 font-semibold">
              🎯 ROI exceptionnel ! Avec un retour de {calculateSavings.roi.toFixed(0)}%, 
              DazNode se rentabilise en seulement {calculateSavings.breakEvenMonths} mois.
            </p>
          </div>
        )}

        <button 
          onClick={handleStartTrial}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:from-yellow-300 hover:to-orange-300 hover:shadow-xl hover:shadow-yellow-400/30 hover:transform hover:scale-105"
        >
          Commencer avec le plan {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
        </button>
        
        <p className="text-xs text-gray-500 mt-3">
          Essai gratuit 7 jours • Aucune carte bancaire requise
        </p>
      </div>
    </div>
  );
};