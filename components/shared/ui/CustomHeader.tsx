"use client";
import React from 'react';
import Image from 'next/image';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

const CustomHeader: React.FC = () => {
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
                style={{ height: "auto" }}
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
            <a href="/dazpay" className="text-gray-700 hover:text-indigo-600 font-medium">
              DazPay
            </a>
            <a href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">
              Contact
            </a>
          </nav>

          {/* Boutons d'authentification adaptatifs */}
          <div className="flex items-center space-x-4">
            {user && session ? (
              // Utilisateur connecté
              <div className="flex items-center space-x-4">
                <a 
                  href="/user/dashboard" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Mon Compte
                </a>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-block px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              // Utilisateur non connecté
              <a 
                href="/auth/login" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Connexion
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );

export default CustomHeader; 