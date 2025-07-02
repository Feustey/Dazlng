"use client";

import React from 'react';

export const dynamic = 'force-dynamic';
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">À propos de DazNode</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              DazNode est une plateforme innovante dédiée à l'optimisation et à la gestion des nœuds Lightning Network. 
              Notre mission est de démocratiser l'accès aux technologies Bitcoin et Lightning en fournissant des outils 
              intuitifs et puissants.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notre Vision</h2>
            <p className="text-gray-700 mb-6">
              Nous croyons en un avenir où chacun peut participer activement au réseau Lightning, 
              contribuer à la décentralisation financière et bénéficier des avantages du Bitcoin.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nos Services</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>Gestion optimisée des nœuds Lightning</li>
              <li>Analyses et recommandations IA</li>
              <li>Outils de monitoring avancés</li>
              <li>Support technique expert</li>
            </ul>
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Contactez-nous</h3>
              <p className="text-blue-800">
                Pour toute question ou demande d'information, n'hésitez pas à nous contacter 
                via notre <a href="/contact" className="underline hover:text-blue-600">formulaire de contact</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
