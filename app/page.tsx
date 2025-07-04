"use client";
import React, { useEffect, useState, Suspense } from "react";
import nextDynamic from "next/dynamic";
import DazFlowShowcase from '../components/shared/ui/DazFlowShowcase';
import { useSearchParams, useRouter } from "next/navigation";
import UXOptimizedNavbar from '../components/shared/ui/UXOptimizedNavbar';
import UXOptimizedHero from '../components/shared/ui/UXOptimizedHero';
import ProblemAgitationSection from '../components/shared/ui/ProblemAgitationSection';
import SolutionDifferentiationSection from '../components/shared/ui/SolutionDifferentiationSection';
import MobileFAQSection from '../components/shared/ui/MobileFAQSection';
import MobileFeaturesSection from '../components/shared/ui/MobileFeaturesSection';
import MobileTestimonialsSection from '../components/shared/ui/MobileTestimonialsSection';
import SocialProofSection from '../components/shared/ui/SocialProofSection';
import PricingSection from '../components/shared/ui/PricingSection';
import ContactDemoSection from '../components/shared/ui/ContactDemoSection';
import UXFooter from '../components/shared/ui/UXFooter';

export const dynamic = 'force-dynamic';
// Lazy loading optimisé avec skeleton amélioré
const NewRevenueHero = nextDynamic(() => import("../components/shared/ui/NewRevenueHero"), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-700 to-purple-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/80 text-lg">{t('common.chargement')}</p>
      </div>
    </div>
  ),
  ssr: true // Activer SSR pour le hero
});

// Autres composants avec lazy loading optimisé
const WhyBecomeNodeRunner = nextDynamic(() => import("../components/shared/ui/WhyBecomeNodeRunner"), {
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-gray-400">{t('common.chargement')}</div>
    </div>
  ),
  ssr: false
});

const DetailedTestimonials = nextDynamic(() => import("../components/shared/ui/DetailedTestimonials"), {
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-gray-400">{t('common.chargement')}</div>
    </div>
  ),
  ssr: false
});

const HowItWorks = nextDynamic(() => import("@/components/shared/ui/HowItWorks").then(mod => ({ default: mod.HowItWorks })), {
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-gray-400">{t('common.chargement')}</div>
    </div>
  ),
  ssr: false
});

const CommunitySection = nextDynamic(() => import("../components/shared/ui/CommunitySection"), {
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-gray-400">{t('common.chargement')}</div>
    </div>
  ),
  ssr: false
});

const FirstStepsGuide = nextDynamic(() => import("../components/shared/ui/FirstStepsGuide"), {
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-gray-400">{t('common.chargement')}</div>
    </div>
  ),
  ssr: false
});

const BeginnersFAQ = nextDynamic(() => import("../components/shared/ui/BeginnersFAQ"), {
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-gray-400">{t('common.chargement')}</div>
    </div>
  ),
  ssr: false
});

const FinalConversionCTA = nextDynamic(() => import("../components/shared/ui/FinalConversionCTA"), {
  loading: () => (
    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-gray-400">{t('common.chargement')}</div>
    </div>
  ),
  ssr: false
});

// Composant client séparé pour gérer les paramètres d'URL
const SignupConfirmation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-indigo-200 transform transition-all animate-zoom-in"
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('common.inscription_confirme_')}</h2>
          <p className="text-gray-600 mb-6">
            Votre adresse email a été vérifiée avec succès. Votre compte est maintenant actif et vous pouvez profiter de tous les services de dazno.de.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover-lift"
          >
            Commencer l'aventure
          </button>
        </div>
      </div>
    </div>
  );
};

// Gate d'affichage de la modale, à utiliser dans <Suspense>
function SignupConfirmationGate() {
  const searchParams = useSearchParams();
  const [showConfirmation, setShowConfirmation] = useState(false);

  React.useEffect(() => {
    if (searchParams.get("signup") === "success") {
      setShowConfirmation(true);
      // Nettoyer l'URL après affichage
      const params = new URLSearchParams(window.location.search);
      params.delete("signup");
      const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  if (!showConfirmation) return null;
  return <SignupConfirmation onClose={() => setShowConfirmation(false)} />;
}

// Composant wrapper avec animations optimisées et Intersection Observer
export interface AnimatedSectionProps {
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const [inView, setInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setInView(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const element = document.querySelector(`[data-section="${className}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [className, hasAnimated]);
  
  return (
    <section 
      data-section={className}
      className={`${className} ${inView ? 'animate-fade-in' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
};

export default function OptimizedHomePage() {
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Marquer la page comme chargée
    setIsPageLoaded(true);
    // Défilement fluide pour les ancres optimisé
    const handleAnchorClicks = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        if (targetId) {
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
      }
    };
    document.addEventListener('click', handleAnchorClicks);
    return () => document.removeEventListener('click', handleAnchorClicks);
  }, []);

  return (
    <>
      <UXOptimizedNavbar />
      <main className="min-h-screen w-full overflow-x-hidden scroll-smooth layout-full-width">
        <UXOptimizedHero />
        <ProblemAgitationSection />
        <SolutionDifferentiationSection />
        <MobileFeaturesSection />
        <MobileTestimonialsSection />
        <SocialProofSection />
        <PricingSection />
        <MobileFAQSection />
        <ContactDemoSection />
      </main>
      <UXFooter />
    </>
  );
}
