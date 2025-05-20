import React from 'react';

export default function DazboxScreen(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 bg-primary">
        <h1 className="text-3xl font-bold text-white mb-2">DazBox</h1>
        <p className="text-base text-gray-100">Votre nœud Lightning clé en main</p>
      </div>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Caractéristiques</h2>
          <div className="space-y-2">
            <FeatureItem text="Processeur ARM 4 cœurs" />
            <FeatureItem text="8 Go de RAM" />
            <FeatureItem text="SSD 500 Go" />
            <FeatureItem text="Connexion Ethernet Gigabit" />
            <FeatureItem text="Alimentation USB-C" />
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Inclus</h2>
          <div className="space-y-2">
            <FeatureItem text="Node Lightning préconfiguré" />
            <FeatureItem text="3 mois d'abonnement DazNode Premium" />
            <FeatureItem text="Support technique prioritaire" />
            <FeatureItem text="Garantie 2 ans" />
          </div>
        </div>
        <button className="w-full bg-primary rounded-lg p-4 text-lg font-semibold text-white mt-4 hover:bg-primary/90 transition">
          Commander - 290 000 sats
        </button>
      </div>
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