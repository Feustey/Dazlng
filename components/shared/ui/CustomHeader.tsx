import React, { useState } from 'react';

const CustomHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header-container bg-white shadow-md px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo - visible sur tous les écrans */}
        <div className="header-logo flex items-center">
         <a href='./'> <img src="/assets/images/logo-daznode.svg" alt="Daz3 Logo" className="h-8 md:h-10" /></a>
        </div>

        {/* Bouton menu mobile - visible uniquement sur mobile */}
        <button 
          className="md:hidden flex items-center p-2 text-gray-700" 
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

        {/* Navigation principale - visible uniquement sur desktop */}
        <nav className="header-navigation hidden md:block">
          <ul className="flex gap-6 text-gray-700 font-medium">
           <li><a href="/about" className="hover:text-primary transition">À propos</a></li>
            <li><a href="/help" className="hover:text-primary transition">Aide</a></li>
            <li><a href="/contact" className="hover:text-primary transition">Contact</a></li>
          </ul>
        </nav>

        {/* Boutons d'action - visibles uniquement sur desktop */}
        <div className="header-actions hidden md:flex gap-2">
          <a href="/auth/login" className="btn-secondary px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition">Connexion</a>
        </div>
      </div>

      {/* Menu mobile - visible uniquement quand ouvert */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 mt-2 border-t border-gray-200 animate-slide-up z-50 absolute left-0 right-0">
          <nav>
            <ul className="flex flex-col gap-1 text-gray-700 font-medium">
              <li><a href="/checkout/dazbox" className="block px-4 py-2 hover:bg-gray-100 rounded">DazBox</a></li>
              <li><a href="/checkout/daznode" className="block px-4 py-2 hover:bg-gray-100 rounded">DazNode</a></li>
              <li><a href="/checkout/dazpay" className="block px-4 py-2 hover:bg-gray-100 rounded">DazPay</a></li>
              <li><a href="/about" className="block px-4 py-2 hover:bg-gray-100 rounded">À propos</a></li>
              <li><a href="/help" className="block px-4 py-2 hover:bg-gray-100 rounded">Aide</a></li>
              <li><a href="/subscribe" className="block px-4 py-2 hover:bg-gray-100 rounded">Tarification</a></li>
              <li><a href="/contact" className="block px-4 py-2 hover:bg-gray-100 rounded">Contact</a></li>
            </ul>

            {/* Boutons d'action dans le menu mobile */}
            <div className="mt-4 px-4 flex flex-col gap-3">
              <a href="/auth/login" className="btn-secondary py-2 text-center rounded border border-primary text-primary hover:bg-primary hover:text-white transition">Connexion</a>
              <a href="/register" className="btn-primary py-2 text-center rounded bg-primary text-white hover:bg-primary-dark transition">Essayer maintenant</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default CustomHeader; 