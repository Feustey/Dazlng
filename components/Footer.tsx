import React from 'react';
import Image from 'next/image';

const socialLinks = [
  {
    url: 'nostr:d2d8186182cce5d40e26e7db23ea38d3bf4e10dd98642cc4f5b1fb38efaf438e',
    title: 'Suivez-nous sur Nostr',
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 2a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8zm0 2a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 2a4 4 0 1 1-4 4 4 4 0 0 1 4-4z" />
      </svg>
    ),
  },
  {
    url: 'https://t.me/daznode_bot',
    title: 'Rejoignez-nous sur Telegram',
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
        <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
      </svg>
    ),
  },
  {
    url: 'https://linkedin.com/company/daznode',
    title: 'Suivez-nous sur LinkedIn',
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute right-20 top-10 w-56 h-56 rounded-full bg-indigo-400 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-purple-500 blur-3xl"></div>
      </div>
      {/* Séparateur stylisé */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-8 text-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Section logo et description */}
          <div className="col-span-1 md:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20 h-full">
              <Image 
                src="/assets/images/logo-daznode.svg" 
                width={150} 
                height={40} 
                alt="Daz3 Logo"
                priority 
                className="mb-4"
              />
              <p className="text-blue-100 text-sm mb-4">Où l'imagination rencontre l'innovation - libérez votre créativité avec nous!</p>
              {/* Icônes de réseaux sociaux */}
              <div className="flex space-x-3 mt-6">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    title={link.title}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-blue-100 hover:text-white transition-colors duration-300"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Colonnes de liens */}
          <div className="col-span-1">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20 h-full">
              <h4 className="font-bold text-lg mb-4 text-blue-200">Produit</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://docs.dazno.de" target="_blank" rel="noopener noreferrer" 
                     className="text-blue-100 hover:text-white flex items-center transform hover:translate-x-1 transition-all duration-300">
                    <span className="mr-2">→</span>DazDocs
                  </a>
                </li>
                <li>
                  <a href="/token-for-good" 
                     className="text-blue-100 hover:text-white flex items-center transform hover:translate-x-1 transition-all duration-300">
                    <span className="mr-2">→</span>Token for Good
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20 h-full">
              <h4 className="font-bold text-lg mb-4 text-blue-200">Entreprise</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/about" 
                     className="text-blue-100 hover:text-white flex items-center transform hover:translate-x-1 transition-all duration-300">
                    <span className="mr-2">→</span>À propos de nous
                  </a>
                </li>
                <li>
                  <a href="/contact" 
                     className="text-blue-100 hover:text-white flex items-center transform hover:translate-x-1 transition-all duration-300">
                    <span className="mr-2">→</span>Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20 h-full">
              <h4 className="font-bold text-lg mb-4 text-blue-200">Aide</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/help" 
                     className="text-blue-100 hover:text-white flex items-center transform hover:translate-x-1 transition-all duration-300">
                    <span className="mr-2">→</span>Support
                  </a>
                </li>
                <li>
                  <a href="/terms" 
                     className="text-blue-100 hover:text-white flex items-center transform hover:translate-x-1 transition-all duration-300">
                    <span className="mr-2">→</span>Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Section copyright */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-blue-200 text-sm mb-4 sm:mb-0 flex items-center">
            <span className="animate-pulse mr-2">💙</span>
            © 2025 - Réalisé avec passion par 
            <a href="https://inoval.io" target="_blank" rel="noopener noreferrer" className="mx-1 underline decoration-dotted underline-offset-2 hover:text-white">Inoval</a>
          </div>
          {/* Bouton retour en haut */}
          <a 
            href="#top" 
            className="group p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300" 
            title="Retour en haut"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-blue-100 group-hover:text-white transition-colors"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 