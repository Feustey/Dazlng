import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const NewHero: React.FC = (): React.ReactElement => {
  const router = useRouter();

  const handleStartFree = (): void => {
    router.push('/register');
  };

  const handleViewDemo = (): void => {
    router.push('/daznode/demo');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/images/logo-daznode.svg"
            alt="Daznode"
            width={280}
            height={110}
            className="h-20 md:h-28 w-auto"
            priority
          />
        </div>

        {/* Titre principal - Proposition de valeur claire */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Gérez vos nœuds Lightning{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-pink-400 text-transparent bg-clip-text">
              en un clic
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
            La solution tout-en-un pour déployer, optimiser et monitorer vos nœuds Lightning Network{' '}
            <strong className="text-yellow-300">sans compétences techniques</strong>
          </p>
        </div>

        {/* Preuves sociales rapides */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-indigo-200 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>500+ nœuds déployés</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>99.9% de disponibilité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Installation en 5 minutes</span>
          </div>
        </div>

        {/* Call-to-Action principal - Avec navigation active */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <button 
            onClick={handleStartFree}
            className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-black font-bold px-8 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all rounded-xl cursor-pointer"
          >
            Démarrer Gratuitement
          </button>
          
          <button 
            onClick={handleViewDemo}
            className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg bg-transparent rounded-xl font-bold transition-all cursor-pointer"
          >
            Voir la Démo
          </button>
        </div>

        {/* Bénéfice immédiat */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-12 max-w-2xl mx-auto">
          <p className="text-white font-medium">
            <span className="text-yellow-300 font-bold">Essai gratuit de 14 jours</span> • 
            Pas de carte bancaire requise • 
            Support 24/7
          </p>
        </div>

        {/* Flèche de défilement */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => {
              const element = document.getElementById('how-it-works');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group text-yellow-300 hover:text-yellow-200 transition-all duration-300 flex flex-col items-center"
          >
            <span className="text-sm font-medium mb-2">Découvrir comment</span>
            <div className="w-12 h-12 rounded-full bg-yellow-300 text-indigo-700 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewHero; 