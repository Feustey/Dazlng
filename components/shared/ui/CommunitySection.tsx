import React from 'react';
import { useRouter } from 'next/navigation';

const CommunitySection: React.FC = () => {
    <section className="py-20 bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Une communauté, pas juste un produit
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Rejoignez la plus grande communauté francophone de node runners Bitcoin. 
            L'entraide et le partage de connaissances au cœur de notre succès.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {communityFeatures.map((feature: any, index: any) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <span className="text-4xl mr-4">{feature.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="text-indigo-200">{feature.description}</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {feature.features.map((feat: any, featIndex: any) => (
                  <li key={featIndex} className="flex items-start">
                    <span className="text-yellow-400 mr-3 mt-1">✨</span>
                    <span className="text-gray-200">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Métriques de la communauté */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-8 backdrop-blur-sm border border-yellow-400/30 mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-yellow-300">
            La communauté Token For Good en chiffres
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">500+</div>
              <div className="text-yellow-200 text-sm">Membres actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">15min</div>
              <div className="text-orange-200 text-sm">Temps de réponse moyen</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">24/7</div>
              <div className="text-pink-200 text-sm">Support disponible</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">97%</div>
              <div className="text-green-200 text-sm">Satisfaction membres</div>
            </div>
          </div>
        </div>

        {/* Call to action vers Token For Good */}
        <div className="text-center">
          <button 
            onClick={handleJoinCommunity}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-12 py-6 text-xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all"
          >
            🚀 Rejoindre Token For Good
          </button>
          <p className="text-indigo-200 mt-4">
            Accès gratuit • Plus de 500 membres • Support 24/7
          </p>
        </div>
      </div>
    </section>
  );

export default CommunitySection; 