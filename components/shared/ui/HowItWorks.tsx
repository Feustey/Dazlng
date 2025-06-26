import React from 'react';
import { FaDownload, FaPlug, FaCog, FaChartLine } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useConversionTracking } from '../../../hooks/useConversionTracking';

export interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Step: React.FC<StepProps> = ({ number, icon, title, description, delay }) => (
  <div 
    className="flex flex-col items-center text-center space-y-4 p-6"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="relative">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-sm">
        {number}
      </div>
    </div>
    
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    <p className="text-gray-600 max-w-xs leading-relaxed">{description}</p>
  </div>
);

export const HowItWorks: React.FC = () => {
  const router = useRouter();
  const { trackUserAction } = useConversionTracking();

  const steps = [
    {
      number: 1,
      icon: <FaDownload />,
      title: "Commandez",
      description: "Choisissez votre plan et passez commande en quelques clics"
    },
    {
      number: 2,
      icon: <FaPlug />,
      title: "Branchez",
      description: "Recevez votre DazBox et connectez-la simplement"
    },
    {
      number: 3,
      icon: <FaCog />,
      title: "Configurez",
      description: "Notre IA configure automatiquement votre nœud"
    },
    {
      number: 4,
      icon: <FaChartLine />,
      title: "Gagnez",
      description: "Commencez à générer des revenus Lightning dès le premier jour"
    }
  ];

  const handleOrderClick = (): void => {
    trackUserAction('order_click', 'how_it_works_section');
    router.push('/checkout/dazbox');
  };

  const handleQuestionClick = (): void => {
    trackUserAction('question_click', 'how_it_works_section');
    router.push('/contact');
  };

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête de section */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            De la commande aux premiers revenus Lightning en moins d'une semaine. 
            <strong className="text-indigo-600"> Aucune compétence technique requise.</strong>
          </p>
        </div>

        {/* Étapes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step: any, index: any) => (
            <Step
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Flèche de processus pour desktop */}
        <div className="hidden lg:block relative mb-16">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 transform -translate-y-1/2"></div>
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((_: any, index: any) => (
              <div 
                key={index} 
                className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
                style={{ marginLeft: index === 0 ? '12.5%' : '0', marginRight: index === 2 ? '12.5%' : '0' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* CTA de fin de section */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="800">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Prêt à commencer ?
            </h3>
            <p className="text-gray-600 mb-6">
              Rejoignez les centaines d'utilisateurs qui font déjà confiance à notre technologie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleOrderClick}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Commander ma DazBox
              </button>
              <button 
                onClick={handleQuestionClick}
                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
              >
                Poser une question
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
