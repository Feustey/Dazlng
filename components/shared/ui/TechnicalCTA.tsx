import React from 'react';
import { useRouter } from 'next/navigation';

const TechnicalCTA: React.FC = () => {
  const router = useRouter();

  const handleStartTrial = () => {
    router.push('/register');
  };

  const handleViewDemo = () => {
    router.push('/demo');
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
            Force-close moyen : <strong>{t('TechnicalCTA.45000_sats')}</strong> • 
            Downtime : <strong>{t('TechnicalCTA.612h')}</strong> • 
            Réputation : <strong>{t('TechnicalCTA.dgrade')}</strong>
          </p>
          <div className="bg-black/30 p-4 rounded font-mono text-left text-sm">
            <div className="text-red-400">{t('TechnicalCTA._error_channel_forceclosed_by_')}</div>
            <div className="text-yellow-400">{t('TechnicalCTA._wait_timelock_144_blocks_24h')}</div>
            <div className="text-red-400">{t('TechnicalCTA._cost_onchain_fees_45000_sats')}</div>
            <div className="text-gray-400">{t('TechnicalCTA._you_sleeping_peacefully')}</div>
          </div>
        </div>

        {/* Solution */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-2xl font-bold mb-4">
            Notre IA aurait détecté et résolu le problème 6h avant
          </h3>
          <div className="bg-green-800/50 border border-green-500/50 rounded-xl p-4">
            <div className="bg-black/30 p-4 rounded font-mono text-left text-sm">
              <div className="text-yellow-400">{t('TechnicalCTA._daznode_htlc_timeout_pattern_')}</div>
              <div className="text-blue-400">{t('TechnicalCTA._auto_initiating_circular_reba')}</div>
              <div className="text-green-400">{t('TechnicalCTA._success_channel_rebalanced_fo')}</div>
              <div className="text-green-400">{t('TechnicalCTA._saved_45000_sats_reputation_i')}</div>
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
            <div className="text-green-400 font-bold mb-1">{t('TechnicalCTA._scurit')}</div>
            <div>{t('TechnicalCTA.aucun_accs_vos_cls_prives')}</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="text-blue-400 font-bold mb-1">{t('TechnicalCTA._performance')}</div>
            <div>{t('TechnicalCTA.latence_lt_100ms_sur_toutes_le')}</div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="text-purple-400 font-bold mb-1">{t('TechnicalCTA._ia')}</div>
            <div>{t('TechnicalCTA.modle_entran_sur_2_ans_de_donn')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalCTA; 