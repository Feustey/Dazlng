import React from 'react';
import { useRouter } from 'next/navigation';

const FinalConversionCTA: React.FC = () => {
  const router = useRouter();

  const guarantees = [
    "Configuration complète de votre nœud Lightning",
    "Premier canal ouvert avec liquidité",
    "Monitoring IA activé et optimisé",
    "Formation privée Discord incluse",
    "Support prioritaire 24/7",
    "Dashboard analytics personnalisé"
  ];

  const handleOrderDazBox = (): void => {
    router.push('/checkout/dazbox');
  };

  const handleJoinCommunity = (): void => {
    window.open('https://discord.gg/daznode', '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Prêt à transformer votre épargne en{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text">
              revenus actifs ?
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Rejoignez les 847 node runners qui génèrent déjà des revenus avec DazNode
          </p>
        </div>

        {/* Ce qui vous attend */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
          <h3 className="text-2xl font-bold mb-8 text-yellow-300">
            Ce qui vous attend dans les 30 premiers jours :
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {guarantees.map((guarantee: any, index: any) => (
              <div key={index} className="flex items-center text-left">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white text-lg">{guarantee}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Garantie */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded-2xl p-8 mb-12 border border-yellow-400/50">
          <h3 className="text-3xl font-bold mb-4 text-yellow-300">
            🛡️ Garantie 30 jours satisfait ou remboursé
          </h3>
          <p className="text-xl text-yellow-100">
            Si vous ne générez pas au moins 50€ de revenus dans vos 30 premiers jours, 
            nous vous remboursons intégralement.
          </p>
        </div>

        {/* Stats de preuve sociale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">847</div>
            <div className="text-purple-200">{t('FinalConversionCTA.node_runners_actifs')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">127€</div>
            <div className="text-purple-200">{t('FinalConversionCTA.revenus_mensuels_moyens')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">18.5%</div>
            <div className="text-purple-200">{t('FinalConversionCTA.roi_annuel_moyen')}</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            onClick={handleOrderDazBox}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-12 py-6 text-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all"
          >
            🚀 Commander ma DazBox
          </button>
          
          <button 
            onClick={handleJoinCommunity}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-12 py-6 text-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all"
          >
            💬 Rejoindre la Communauté
          </button>
        </div>

        {/* Informations finales */}
        <div className="mt-8 text-purple-200">
          <p className="text-lg">
            ✨ Installation en 5 minutes • 
            🎯 Support communauté 24/7 • 
            💎 Accès Discord privé immédiat
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalConversionCTA; 