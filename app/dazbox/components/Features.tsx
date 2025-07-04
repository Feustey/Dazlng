"use client";

import React, { useEffect, useRef, useState } from "react";
import { useConversionTracking } from "../../../hooks/useConversionTracking";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
  stats?: string;
}

const DazBoxFeatures: React.FC = () => {
  const { t } = useAdvancedTranslation("common");

  const { trackEvent } = useConversionTracking();
  const [visibleFeatures, setVisibleFeatures] = useState<string[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Features data
  const features = [
    {
      id: "plug-play",
      icon: "⚡",
      title: "Plug & Play",
      description: t("Features.emploi_en_5_minutes"),
      benefit: "Installation simple"
    },
    {
      id: "performance",
      icon: "🚀",
      title: "Haute Performance",
      description: t("Features.hardware_optimise"),
      benefit: "Rapidité garantie"
    },
    {
      id: "support",
      icon: "🛠️",
      title: "Support Expert",
      description: t("Features.assistance_247"),
      benefit: "Accompagnement complet"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureId = entry.target.getAttribute("data-feature-id");
            if (featureId && !visibleFeatures.includes(featureId)) {
              setVisibleFeatures(prevVisible => [...prevVisible, featureId]);
              trackEvent("feature_view", { product: "dazbox", feature: featureId });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [trackEvent, visibleFeatures]);

  const handleFeatureClick = (featureId: string): void => {
    trackEvent("feature_interaction", { 
      product: "dazbox",
      feature: featureId,
      action: "click"
    });
  };

  return (
    <section>
      <div>
        {/* Header */}
        <div>
          <h2>
            Pourquoi Choisir{" "}
            <span>
              DazBox ?
            </span>
          </h2>
          <p>
            DazBox révolutionne l'accès au Lightning Network avec une solution 
            simple, sécurisée et rentable pour tous.
          </p>
        </div>

        {/* Features Grid */}
        <div>
          {features.map((feature: any, index: number) => (
            <div 
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              className={`
                group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl 
                transform transition-all duration-700 cursor-pointer
                hover:scale-105 border border-gray-100
                ${visibleFeatures.includes(feature.id) 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-8 opacity-0"
                }
              `}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Icon */}
              <div>
                <div>
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3>
                  {feature.title}
                </h3>
                
                <p>
                  {feature.description}
                </p>

                {/* Benefit Badge */}
                <div>
                  <svg>
                    <path></path>
                  </svg>
                  {feature.benefit}
                </div>

                {/* Stats */}
                {feature.stats && (
                  <div>
                    <p>
                      📊 {feature.stats}
                    </p>
                  </div>
                )}
              </div>

              {/* Hover indicator */}
              <div>
                <svg>
                  <path></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DazBoxFeatures;
export const dynamic = "force-dynamic";