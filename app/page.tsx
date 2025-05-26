"use client";
import React, { useEffect, useState, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import NewHero from "../components/shared/ui/NewHero";
import { TechnicalProof } from "../components/shared/ui/TechnicalProof";
import { UniqueFeature } from "../components/shared/ui/UniqueFeature";
import RealMetrics from "../components/shared/ui/RealMetrics";
import RealTestimonials from "../components/shared/ui/RealTestimonials";
import { HowItWorks } from "@/components/shared/ui/HowItWorks";
import { CTASection } from "@/components/shared/ui/CTASection";

// Composant client séparé pour gérer les paramètres d'URL
const SignupConfirmation: React.FC = () => {
  const [showSignupConfirmation, setShowSignupConfirmation] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        setShowSignupConfirmation(true);
      }
    }
  }, []);
  
  const closeConfirmation = (): void => {
    setShowSignupConfirmation(false);
  };
  
  if (!mounted) return null;
  if (!showSignupConfirmation) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-indigo-200 transform transition-all animate-fade-in-scale"
        data-aos="zoom-in"
        data-aos-duration="400"
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Inscription confirmée !</h2>
          <p className="text-gray-600 mb-6">
            Votre adresse email a été vérifiée avec succès. Votre compte est maintenant actif et vous pouvez profiter de tous les services de dazno.de.
          </p>
          <button
            onClick={closeConfirmation}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Commencer l'aventure
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OptimizedHomePage(): React.ReactElement {
  useEffect(() => {
    AOS.init({ 
      once: false,
      duration: 800,
      easing: 'ease-out-cubic',
      mirror: true,
      anchorPlacement: 'top-bottom'
    });
    
    // Script pour le défilement fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      const targetId = (anchor as HTMLAnchorElement).getAttribute('href');
      if (!targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
          const offset = 80;
          window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth'
          });
        });
      }
    });
  }, []);

  return (
    <>
      {/* Lightbox de confirmation d'inscription */}
      <Suspense fallback={null}>
        <SignupConfirmation />
      </Suspense>

      {/* Page structure optimisée avec nouveaux composants */}
      <main className="min-h-screen w-full overflow-x-hidden">
        {/* Hero Section avec la vraie douleur technique */}
        <NewHero />

        {/* Section Preuves techniques - Ce que l'IA détecte */}
        <TechnicalProof />

        {/* Section Fonctionnalité unique - IA prédictive */}
        <UniqueFeature />

        {/* Section Métriques réelles de production */}
        <RealMetrics />

        {/* Section Comment ça marche */}
        <HowItWorks />

        {/* Section Témoignages de vrais devs Lightning */}
        <RealTestimonials />

        {/* Section CTA finale */}
        <CTASection />
      </main>
    </>
  );
} 