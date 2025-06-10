"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeftRight } from 'lucide-react';

interface ConversionRates {
  btc_to_usd: number;
  btc_to_eur: number;
  btc_to_gbp: number;
  btc_to_jpy: number;
  btc_to_cad: number;
  updated_at: string;
}

interface CalculationResult {
  amount: number;
  from_unit: string;
  to_unit: string;
  rate: number;
  converted_amount: number;
  rates: ConversionRates;
}

export function LightningCalculator() {
  const [amount, setAmount] = useState('1');
  const [fromUnit, setFromUnit] = useState('btc');
  const [toUnit, setToUnit] = useState('sats');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [rates, setRates] = useState<ConversionRates | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const units = [
    { value: 'btc', label: 'BTC', symbol: '₿' },
    { value: 'sats', label: 'Satoshis', symbol: 'sats' },
    { value: 'usd', label: 'USD', symbol: '$' },
    { value: 'eur', label: 'EUR', symbol: '€' },
    { value: 'gbp', label: 'GBP', symbol: '£' },
    { value: 'jpy', label: 'JPY', symbol: '¥' },
    { value: 'cad', label: 'CAD', symbol: 'C$' }
  ];

  // Charger les taux de change
  const loadRates = async () => {
    try {
      const response = await fetch('/api/lightning/calculator', {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        setRates(data.data);
        setLastUpdate(new Date(data.data.updated_at).toLocaleString('fr-FR'));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des taux:', error);
    }
  };

  // Effectuer le calcul
  const calculate = async () => {
    if (!amount || isNaN(parseFloat(amount))) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/lightning/calculator?amount=${amount}&from=${fromUnit}&to=${toUnit}`);
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setRates(data.data.rates);
        setLastUpdate(new Date(data.data.rates.updated_at).toLocaleString('fr-FR'));
      }
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les taux au montage
  useEffect(() => {
    loadRates();
    const interval = setInterval(loadRates, 30000); // Actualiser toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  // Recalculer quand les paramètres changent
  useEffect(() => {
    calculate();
  }, [amount, fromUnit, toUnit]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const formatNumber = (num: number, decimals: number = 8) => {
    if (num === 0) return '0';
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    } else if (num < 0.01) {
      return num.toExponential(2);
    }
    
    return num.toFixed(decimals).replace(/\.?0+$/, '');
  };

  const getUnitSymbol = (unit: string) => {
    return units.find(u => u.value === unit)?.symbol || unit;
  };



  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Calculateur Lightning</h2>
      </div>

      {/* Formulaire de conversion */}
      <div className="space-y-4">
        {/* Montant source */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Montant à convertir
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Entrez un montant"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton d'échange */}
        <div className="flex justify-center">
          <button
            onClick={swapUnits}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Inverser les unités"
          >
            <ArrowLeftRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Unité de destination */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Convertir vers
          </label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>

        {/* Résultat */}
        {result && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Résultat</p>
              <p className="text-2xl font-bold text-indigo-600">
                {formatNumber(result.converted_amount)} {getUnitSymbol(result.to_unit)}
              </p>
              {loading && (
                <div className="flex items-center justify-center mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                  <span className="ml-2 text-xs text-gray-500">Calcul en cours...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Taux de change actuels */}
      {rates && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Taux de change Bitcoin
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-50 rounded p-2">
              <span className="text-gray-600">USD:</span>
              <span className="font-medium ml-1">${formatNumber(rates.btc_to_usd, 2)}</span>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <span className="text-gray-600">EUR:</span>
              <span className="font-medium ml-1">€{formatNumber(rates.btc_to_eur, 2)}</span>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <span className="text-gray-600">GBP:</span>
              <span className="font-medium ml-1">£{formatNumber(rates.btc_to_gbp, 2)}</span>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <span className="text-gray-600">JPY:</span>
              <span className="font-medium ml-1">¥{formatNumber(rates.btc_to_jpy, 0)}</span>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <span className="text-gray-600">CAD:</span>
              <span className="font-medium ml-1">C${formatNumber(rates.btc_to_cad, 2)}</span>
            </div>
            <div className="bg-indigo-50 rounded p-2">
              <span className="text-gray-600">Satoshis:</span>
              <span className="font-medium ml-1">100M sats</span>
            </div>
          </div>
          
          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-3">
              Dernière mise à jour: {lastUpdate}
            </p>
          )}
        </div>
      )}

      {/* Informations sur les satoshis */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Qu'est-ce qu'un satoshi ?
        </h4>
        <p className="text-sm text-blue-700">
          Les satoshis (ou "sats") sont la plus petite unité de Bitcoin. 
          1 BTC = 100 000 000 satoshis. C'est un moyen pratique d'exprimer 
          des montants Bitcoin sans utiliser de décimales.
        </p>
      </div>

      {/* Conversions rapides */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Conversions rapides
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <button
            onClick={() => {
              setAmount('1');
              setFromUnit('btc');
              setToUnit('sats');
            }}
            className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            1 BTC → sats
          </button>
          <button
            onClick={() => {
              setAmount('100000');
              setFromUnit('sats');
              setToUnit('btc');
            }}
            className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            100K sats → BTC
          </button>
          <button
            onClick={() => {
              setAmount('1');
              setFromUnit('btc');
              setToUnit('usd');
            }}
            className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            1 BTC → USD
          </button>
          <button
            onClick={() => {
              setAmount('1000');
              setFromUnit('usd');
              setToUnit('sats');
            }}
            className="text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            $1000 → sats
          </button>
        </div>
      </div>
    </div>
  );
} 