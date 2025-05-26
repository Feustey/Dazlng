import React from 'react';
import { useRouter } from 'next/navigation';

const TechnicalCTA: React.FC = () => {
  const router = useRouter();

  const handleStartTrial = (): void => {
    router.push('/register');
  };

  const handleViewDemo = (): void => {
    router.push('/daznode/demo');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Urgence technique */}
        <div className="bg-red-800/50 border border-red-500/50 rounded-xl p-6 mb-8" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4">
            ⚠️ Votre prochain force-close vous coûtera combien ?
          </h2>
          <p className="text-xl text-red-200 mb-4">
            Force-close moyen : <strong>45,000 sats</strong> • 
            Downtime : <strong>6-12h</strong> • 
            Réputation : <strong>Dégradée</strong>
          </p>
          <div className="bg-black/30 p-4 rounded font-mono text-left text-sm">
            <div className="text-red-400">💀 [ERROR] Channel force-closed by peer</div>
            <div className="text-yellow-400">⏰ [WAIT] Timelock: 144 blocks (~24h)</div>
            <div className="text-red-400">💸 [COST] On-chain fees: 45,000 sats</div>
            <div className="text-gray-400">😴 [YOU] Sleeping peacefully...</div>
          </div>
        </div>

        {/* Solution */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-2xl font-bold mb-4">
            Notre IA aurait détecté et résolu le problème 6h avant
          </h3>
          <div className="bg-green-800/50 border border-green-500/50 rounded-xl p-4">
            <div className="bg-black/30 p-4 rounded font-mono text-left text-sm">
              <div className="text-yellow-400">🤖 [DAZNODE] HTLC timeout pattern detected</div>
              <div className="text-blue-400">🔄 [AUTO] Initiating circular rebalancing</div>
              <div className="text-green-400">✅ [SUCCESS] Channel rebalanced, force-close avoided</div>
              <div className="text-green-400">💰 [SAVED] 45,000 sats + reputation intact</div>
            </div>
          </div>
        </div>

        {/* Offre limitée */}
        <div className="bg-yellow-900/50 border border-yellow-500/50 rounded-xl p-6 mb-8" data-aos="fade-up" data-aos-delay="400">
          <h3 className="text-xl font-bold text-yellow-300 mb-2">
            🚀 Offre de lancement : 7 jours gratuits
          </h3>
          <p className="text-yellow-100">
            Testez notre IA sur vos vrais canaux • Aucun risque • Annulation en 1 clic
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8" data-aos="fade-up" data-aos-delay="600">
          <button 
            onClick={handleStartTrial}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold px-8 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all rounded-xl"
          >
            Protéger mes canaux maintenant
          </button>
          
          <button 
            onClick={handleViewDemo}
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg bg-transparent rounded-xl font-bold transition-all"
          >
            Voir l'IA en action
          </button>
        </div>

        {/* Garanties techniques */}
        <div className="grid md:grid-cols-3 gap-6 text-sm" data-aos="fade-up" data-aos-delay="800">
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="text-green-400 font-bold mb-1">🔒 Sécurité</div>
            <div>Aucun accès à vos clés privées</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="text-blue-400 font-bold mb-1">⚡ Performance</div>
            <div>Latence &lt; 100ms sur toutes les actions</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="text-purple-400 font-bold mb-1">🤖 IA</div>
            <div>Modèle entraîné sur 2 ans de données Lightning</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalCTA; 