import React from 'react';
import Image from 'next/image';

const CustomHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" aria-label="Accueil">
              <Image 
                src="/assets/images/logo-daznode.svg"
                alt="Daz3 Logo" 
                width={150} 
                height={40} 
                className="h-10 w-auto"
                priority 
              />
            </a>
          </div>

          {/* Navigation simple */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/daznode" className="text-gray-700 hover:text-indigo-600 font-medium">
              DazNode
            </a>
            <a href="/dazbox" className="text-gray-700 hover:text-indigo-600 font-medium">
              DazBox
            </a>
            <a href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">
              À propos
            </a>
            <a href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">
              Contact
            </a>
          </nav>

          {/* Bouton connexion simple */}
          <div className="flex items-center space-x-4">
            <a 
              href="/auth/login" 
              className="hidden md:inline-block px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Connexion
            </a>
            <a 
              href="/register" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader; 