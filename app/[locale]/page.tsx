"use client";
import React, { useEffect, useState, Suspense } from "react";
import nextDynamic from "next/dynamic";
import DazFlowShowcase from "@/components/shared/ui/DazFlowShowcase";
import { useSearchParams } from "next/navigation";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

// Lazy loading des composants pour optimiser le First Load
const NewRevenueHero = nextDynamic(() => import("@/components/shared/ui/NewRevenueHero"), {
  loading: () => <div>Loading...</div>
});

const WhyBecomeNodeRunner = nextDynamic(() => import("@/components/shared/ui/WhyBecomeNodeRunner"), {
  loading: () => <div>Loading...</div>
});

const DetailedTestimonials = nextDynamic(() => import("@/components/shared/ui/DetailedTestimonials"), {
  loading: () => <div>Loading...</div>
});

const HowItWorks = nextDynamic(() => import("@/components/shared/ui/HowItWorks").then(mod => ({ default: mod.HowItWorks })), {
  loading: () => <div>Loading...</div>
});

const CommunitySection = nextDynamic(() => import("@/components/shared/ui/CommunitySection"), {
  loading: () => <div>Loading...</div>
});

const FirstStepsGuide = nextDynamic(() => import("@/components/shared/ui/FirstStepsGuide"), {
  loading: () => <div>Loading...</div>
});

const BeginnersFAQ = nextDynamic(() => import("@/components/shared/ui/BeginnersFAQ"), {
  loading: () => <div>Loading...</div>
});

const FinalConversionCTA = nextDynamic(() => import("@/components/shared/ui/FinalConversionCTA"), {
  loading: () => <div>Loading...</div>
});

// Composant client séparé pour gérer les paramètres d'URL
const SignupConfirmation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAdvancedTranslation("common");
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{t("success")}</h2>
          <p className="text-gray-600 mb-6">
            {t("signupSuccess")}
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("getStarted")}
          </button>
        </div>
      </div>
    </div>
  );
};

// Gate d'affichage de la modale
function SignupConfirmationGate() {
  const searchParams = useSearchParams();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
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

// Composant wrapper avec animations optimisées
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

  return (
    <section 
      className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      onMouseEnter={() => setInView(true)}
    >
      {children}
    </section>
  );
};

export default function HomePage() {
  const { t } = useAdvancedTranslation("home");

  useEffect(() => {
    // Défilement fluide pour les ancres
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
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <SignupConfirmationGate />
      </Suspense>

      <main>
        {/* Hero Section */}
        <AnimatedSection>
          <NewRevenueHero />
        </AnimatedSection>

        {/* Section Pourquoi devenir opérateur de nœud */}
        <AnimatedSection>
          <WhyBecomeNodeRunner />
        </AnimatedSection>

        {/* Section DazFlow Index */}
        <AnimatedSection>
          <DazFlowShowcase />
        </AnimatedSection>

        {/* Section Comment ça marche */}
        <AnimatedSection>
          <HowItWorks />
        </AnimatedSection>

        {/* Section Témoignages */}
        <AnimatedSection>
          <DetailedTestimonials />
        </AnimatedSection>

        {/* Section Guide des premiers pas */}
        <AnimatedSection>
          <FirstStepsGuide />
        </AnimatedSection>

        {/* Section FAQ */}
        <AnimatedSection>
          <BeginnersFAQ />
        </AnimatedSection>

        {/* Section Communauté */}
        <AnimatedSection>
          <CommunitySection />
        </AnimatedSection>

        {/* CTA Final */}
        <AnimatedSection>
          <FinalConversionCTA />
        </AnimatedSection>
      </main>
    </>
  );
}