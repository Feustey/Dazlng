import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const WhyBecomeNodeRunner: React.FC = () => {
  const { t } = useAdvancedTranslation("home");

  const benefits = [
    {
      title: "Revenus passifs",
      description: "Générez des revenus passifs en participant au réseau Lightning",
      gradient: "from-green-500 to-emerald-600",
      details: [
        "0.1% à 0.5% de commission sur chaque transaction",
        "Revenus proportionnels à la liquidité fournie",
        "Optimisation automatique des frais par l'IA",
        "Réinvestissement automatique des gains"
      ]
    },
    {
      title: "Sécurité maximale",
      description: "Protection avancée contre les risques du Lightning Network",
      gradient: "from-blue-500 to-indigo-600",
      details: [
        "Monitoring 24/7 de vos canaux",
        "Prédiction des force-close",
        "Alertes intelligentes en temps réel",
        "Sauvegarde automatique des configurations"
      ]
    },
    {
      title: "Simplicité totale",
      description: "Configuration et gestion automatisées par notre IA",
      gradient: "from-purple-500 to-pink-600",
      details: [
        "Installation en 5 minutes",
        "Interface intuitive et moderne",
        "Support technique 24/7",
        "Formation gratuite incluse"
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pourquoi devenir opérateur de nœud Lightning ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les avantages uniques d'exploiter un nœud Lightning avec DazNode
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg shadow-lg">
              <div className={`bg-gradient-to-br ${benefit.gradient} p-6 text-white`}>
                <h3 className="text-2xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-white/90">{benefit.description}</p>
              </div>
              
              <div className="bg-white p-6">
                <ul className="space-y-3">
                  {benefit.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à commencer votre aventure Lightning ?
            </h3>
            <p className="text-gray-600 mb-6">
              Rejoignez plus de 1000 opérateurs qui génèrent déjà des revenus passifs
            </p>
            <a
              href="/checkout"
              className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Commencer maintenant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBecomeNodeRunner;