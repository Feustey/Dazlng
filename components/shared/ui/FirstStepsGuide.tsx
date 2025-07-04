import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const FirstStepsGuide: React.FC = () => {
  const { t } = useAdvancedTranslation("FirstStepsGuide");

  const steps = [
    {
      day: "Jour 1",
      icon: "🚀",
      title: "Installation & Configuration",
      description: "Configuration initiale de votre nœud Lightning",
      color: "from-blue-500 to-blue-600",
      tasks: [
        "Réception et branchement de votre DazBox",
        "Configuration réseau et sécurité",
        "Création de votre compte DazNode",
        "Première connexion au dashboard"
      ]
    },
    {
      day: "Jour 7",
      icon: "⚡",
      title: "Premier Canal",
      description: "Ouverture de votre premier canal Lightning",
      color: "from-green-500 to-green-600",
      tasks: [
        "Analyse des meilleurs partenaires",
        "Ouverture du premier canal",
        "Configuration des frais de routage",
        "Monitoring des premières transactions"
      ]
    },
    {
      day: "Jour 30",
      icon: "📈",
      title: "Optimisation IA",
      description: "Activation de l'optimisation automatique",
      color: "from-purple-500 to-purple-600",
      tasks: [
        "Activation de l'IA d'optimisation",
        "Analyse des performances initiales",
        "Ajustement des paramètres",
        "Premiers revenus générés"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vos premiers pas avec DazNode
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un guide étape par étape pour démarrer votre aventure Lightning Network en toute sérénité
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-r ${step.color} p-6 text-white`}>
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{step.icon}</span>
                  <div>
                    <div className="text-sm font-medium opacity-90">{step.day}</div>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-white/90 mt-1">{step.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Tâches à accomplir :</h4>
                <ul className="space-y-3">
                  {step.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-amber-50 rounded-lg p-8 border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Besoin d'aide pour commencer ?
            </h3>
            <p className="text-gray-600 mb-6">
              Notre équipe d'experts est là pour vous accompagner à chaque étape
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/checkout"
                className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Commencer maintenant
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstStepsGuide;