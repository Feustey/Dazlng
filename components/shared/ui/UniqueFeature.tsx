import React from 'react';

export function UniqueFeature(): React.FC {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">
          La seule IA qui prédit les problèmes Lightning
        </h2>
        
        <div className="bg-green-900/30 p-8 rounded-2xl border border-green-500/30 mb-8">
          <h3 className="text-2xl font-bold text-green-300 mb-4">
            🔮 Prédiction Force-Close
          </h3>
          <p className="text-xl mb-4">
            Notre algorithme analyse 47 métriques en temps réel et prédit 
            les force-closes <strong>6 heures avant qu'ils arrivent</strong>
          </p>
          <div className="bg-black/50 p-4 rounded font-mono text-left">
            <div className="text-yellow-400">⚠️  PREDICTION: Force-close risk 89% in 5.2h</div>
            <div className="text-blue-400">🤖 ANALYSIS: HTLC timeout pattern detected</div>
            <div className="text-green-400">✅ ACTION: Auto-rebalancing initiated</div>
            <div className="text-green-400">✅ RESULT: Force-close avoided, 45k sats saved</div>
          </div>
        </div>

        <p className="text-xl text-gray-300">
          <strong>Personne d'autre ne fait ça.</strong> Ni Umbrel, ni Voltage, ni BTCPay.
          <br />
          Vous êtes les premiers à avoir une vraie IA Lightning.
        </p>
      </div>
    </section>
};
}
