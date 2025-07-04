"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useConversionTracking } from "../../../hooks/useConversionTracking";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const DazPayHero: React.FC = () => {
  const { t } = useAdvancedTranslation("common");

  const router = useRouter();
  const { trackEvent } = useConversionTracking();

  const handleStartFree = (): void => {
    trackEvent("hero_cta", { product: "dazpay", action: "start_free" });
    router.push("/register");
  };

  const handleLearnMore = (): void => {
    trackEvent("hero_cta", { product: "dazpay", action: "learn_more" });
    const element = document.getElementById("features");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewDemo = (): void => {
    trackEvent("hero_cta", { product: "dazpay", action: "view_demo" });
    router.push("/dazpay/demo");
  };

  return (
    <section>
      {/* Background Pattern */}
      <div>
        <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.svg')] bg-center bg-repeat"></div>
      </div>

      <div>
        {/* Contenu texte */}
        <div>
          {/* Badge de confiance */}
          <div>
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Solution Certifiée Lightning Network
          </div>

          {/* Titre principal */}
          <div>
            <h1>
              DazPay
              <span>
                Terminal Lightning
              </span>
            </h1>
            
            <p>
              Acceptez les paiements Bitcoin en quelques minutes.{" "}
              <span>
                0 Sats d'installation
              </span>{" "}
              et commencez à encaisser dès aujourd'hui.
            </p>
          </div>

          {/* Points clés */}
          <div>
            <div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">Installation instantanée</span>
            </div>
            <div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">Conversion BTC/EUR</span>
            </div>
            <div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">Dashboard marchand</span>
            </div>
            <div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">Support multidevice</span>
            </div>
          </div>

          {/* Offre spéciale */}
          <div>
            <div>
              <div>
                <p className="font-bold text-lg">Offre de lancement</p>
                <p className="text-orange-800">Premier mois gratuit</p>
              </div>
              <div>
                <p className="text-2xl font-bold">1%</p>
                <p className="text-sm text-orange-800">par transaction</p>
              </div>
            </div>
          </div>

          {/* Call-to-Action */}
          <div>
            <button onClick={handleStartFree}>
              <span>Commencer gratuitement</span>
              <svg>
                <path></path>
              </svg>
            </button>
            
            <button onClick={handleViewDemo}>
              Voir une Démo
            </button>
          </div>

          {/* Garantie */}
          <div>
            <svg>
              <path></path>
            </svg>
            <span>Pas d'engagement, résiliable à tout moment</span>
          </div>
        </div>

        {/* Image du produit */}
        <div>
          <div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-3xl blur-3xl opacity-30 scale-110"></div>
            
            {/* Product showcase */}
            <div>
              <Image 
                src="/assets/images/dazpay-terminal.png"
                alt="DazPay Terminal"
                width={400}
                height={300}
              />
              
              {/* Floating stats */}
              <div>
                Instantané
              </div>
              
              <div>
                0 Sats installation
              </div>
            </div>

            {/* Features floating */}
            <div>
              ⚡ Paiements Lightning
            </div>
            
            <div>
              💰 Conversion EUR
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div>
        <div>
          <p className="text-sm mb-2">Découvrir les fonctionnalités</p>
          <div>
            <svg>
              <path></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DazPayHero;
export const dynamic = "force-dynamic";
