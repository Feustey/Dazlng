import React from "react";
import { useRouter } from "next/navigation";
import { useConversionTracking } from "../../../hooks/useConversionTracking";
import { Download, Plug, Cog, TrendingUp } from "lucide-react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const HowItWorks: React.FC = () => {
  const router = useRouter();
  const { trackEvent } = useConversionTracking();
  const { t } = useAdvancedTranslation("home");

  const steps = [
    {
      icon: Download,
      title: "Installation",
      description: "Recevez votre DazBox et branchez-la en 5 minutes",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Plug,
      title: "Connexion",
      description: "Connectez-vous au réseau Lightning automatiquement",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Cog,
      title: "Configuration",
      description: "Notre IA configure et optimise votre nœud",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Revenus",
      description: "Commencez à générer des revenus passifs",
      color: "from-amber-500 to-amber-600"
    }
  ];

  const handleGetStarted = () => {
    trackEvent("how_it_works_cta_clicked");
    router.push("/checkout");
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En 4 étapes simples, transformez votre épargne en revenus passifs avec le Lightning Network
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`bg-gradient-to-br ${step.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à commencer ?
            </h3>
            <p className="text-gray-600 mb-6">
              Rejoignez plus de 1000 opérateurs qui génèrent déjà des revenus passifs
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Commencer maintenant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
