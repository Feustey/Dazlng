import React, { useState } from 'react';

const BeginnersFAQ: React.FC = (): React.ReactElement => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Combien puis-je gagner réellement ?",
      answer: "Nos membres débutants génèrent en moyenne 50-120€/mois après 3 mois d'optimisation. Les revenus dépendent de votre capital initial, de la configuration de vos canaux et des conditions de marché. Nos top performers génèrent plus de 300€/mois.",
      category: "Revenus"
    },
    {
      question: "Que se passe-t-il si j'ai un problème technique ?",
      answer: "La communauté Discord répond en moyenne en 15 minutes. Nos experts bénévoles adorent aider ! En plus, vous avez accès à une base de connaissances complète et à des guides vidéo détaillés.",
      category: "Support"
    },
    {
      question: "Est-ce légal en France ?",
      answer: "Absolument. Opérer un nœud Bitcoin est parfaitement légal et considéré comme une activité technique. Vous devez simplement déclarer vos revenus comme des bénéfices non commerciaux (BNC) lors de votre déclaration d'impôts.",
      category: "Légal"
    },
    {
      question: "Quel capital initial faut-il pour commencer ?",
      answer: "Le minimum recommandé est 0.1 BTC (~3000€) pour commencer à générer des revenus significatifs. Avec la DazBox à 799€, votre investissement total est d'environ 3800€ pour un ROI de 15-25% annuel.",
      category: "Investment"
    },
    {
      question: "Dois-je être développeur pour utiliser DazNode ?",
      answer: "Pas du tout ! DazNode automatise toute la partie technique. Notre interface intuitive et la communauté vous accompagnent. De nombreux membres n'avaient aucune connaissance technique avant de commencer.",
      category: "Technique"
    },
    {
      question: "Qu'est-ce qui rend DazNode différent des autres solutions ?",
      answer: "Notre IA prédictive, notre communauté active et notre approche 'community-first'. Nous ne vendons pas juste un produit, nous créons une communauté d'entraide où chacun partage ses stratégies gagnantes.",
      category: "Différenciation"
    }
  ];

  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Questions fréquentes des débutants
          </h2>
          <p className="text-xl text-gray-600">
            Toutes les réponses aux questions que vous vous posez avant de commencer votre aventure Lightning
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium mr-4">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                </div>
                <svg 
                  className={`w-6 h-6 text-gray-500 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <div className="border-t pt-4">
                    <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact support */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Une autre question ?</h3>
            <p className="text-lg mb-6 text-indigo-100">
              Notre communauté est là pour vous aider ! Rejoignez notre Discord pour poser vos questions directement aux experts.
            </p>
            <button className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Poser ma question sur Discord
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeginnersFAQ; 