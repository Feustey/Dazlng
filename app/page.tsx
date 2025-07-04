"use client";
import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import DazFlowShowcase from "../components/shared/ui/DazFlowShowcase";
import { useSearchParams, useRouter } from "next/navigation";
import UXOptimizedNavbar from "../components/shared/ui/UXOptimizedNavbar";
import UXOptimizedHero from "../components/shared/ui/UXOptimizedHero";
import ProblemAgitationSection from "../components/shared/ui/ProblemAgitationSection";
import SolutionDifferentiationSection from "../components/shared/ui/SolutionDifferentiationSection";
import MobileFAQSection from "../components/shared/ui/MobileFAQSection";
import MobileFeaturesSection from "../components/shared/ui/MobileFeaturesSection";
import MobileTestimonialsSection from "../components/shared/ui/MobileTestimonialsSection";
import SocialProofSection from "../components/shared/ui/SocialProofSection";
import PricingSection from "../components/shared/ui/PricingSection";
import ContactDemoSection from "../components/shared/ui/ContactDemoSection";
import UXFooter from "../components/shared/ui/UXFooter";

export const dynamicConfig = "force-dynamic";

// Lazy loading optimisé avec skeleton amélioré
const NewRevenueHero = dynamic(() => import("../components/shared/ui/NewRevenueHero"), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

// Autres composants avec lazy loading optimisé
const WhyBecomeNodeRunner = dynamic(() => import("../components/shared/ui/WhyBecomeNodeRunner"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="text-gray-400">Chargement...</div>
    </div>
  ),
  ssr: false
});

const DetailedTestimonials = dynamic(() => import("../components/shared/ui/DetailedTestimonials"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="text-gray-400">Chargement...</div>
    </div>
  ),
  ssr: false
});

const HowItWorks = dynamic(() => import("@/components/shared/ui/HowItWorks").then(mod => ({ default: mod.HowItWorks })), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="text-gray-400">Chargement...</div>
    </div>
  ),
  ssr: false
});

const CommunitySection = dynamic(() => import("../components/shared/ui/CommunitySection"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="text-gray-400">Chargement...</div>
    </div>
  ),
  ssr: false
});

const FirstStepsGuide = dynamic(() => import("../components/shared/ui/FirstStepsGuide"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="text-gray-400">Chargement...</div>
    </div>
  ),
  ssr: false
});

const BeginnersFAQ = dynamic(() => import("../components/shared/ui/BeginnersFAQ"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="text-gray-400">Chargement...</div>
    </div>
  ),
  ssr: false
});

const FinalConversionCTA = dynamic(() => import("../components/shared/ui/FinalConversionCTA"), {
  loading: () => (
    <div className="p-8 text-center">
      <div className="text-gray-400">Chargement...</div>
    </div>
  ),
  ssr: false
});

// Composant client séparé pour gérer les paramètres d'URL
const SignupConfirmation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Inscription confirmée !</h2>
          <p className="text-gray-600 mb-6">
            Votre adresse email a été vérifiée avec succès. Votre compte est maintenant actif et vous pouvez profiter de tous les services de dazno.de.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
        rootMargin: "0px 0px -50px 0px"
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
      className={`transition-all duration-1000 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
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
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const targetId = target.getAttribute("href");
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
            const offset = 80;
            window.scrollTo({
              top: elementTop - offset,
              behavior: "smooth"
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClicks);
    return () => document.removeEventListener("click", handleAnchorClicks);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900">
      <Suspense fallback={<div className="text-white text-center p-8">Chargement...</div>}>
        <SignupConfirmationGate />
      </Suspense>

      <UXOptimizedNavbar />
      
      <main>
        <AnimatedSection delay={0}>
          <UXOptimizedHero />
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <ProblemAgitationSection />
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <SolutionDifferentiationSection />
        </AnimatedSection>

        <AnimatedSection delay={600}>
          <DazFlowShowcase />
        </AnimatedSection>

        <AnimatedSection delay={800}>
          <WhyBecomeNodeRunner />
        </AnimatedSection>

        <AnimatedSection delay={1000}>
          <DetailedTestimonials />
        </AnimatedSection>

        <AnimatedSection delay={1200}>
          <HowItWorks />
        </AnimatedSection>

        <AnimatedSection delay={1400}>
          <CommunitySection />
        </AnimatedSection>

        <AnimatedSection delay={1600}>
          <FirstStepsGuide />
        </AnimatedSection>

        <AnimatedSection delay={1800}>
          <BeginnersFAQ />
        </AnimatedSection>

        <AnimatedSection delay={2000}>
          <SocialProofSection />
        </AnimatedSection>

        <AnimatedSection delay={2200}>
          <PricingSection />
        </AnimatedSection>

        <AnimatedSection delay={2400}>
          <ContactDemoSection />
        </AnimatedSection>

        <AnimatedSection delay={2600}>
          <FinalConversionCTA />
        </AnimatedSection>

        <AnimatedSection delay={2800}>
          <MobileFAQSection />
        </AnimatedSection>

        <AnimatedSection delay={3000}>
          <MobileFeaturesSection />
        </AnimatedSection>

        <AnimatedSection delay={3200}>
          <MobileTestimonialsSection />
        </AnimatedSection>
      </main>

      <UXFooter />
    </div>
  );
}