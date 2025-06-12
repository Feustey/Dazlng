import React from 'react';

const FirstStepsGuide: React.FC = (): React.ReactElement => {
  const steps = [
    {
      day: "Jour 1-2",
      title: "Réception et installation guidée",
      description: "Votre DazBox arrive chez vous avec un guide d'installation détaillé",
      tasks: [
        "Déballage et connexion de votre DazBox",
        "Configuration initiale avec notre assistant",
        "Premier contact avec votre mentor communauté"
      ],
      icon: "📦",
      color: "from-blue-500 to-cyan-500"
    },
    {
      day: "Jour 3-4",
      title: "Formation communauté + premiers canaux",
      description: "Intégration dans Discord et formation personnalisée",
      tasks: [
        "Accès au Discord privé et présentation",
        "Formation 1-on-1 avec un mentor",
        "Ouverture de vos premiers canaux Lightning"
      ],
      icon: "🎓",
      color: "from-green-500 to-emerald-500"
    },
    {
      day: "Jour 5-6",
      title: "Optimisation avec mentors",
      description: "Fine-tuning de votre configuration pour maximiser les revenus",
      tasks: [
        "Analyse de vos premiers metrics",
        "Optimisation des frais et liquidité",
        "Stratégies de routing personnalisées"
      ],
      icon: "⚡",
      color: "from-yellow-500 to-orange-500"
    },
    {
      day: "Jour 7",
      title: "Premiers revenus + stratégie personnalisée",
      description: "Validation de vos gains et plan de développement",
      tasks: [
        "Analyse de vos premiers revenus",
        "Plan de croissance sur 3 mois",
        "Accès aux stratégies avancées"
      ],
      icon: "💰",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Votre parcours en 7 jours
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un accompagnement structuré pour vous assurer de générer vos premiers revenus 
            rapidement et en toute sécurité
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-600 rounded-full"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col md:justify-center`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center shadow-lg z-10">
                  <span className="text-2xl">{step.icon}</span>
                </div>

                {/* Content card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:ml-8' : 'md:ml-auto md:mr-8'} ml-20 md:ml-0`}>
                  <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className={`bg-gradient-to-r ${step.color} rounded-xl p-4 mb-6`}>
                      <div className="flex items-center justify-between text-white">
                        <h3 className="text-xl font-bold">{step.day}</h3>
                        <span className="text-3xl">{step.icon}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h4>
                    <p className="text-gray-600 mb-6 text-lg">{step.description}</p>
                    
                    <ul className="space-y-3">
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start">
                          <span className="text-green-500 mr-3 mt-1">✓</span>
                          <span className="text-gray-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garantie de résultat */}
        <div className="mt-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            🎯 Objectif : 50€ minimum dans vos 30 premiers jours
          </h3>
          <p className="text-xl text-green-100 mb-6">
            Si vous ne générez pas au moins 50€ de revenus en suivant notre parcours, 
            nous vous remboursons intégralement votre DazBox.
          </p>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-lg font-medium">
              <span className="text-yellow-300">✅ Garantie satisfait ou remboursé 30 jours</span><br />
              <span className="text-green-200">✅ Support illimité pendant votre premier mois</span><br />
              <span className="text-blue-200">✅ Mentor personnel assigné</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstStepsGuide; 