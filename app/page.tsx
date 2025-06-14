"use client";
import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useInView } from "@/hooks/useInView";

// Lazy loading des composants pour optimiser le First Load
const NewRevenueHero = dynamic(() => import("../components/shared/ui/NewRevenueHero"), {
  loading: () => <div className="h-screen bg-gradient-to-br from-green-600 via-blue-700 to-purple-800 animate-pulse" />
});

const WhyBecomeNodeRunner = dynamic(() => import("../components/shared/ui/WhyBecomeNodeRunner"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
});

const DetailedTestimonials = dynamic(() => import("../components/shared/ui/DetailedTestimonials"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
});

const HowItWorks = dynamic(() => import("@/components/shared/ui/HowItWorks").then(mod => ({ default: mod.HowItWorks })), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
});

const CommunitySection = dynamic(() => import("../components/shared/ui/CommunitySection"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
});

const FirstStepsGuide = dynamic(() => import("../components/shared/ui/FirstStepsGuide"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
});

const BeginnersFAQ = dynamic(() => import("../components/shared/ui/BeginnersFAQ"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
});

const FinalConversionCTA = dynamic(() => import("../components/shared/ui/FinalConversionCTA"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
});

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
    // Nettoyer l'URL après fermeture
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };
  
  if (!mounted) return null;
  if (!showSignupConfirmation) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-indigo-200 transform transition-all animate-zoom-in"
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
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover-lift"
          >
            Commencer l'aventure
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant wrapper avec animations optimisées
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const { ref, inView } = useInView({ 
    threshold: 0.1, 
    triggerOnce: true,
    delay 
  });
  
  return (
    <section 
      ref={ref}
      className={`${className} ${inView ? 'animate-fade-in' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
};

export default function OptimizedHomePage(): React.ReactElement {
  useEffect(() => {
    // Préchargement des images critiques
    const preloadImages = [
      '/assets/images/logo-daznode.svg',
      '/assets/images/dazia-illustration.png'
    ];
    
    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Défilement fluide pour les ancres
    const handleAnchorClicks = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href')!;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
          const offset = 80;
          window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClicks);
    return () => document.removeEventListener('click', handleAnchorClicks);
  }, []);

  return (
    <>
      {/* Lightbox de confirmation d'inscription */}
      <Suspense fallback={null}>
        <SignupConfirmation />
      </Suspense>

      {/* Page structure optimisée avec nouveaux composants centrés sur les revenus */}
      <main className="min-h-screen w-full overflow-x-hidden scroll-smooth">
        {/* Hero Section centré sur les revenus passifs - Priority loading */}
        <NewRevenueHero />

        {/* Section Pourquoi devenir opérateur de nœud */}
        <AnimatedSection delay={100}>
          <WhyBecomeNodeRunner />
        </AnimatedSection>

        {/* Section Comment ça marche */}
        <AnimatedSection delay={200}>
          <HowItWorks />
        </AnimatedSection>

        {/* Section Témoignages détaillés avec métriques financières */}
        <AnimatedSection delay={300}>
          <DetailedTestimonials />
        </AnimatedSection>

        {/* Section Guide des premiers pas */}
        <AnimatedSection delay={400}>
          <FirstStepsGuide />
        </AnimatedSection>

        {/* Section FAQ pour débutants */}
        <AnimatedSection delay={500}>
          <BeginnersFAQ />
        </AnimatedSection>

        {/* Section Communauté Token For Good */}
        <AnimatedSection delay={600}>
          <CommunitySection />
        </AnimatedSection>

        {/* Section CTA finale de conversion */}
        <AnimatedSection delay={700}>
          <FinalConversionCTA />
        </AnimatedSection>
      </main>
    </>
  );
} 