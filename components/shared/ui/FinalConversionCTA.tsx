import React from "react";
import { useRouter } from "next/navigation";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const FinalConversionCTA: React.FC = () => {
  const router = useRouter();
  const { t } = useAdvancedTranslation("home");

  const handleGetStarted = () => {
    router.push("/checkout");
  };

  const handleLearnMore = () => {
    router.push("/about");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-amber-600 to-orange-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Prêt à révolutionner vos revenus Lightning ?
        </h2>
        
        <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
          Rejoignez plus de 1000 opérateurs de nœuds qui utilisent déjà DazNode pour maximiser leurs revenus Lightning Network
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Optimisation IA</h3>
            <p className="text-amber-100 text-sm">
              Notre intelligence artificielle optimise automatiquement vos paramètres pour maximiser les revenus
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Protection 24/7</h3>
            <p className="text-amber-100 text-sm">
              Monitoring continu et alertes intelligentes pour protéger vos fonds contre les force-close
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="text-xl font-semibold text-white mb-2">+40% de revenus</h3>
            <p className="text-amber-100 text-sm">
              Nos utilisateurs gagnent en moyenne 40% de plus grâce à notre plateforme d'optimisation
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGetStarted}
            className="bg-white text-amber-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
          >
            Commencer maintenant
          </button>
          
          <button
            onClick={handleLearnMore}
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-amber-600 transition-colors"
          >
            En savoir plus
          </button>
        </div>

        <div className="mt-8 text-amber-100 text-sm">
          <p>✅ Essai gratuit de 14 jours • ✅ Support 24/7 • ✅ Satisfaction garantie</p>
        </div>
      </div>
    </section>
  );
};

export default FinalConversionCTA; 