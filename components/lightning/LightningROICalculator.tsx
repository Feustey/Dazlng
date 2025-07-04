"use client";

import React, { useState, useMemo } from "react";

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
  className = "",
  onCalculationChange 
}) => {
  const [nodeCapacity, setNodeCapacity] = useState<number>(5); // BTC
  const [monthlyForceClosed, setMonthlyForceClosed] = useState<number>(2);
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "enterprise">("pro");
  const [currentMonthlyFees, setCurrentMonthlyFees] = useState<number>(25000); // sats
  
  const planCosts = {
    starter: 5050.0, // 50k sats + 1% commission
    pro: 15150.0,    // 150k sats + 1% commission  
    enterprise: 404000 // 400k sats + 1% commission
  };

  const planFeatures = {
    starter: ["Monitoring IA 24/7", "Prédiction force-close", "1 node"],
    pro: ["Tout Starter +", "Routing optimisé", "DazBox incluse", "3 nodes"],
    enterprise: ["Tout Pro +", "Nodes illimités", "API complète", "Support 24/7"]
  };
  
  const calculateSavings = useMemo(() => {
    const averageForceCloseCost = 10000; // sats (coût moyen d'un force-close)
    const preventionRate = 0.85; // 85% de prévention grâce à l'IA
    const routingOptimization = selectedPlan === "starter" ? 1.15 : selectedPlan === "pro" ? 1.4 : 1.6; // Amélioration des revenus
    
    // Économies sur force-closes
    const forceCloseSavings = monthlyForceClosed * averageForceCloseCost * preventionRate;
    
    // Revenus additionnels via optimisation
    const additionalRevenue = selectedPlan === "starter" ? 0 : currentMonthlyFees * (routingOptimization - 1);
    
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
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "roi_calculator_conversion", {
        event_category: "funnel",
        plan: selectedPlan,
        projected_roi: calculateSavings.roi.toFixed(0),
        break_even_months: calculateSavings.breakEvenMonths
      });
    }

    // Redirect to signup with pre-filled plan
    window.location.href = `/register?plan=${selectedPlan}&roi=${calculateSavings.roi.toFixed(0)}`;
  };
  
  return (
    <div className={className}>
      <div>
        <h3 className="text-3xl font-bold text-white mb-2">⚡ Calculez vos économies Lightning</h3>
        <p>
          Découvrez combien DazNode peut vous faire économiser en force-closes évités et revenus optimisés
        </p>
      </div>
      
      <div>
        <div>
          <label>
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
          <small>
            Capacité totale de tous vos canaux Lightning
          </small>
        </div>
        
        <div>
          <label>
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
          <small>
            Nombre moyen de force-closes subis par mois
          </small>
        </div>

        <div>
          <label>
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
          <small>
            Vos revenus de routing actuels par mois
          </small>
        </div>
        
        <div>
          <label>
            Plan DazNode
          </label>
          <select 
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value as any)}
            className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-yellow-400 focus:outline-none"
          >
            <option value="starter">Starter - 50k sats/mois</option>
            <option value="pro">Pro - 150k sats/mois</option>
            <option value="enterprise">Enterprise - 400k sats/mois</option>
          </select>
          <div>
            <small className="text-gray-500">Inclus :</small>
            <ul>
              {planFeatures[selectedPlan].map((feature, index) => (
                <li key={index}>
                  <span className="text-green-400 mr-1">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div>
        <div>
          <h4 className="text-green-400 font-semibold mb-2">💰 Économies totales</h4>
          <div>
            {formatSats(calculateSavings.yearlySavings)}
          </div>
          <div>
            par an ({formatBTC(calculateSavings.yearlySavings)})
          </div>
          <div>
            Force-closes évités + revenus optimisés
          </div>
        </div>
        
        <div>
          <h4 className="text-orange-400 font-semibold mb-2">💸 Coût DazNode</h4>
          <div>
            {formatSats(calculateSavings.planCostPerYear)}
          </div>
          <div>
            par an ({formatBTC(calculateSavings.planCostPerYear)})
          </div>
          <div>
            Commission de 1% incluse
          </div>
        </div>
        
        <div>
          <h4 className="text-blue-400 font-semibold mb-2">📈 ROI Net</h4>
          <div>
            {calculateSavings.roi.toFixed(0)}%
          </div>
          <div>
            Rentabilisation en {calculateSavings.breakEvenMonths} mois
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleStartTrial}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
      >
        Commencer l'essai gratuit
      </button>
    </div>
  );
};