import React, { useState } from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const BeginnersFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useAdvancedTranslation("faq");

  const faqs = [
    {
      question: "Qu'est-ce qu'un nœud Lightning ?",
      answer: "Un nœud Lightning est un serveur qui permet de traiter les paiements instantanés sur le réseau Bitcoin Lightning Network. Il agit comme un intermédiaire pour faciliter les transactions rapides et peu coûteuses."
    },
    {
      question: "Combien puis-je gagner avec un nœud Lightning ?",
      answer: "Les revenus varient selon la taille du nœud, le volume de transactions et l'optimisation. Avec DazNode, nos utilisateurs gagnent en moyenne 40% de plus grâce à notre IA d'optimisation."
    },
    {
      question: "Ai-je besoin de connaissances techniques ?",
      answer: "Non ! DazNode automatise tout le processus. Notre plateforme gère la configuration, l'optimisation et le monitoring de votre nœud. Vous n'avez qu'à vous concentrer sur vos revenus."
    },
    {
      question: "Combien coûte l'installation d'un nœud ?",
      answer: "L'installation d'un nœud Lightning coûte entre 100€ et 500€ selon la configuration. DazNode propose des packages tout-en-un avec support technique inclus."
    },
    {
      question: "Y a-t-il des risques financiers ?",
      answer: "Comme tout investissement, il y a des risques. Cependant, DazNode minimise ces risques grâce à notre IA qui surveille en permanence votre nœud et prédit les problèmes potentiels."
    },
    {
      question: "Combien de temps faut-il pour commencer ?",
      answer: "Avec DazNode, vous pouvez commencer à gagner des revenus en moins de 24h. Notre processus d'installation automatisé vous guide à chaque étape."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-gray-600">
            Tout ce que vous devez savoir pour commencer avec les nœuds Lightning
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Vous avez d'autres questions ?
          </p>
          <a
            href="/contact"
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
};

export default BeginnersFAQ;