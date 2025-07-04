"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

interface HeroMetrics {
  activeNodes: number;
  totalRevenue: string;
  averageROI: string;
  forceClosePrevented: number;
}

interface OptimizedHeroProps {
  variant?: "control" | "demo" | "roi";
}

export const OptimizedHero: React.FC<OptimizedHeroProps> = ({ variant = "control" }) => {
  const router = useRouter();
  const { t } = useAdvancedTranslation("home");
  
  const [metrics, setMetrics] = useState<HeroMetrics>({
    activeNodes: 84.7,
    totalRevenue: "₿12.7",
    averageROI: "+43%",
    forceClosePrevented: 156
  });

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulated real-time metrics update
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeNodes: prev.activeNodes + Math.floor(Math.random() * 3),
        forceClosePrevented: prev.forceClosePrevented + Math.floor(Math.random() * 2)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrimaryCTA = () => {
    // Track conversion event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "hero_primary_cta_click", {
        event_category: "funnel",
        cta_variant: variant,
        position: "hero_section"
      });
    }

    if (variant === "demo") {
      // Open demo modal or navigate to demo page
      window.open("https://demo.dazno.de", "_blank");
    } else if (variant === "roi") {
      // Scroll to ROI calculator
      document.getElementById("roi-calculator")?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Default: navigate to trial signup
      router.push("/register?plan=pro&trial=7days");
    }
  };

  const handleSecondaryCTA = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "hero_secondary_cta_click", {
        event_category: "funnel",
        cta_variant: variant,
        position: "hero_section"
      });
    }

    if (variant === "control") {
      document.getElementById("roi-calculator")?.scrollIntoView({ behavior: "smooth" });
    } else if (variant === "demo") {
      document.getElementById("roi-calculator")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open("https://demo.dazno.de", "_blank");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, 
          source: "hero_section", 
          variant
        })
      });

      if (response.ok) {
        // Track email signup
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "email_signup", {
            event_category: "funnel",
            source: "hero_section", 
            variant
          });
        }
        
        router.push("/register?email=" + encodeURIComponent(email));
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCtaConfig = () => {
    switch (variant) {
      case "demo":
        return {
          primary: "Voir la démo en direct",
          secondary: "Calculer mon ROI",
          urgency: "2min de démo • Aucune installation"
        };
      case "roi":
        return {
          primary: "Calculer mon ROI",
          secondary: "Voir la démo",
          urgency: "Résultats instantanés • Données réelles"
        };
      default:
        return {
          primary: "Essai gratuit 7 jours",
          secondary: "Calculer mon ROI",
          urgency: "127 nodes créés cette semaine"
        };
    }
  };

  const ctaConfig = getCtaConfig();

  return (
    <section>
      {/* Background animation  */}
      <div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div>
        <div>
          
          {/* Left Column - Content  */}
          <div>
            {/* Social Proof Bar  */}
            <div>
              <div>
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>{metrics.activeNodes}+ nodes actifs</span>
              </div>
              <div>
                <span className="text-yellow-400 mr-1">⚡</span>
                <span>{metrics.forceClosePrevented} force-closes évités</span>
              </div>
            </div>

            {/* Main Headline  */}
            <h1>
              Automatisez vos{" "}
              <span>
                revenus Lightning
              </span>{" "}
              avec l'IA
            </h1>

            {/* Subheadline  */}
            <p>
              La seule solution qui <strong className="text-yellow-400">prédit et évite les force-closes</strong> 6h à l'avance.
              <span>
                Utilisé par 500+ node runners • {metrics.averageROI} de revenus en moyenne
              </span>
            </p>

            {/* CTAs  */}
            <div>
              <button onClick={handlePrimaryCTA}>
                <span>
                  ⚡ {ctaConfig.primary}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>

              <button onClick={handleSecondaryCTA}>
                {ctaConfig.secondary}
              </button>
            </div>

            {/* Urgency/Social Proof  */}
            <div>
              <span>
                🟢 {ctaConfig.urgency}
              </span>
              <span>Aucune carte bancaire requise</span>
            </div>

            {/* Email Capture Form  */}
            <form onSubmit={handleEmailSubmit}>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  required
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi..." : "⚡ Commencer l'essai gratuit"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Metrics/Visuals  */}
          <div>
            <div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">{metrics.totalRevenue}</div>
                <div className="text-sm text-gray-400">Revenus générés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{metrics.averageROI}</div>
                <div className="text-sm text-gray-400">ROI moyen</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};