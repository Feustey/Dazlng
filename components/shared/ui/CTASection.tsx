'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export const CTASection: React.FC = () => {
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Prêt à Rejoindre la{' '}
          <span className="bg-gradient-to-r from-yellow-300 to-orange-400 text-transparent bg-clip-text">
            Révolution Lightning ?
          </span>
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'utilisateurs qui font déjà confiance à DazNode 
          pour optimiser leurs nœuds Lightning Network.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Commencer Maintenant
          </button>
          <button 
            onClick={handleContact}
            className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent rounded-xl font-bold transition-all duration-300"
          >
            Parler à un Expert
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-8 text-purple-100 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Essai gratuit</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Support 24/7</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Sans engagement</span>
          </div>
        </div>
      </div>
    </section>
  );
}
