import React from 'react';

const WhyBecomeNodeRunner: React.FC = () => {
  const benefits = [
    {
      icon: "💰",
      title: "Revenus Passifs",
      description: "WhyBecomeNodeRunner.whybecomenoderunnerwhybecomeno",
      gradient: "from-green-500 to-emerald-600",
      details: [
        "0.1% à 0.5% de commission sur chaque transaction",
        "Revenus proportionnels à la liquidité fournie",
        "Optimisation automatique des frais par l'IA",
        "Réinvestissement automatique des gains"
      ]
    },
    {
      icon: "🛡️",
      title: "Contribuer au Réseau",
      description: "WhyBecomeNodeRunner.whybecomenoderunnerwhybecomeno",
      gradient: "from-blue-500 to-indigo-600",
      details: [
        "Renforcez la résilience du Lightning Network",
        "Aidez à connecter l'écosystème Bitcoin",
        "Participez à l'adoption mondiale de Bitcoin",
        "Devenez un acteur de la révolution financière"
      ]
    },
    {
      icon: "🚀",
      title: "Technologie Avancée",
      description: "WhyBecomeNodeRunner.whybecomenoderunnerwhybecomeno"une infrastructure de pointe",
      gradient: "from-purple-500 to-pink-600",
      details: [
        "IA prédictive pour optimiser les performances",
        "Monitoring 24/7 automatisé",
        "Mise à jour automatique des canaux",
        "Dashboard analytics en temps réel"
      ]
    },
    {
      icon: "📈",
      title: "Croissance Continue",
      description: "WhyBecomeNodeRunner.whybecomenoderunnerwhybecomeno"expansion du Lightning Network",
      gradient: "from-orange-500 to-red-600",
      details: [
        "Adoption croissante de Bitcoin et Lightning",
        "Nouveaux cas d'usage quotidiennement",
        "Partenariats avec exchanges majeurs",
        "ROI moyen de 12% à 25% par an"
      ]
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
          {benefits.map((benefit: any, index: any) => (
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
                  {benefit.details.map((detail: any, detailIndex: any) => (
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
              <div className="text-indigo-200">{t('WhyBecomeNodeRunner.node_runners_actifs')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-300">{t('WhyBecomeNodeRunner.24m')}</div>
              <div className="text-indigo-200">{t('WhyBecomeNodeRunner.revenus_gnrs')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-300">99.9%</div>
              <div className="text-indigo-200">{t('WhyBecomeNodeRunner.uptime_moyen')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-300">24/7</div>
              <div className="text-indigo-200">{t('WhyBecomeNodeRunner.support_communaut')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBecomeNodeRunner; 