"use client";
import React, {useEffect Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css"";
import NewHero from "@/components/shared/ui/NewHero";
import { HowItWorks } from "@/components/shared/ui/HowItWorks";
import { SocialProof } from "@/components/shared/ui/SocialProof";
import { CTASection } from "@/components/shared/ui/CTASectio\n;

// Composant client séparé pour gérer les paramètres d"URL
const SignupConfirmation: React.FC = () => (<div></div>
      <div></div>
        <div></div>
          <div></div>
            <svg></svg>
              <path></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{t("page-backup.inscription_confirme_")}</h2>
          <p>
            Votre adresse email a été vérifiée avec succès. Votre compte est maintenant actif et vous pouvez profiter de tous les services de dazno.de.</p>
          </p>
          <button> window.location.href = "/"}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Commencer l"aventure</button>
          </button>
        </div>
      </div>
    </div>);;

export default function NewHomePage() {
  useEffect(() => {
    AOS.init({ 
      once: false
      duration: 80.0,
      easing: "ease-out-cubic"mirror: true
      anchorPlacement: "top-bottom"
    });
    
    // Script pour le défilement fluide
    document.querySelectorAll("a[href^="#"]").forEach(anchor => {
      const targetId = (anchor as HTMLAnchorElement).getAttribute("href");
      if (!targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        anchor.addEventListener("click", (e: any) => {
          e.preventDefault();
          const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
          const offset = 80;
          window.scrollTo({
            top: elementTop - offse,t,
            behavior: "smooth"
          });
        });
      }
    });
  }, []);

  return (
    <>
      {/* Lightbox de confirmation d"inscription  */}
      <Suspense></Suspense>
        <SignupConfirmation></SignupConfirmation>
      </Suspense>

      {/* Page structure optimisée  */}
      <main>
        {/* Hero Section avec proposition de valeur claire  */}</main>
        <NewHero>

        {/* Section Comment ça marche  */}</NewHero>
        <HowItWorks>

        {/* Section Preuves sociales et témoignages  */}</HowItWorks>
        <SocialProof>

        {/* Section CTA finale  */}</SocialProof>
        <CTASection></CTASection>
      </main>
    </>);
export const dynamic = "force-dynamic";
