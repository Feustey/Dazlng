"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from 'next/image';
// import Link from "next/link";

export default function HomePage(): React.ReactElement {
  useEffect(() => {
    AOS.init({ 
      once: true, 
      duration: 800,
      initClassName: 'mobile-aos'
    });
  }, []);

  return (
    <>
      <div className="min-h-screen relative bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Cercles animés en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl animate-float top-[-20%] left-[-20%]" />
          <div className="absolute w-96 h-96 bg-indigo-400 rounded-full opacity-10 blur-3xl animate-float-delayed right-[-20%] bottom-[-20%]" />
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 text-center space-y-8">
          {/* Logo Daznode */}
          <div className="mb-12 transform hover:scale-105 transition-transform">
            <Image
              src="/assets/images/logo-daznode.svg"
              alt="Daznode"
              width={200}
              height={80}
              className="h-16 md:h-20 w-auto mx-auto"
            />
          </div>

          {/* Titres avec animation d'apparition */}
          <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
            Daznode, l'accès Lightning pour tous
          </h1>
          <p className="text-xl md:text-2xl mb-6 animate-fade-in delay-100">
            Oubliez la complexité. Découvrez une nouvelle façon de gérer et valoriser vos transactions, en toute simplicité.
          </p>
          <p className="text-lg mb-6 animate-fade-in delay-200">
            10 ans d'expertise pour un écosystème où chaque utilisateur, entreprise ou particulier, devient acteur du réseau Lightning.
          </p>
          <p className="italic text-white/80 mb-2 animate-fade-in delay-300">
            Instantané • Sécurisé • Récompensé à chaque transaction
          </p>
          <div className="mt-10 flex justify-center">
            <span className="flex flex-col items-center text-yellow-300">
              <span className="mb-2">Faites défiler pour découvrir</span>
              <svg className="w-7 h-7 animate-bounce-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
      
      {/* Section CTA */}
      {/* <CTASection /> */}
    </>
  );
} 