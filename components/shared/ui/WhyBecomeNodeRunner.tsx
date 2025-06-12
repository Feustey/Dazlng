import React from 'react';

const WhyBecomeNodeRunner: React.FC = (): React.ReactElement => {
  const benefits = [
    {
      icon: "💰",
      title: "Générer des revenus passifs",
      description: "Gagnez des frais sur chaque transaction qui transite par votre nœud",
      details: [
        "Revenus potentiels : 50-200€/mois selon votre configuration",
        "ROI typique : 15-25% annuel après optimisation",
        "Paiements automatiques en Bitcoin"
      ],
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: "🌍",
      title: "Contribuer à la révolution financière",
      description: "Participez à la construction d'un système financier libre et décentralisé",
      details: [
        "Chaque nœud renforce la résistance à la censure du réseau Bitcoin",
        "Devenez votre propre banque, sans intermédiaire",
        "Soutenez l'adoption mondiale de Bitcoin"
      ],
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: "🤝",
      title: "Rejoindre une communauté passionnée",
      description: "Accédez à notre Discord privé avec +500 node runners",
      details: [
        "Partagez stratégies et conseils avec des experts",
        "Entraide technique 24/7 de la communauté",
        "Webinaires et formations exclusives"
      ],
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: "🔒",
      title: "Sécurité et contrôle total",
      description: "Validez vos propres transactions Bitcoin",
      details: [
        "Ne dépendez plus des services tiers",
        "Gardez le contrôle de vos fonds à 100%",
        "Confidentialité maximale de vos transactions"
      ],
      gradient: "from-orange-500 to-red-600"
    }
  ];

  return (
    <section id="why-become-runner" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi devenir opérateur de nœud Bitcoin ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les 4 raisons principales qui poussent des milliers de personnes 
            à rejoindre la révolution Lightning Network
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-r ${benefit.gradient} p-8 text-white`}>
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">{benefit.icon}</span>
                  <h3 className="text-2xl font-bold">{benefit.title}</h3>
                </div>
                <p className="text-lg opacity-90">{benefit.description}</p>
              </div>
              
              <div className="p-8">
                <ul className="space-y-3">
                  {benefit.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Stats rapides */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-300">847</div>
              <div className="text-indigo-200">Node runners actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-300">2.4M€</div>
              <div className="text-indigo-200">Revenus générés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-300">99.9%</div>
              <div className="text-indigo-200">Uptime moyen</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-300">24/7</div>
              <div className="text-indigo-200">Support communauté</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBecomeNodeRunner; 