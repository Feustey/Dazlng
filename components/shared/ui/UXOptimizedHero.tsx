import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";
import { useConversionTracking } from "../../../hooks/useConversionTracking";
import { Clock, CheckCircle, Users, Shield, Zap, TrendingUp } from "@/components/shared/ui/IconRegistry";

const UXOptimizedHero: React.FC = () => {
  const router = useRouter();
  const { t } = useAdvancedTranslation("common");
  const { trackStep } = useConversionTracking();
  const [timeLeft, setTimeLeft] = useState({ hours: 2.3, minutes: 4.5, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartFree = (): void => {
    trackStep("cta_click", "Start free clicked", { location: "UXOptimizedHero" });
    router.push("/register");
  };

  const handleViewDemo = (): void => {
    trackStep("demo_click", "View demo clicked", { location: "UXOptimizedHero" });
    router.push("/demo");
  };

  return (
    <section>
      <div>
        <div>
          <Clock />
          Offre limitée : {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
        </div>

        <div>
          <Image 
            src="/assets/images/hero-bg.jpg" 
            alt="DazNode Hero Background" 
            width={800} 
            height={600} 
          />
        </div>

        <div>
          <h1>
            L&apos;IA qui surveille vos{" "}
            <span>
              canaux Lightning
            </span>{" "}
            24/7
          </h1>
          
          <p>
            Évitez les force-closes et maximisez vos revenus automatiquement.
            <br />
            <strong className="text-[#00D4AA]">{t("UXOptimizedHero.seule_ia_qui_prdit_les_forcecl")}</strong>
          </p>

          <div>
            <div>
              <CheckCircle />
              <span>{t("UXOptimizedHero.2_ans_daposexprience_en_production")}</span>
            </div>
            <div>
              <Users />
              <span>{t("UXOptimizedHero.500_node_runners_actifs")}</span>
            </div>
            <div>
              <Shield />
              <span>{t("UXOptimizedHero.999_de_prcision")}</span>
            </div>
          </div>
        </div>

        <div>
          <button onClick={handleStartFree}>
            <span>
              <Zap />
              Essai gratuit 7 jours
            </span>
          </button>
          
          <button onClick={handleViewDemo}>
            <TrendingUp />
            Voir la démo
          </button>
        </div>

        <div>
          <div>
            <div className="text-3xl font-bold text-[#F7931A] mb-2">50-200€</div>
            <div className="text-gray-300 text-sm">{t("UXOptimizedHero.revenus_mensuels")}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00D4AA] mb-2">15-25%</div>
            <div className="text-gray-300 text-sm">{t("UXOptimizedHero.roi_annuel")}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#FFE500] mb-2">{t("UXOptimizedHero.48_mois")}</div>
            <div className="text-gray-300 text-sm">Amortissement</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00D4AA] mb-2">6h</div>
            <div className="text-gray-300 text-sm">{t("UXOptimizedHero.prdiction_avance")}</div>
          </div>
        </div>

        <div>
          <div>
            <Shield />
            <h3 className="text-xl font-bold text-white">{t("UXOptimizedHero.garantie_30_jours_satisfait_ou")}</h3>
          </div>
          <p>
            Si vous ne générez pas au moins <strong className="text-[#F7931A]">{t("UXOptimizedHero.50_de_revenus")}</strong> dans vos 30 premiers jours, 
            nous vous remboursons intégralement.
          </p>
        </div>

        <div>
          <div onClick={() => document.getElementById("problem-section")?.scrollIntoView({ behavior: "smooth" })}>
            <span className="text-sm font-medium mb-2">{t("UXOptimizedHero.dcouvrir_le_problme")}</span>
            <div>
              <svg>
                <path />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UXOptimizedHero; 