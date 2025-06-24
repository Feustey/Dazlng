import React from 'react';
import Image from 'next/image';

export default function RealTestimonials(): React.FC {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Ce que disent nos utilisateurs
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <Image
                src="/assets/images/avatar-male.svg"
                alt="Jean D."
                width={48}
                height={48}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold">Jean D.</h3>
                <p className="text-gray-600">Node Runner</p>
              </div>
            </div>
            <p className="text-gray-700">
              "DazNode m'a permis d'optimiser mes canaux Lightning et d'augmenter mes revenus de 40%."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <Image
                src="/assets/images/avatar-female.svg"
                alt="Marie L."
                width={48}
                height={48}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold">Marie L.</h3>
                <p className="text-gray-600">Développeuse Bitcoin</p>
              </div>
            </div>
            <p className="text-gray-700">
              "L'IA de DazNode a détecté et évité plusieurs force-closes potentiels. Impressionnant !"
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <Image
                src="/assets/images/avatar-leaticia.png"
                alt="Pierre M."
                width={48}
                height={48}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold">Pierre M.</h3>
                <p className="text-gray-600">Entrepreneur Crypto</p>
              </div>
            </div>
            <p className="text-gray-700">
              "La meilleure solution pour gérer mes nœuds Lightning. Support réactif et fonctionnalités uniques."
            </p>
          </div>
        </div>
      </div>
    </section>
};
}
