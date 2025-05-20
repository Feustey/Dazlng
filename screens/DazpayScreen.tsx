import React from 'react';

export default function DazpayScreen() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 bg-primary">
        <h1 className="text-3xl font-bold text-white mb-2">DazPay</h1>
        <p className="text-base text-gray-100">Solution de paiement Lightning pour les commerces</p>
      </div>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-xl p-6 mb-8 flex flex-wrap gap-6">
          <StatItem label="Transactions (24h)" value="42" />
          <StatItem label="Volume (24h)" value="123 456 sats" />
          <StatItem label="Commission moyenne" value="0.5%" />
          <StatItem label="Temps moyen" value="2.3s" />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Fonctionnalités</h2>
          <div className="space-y-2">
            <FeatureItem text="Terminal de paiement web" />
            <FeatureItem text="Application mobile (bientôt)" />
            <FeatureItem text="Tableau de bord détaillé" />
            <FeatureItem text="Intégration API" />
            <FeatureItem text="Support multidevises" />
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Offres</h2>
          <div className="flex flex-col md:flex-row gap-6 mt-2">
            <div className="flex-1 bg-gray-800 rounded-lg p-4 flex flex-col items-center">
              <div className="text-lg font-bold text-white mb-2">Basic</div>
              <div className="text-base text-white mb-1">Gratuit</div>
              <div className="text-sm text-gray-300">1% de commission</div>
            </div>
            <div className="flex-1 bg-primary rounded-lg p-4 flex flex-col items-center">
              <div className="text-lg font-bold text-white mb-2">Premium</div>
              <div className="text-base text-white mb-1">30 000 sats/mois</div>
              <div className="text-sm text-gray-100">0.5% de commission</div>
            </div>
          </div>
        </div>
        <button className="w-full bg-primary rounded-lg p-4 text-lg font-semibold text-white mt-4 hover:bg-primary/90 transition">
          Passer Premium
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

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center">
      <span className="text-base text-gray-300">• {text}</span>
    </div>
  );
} 