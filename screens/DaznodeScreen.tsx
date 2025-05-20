import React from 'react';

export default function DaznodeScreen(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 bg-primary">
        <h1 className="text-3xl font-bold text-white mb-2">DazNode</h1>
        <p className="text-base text-gray-100">Pilotez votre nœud Lightning avec l'IA</p>
      </div>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-xl p-6 mb-8 flex flex-wrap gap-6">
          <StatItem label="Balance" value="1 234 567 sats" />
          <StatItem label="Canaux actifs" value="42" />
          <StatItem label="Capacité totale" value="50M sats" />
          <StatItem label="Revenus (30j)" value="12 345 sats" />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Fonctionnalités Premium</h2>
          <div className="space-y-2">
            <FeatureItem text="Routage optimisé par IA" />
            <FeatureItem text="Intégration Amboss" />
            <FeatureItem text="Alertes Telegram" />
            <FeatureItem text="Rééquilibrage automatique" />
            <FeatureItem text="Support prioritaire" />
          </div>
        </div>
        <button className="w-full bg-primary rounded-lg p-4 text-lg font-semibold text-white mt-4 hover:bg-primary/90 transition">
          Passer Premium - 30 000 sats/mois
        </button>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-[150px]">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }): React.ReactElement {
  return (
    <div className="flex items-center">
      <span className="text-base text-gray-300">• {text}</span>
    </div>
  );
} 