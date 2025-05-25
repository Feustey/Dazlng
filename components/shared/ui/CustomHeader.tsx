import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const CustomHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isModernPage = ["/", "/token-for-good", "/about", "/contact"].includes(pathname || "");

  return (
    <header className={`fixed top-0 left-0 right-0 px-4 sm:px-6 z-50 transition-all duration-300 ${
      isModernPage ? 'bg-transparent text-white' : 'bg-white text-gray-900 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo - visible sur tous les écrans */}
        <div className="flex items-center">
          <a href="/" aria-label="Accueil">
            <Image 
              src="/assets/images/logo-daznode.svg"
              alt="Daz3 Logo" 
              width={150} 
              height={40} 
              priority 
            />
          </a>
        </div>
        {/* Bouton menu mobile - visible uniquement sur mobile */}
        <button 
          className={`md:hidden flex items-center p-2 ${isModernPage ? 'text-white' : 'text-gray-700'}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {/* Icône burger ou X selon l'état du menu */}
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          )}
        </button>
  
  
        {/* Boutons d'action - visibles uniquement sur desktop */}
        <div className={`hidden md:flex gap-2 ${isModernPage ? 'text-white' : ''}`}>
          <a href="/auth/login" className={`btn-secondary px-4 py-2 rounded border ${isModernPage ? 'border-white text-white hover:bg-white hover:text-indigo-700' : 'border-primary text-primary hover:bg-primary hover:text-white'} transition`}>Connexion</a>
        </div>
      </div>
      {/* Menu mobile - visible uniquement quand ouvert */}
      {mobileMenuOpen && (
        <div className={`md:hidden py-4 mt-2 border-t animate-slide-up z-50 absolute left-0 right-0 ${isModernPage ? 'bg-indigo-900/90 border-indigo-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
          <nav>
        
            {/* Boutons d'action dans le menu mobile */}
            <div className="mt-4 px-4 flex flex-col gap-3">
              <a href="/auth/login" className={`btn-secondary py-2 text-center rounded border ${isModernPage ? 'border-white text-white hover:bg-white hover:text-indigo-700' : 'border-primary text-primary hover:bg-primary hover:text-white'} transition`}>Connexion</a>
             </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default CustomHeader; 