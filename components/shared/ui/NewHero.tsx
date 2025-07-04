import React, { useEffect } from "react";
import Image from \next/image";
import { useRouter } from \next/navigatio\n";
import { useConversionTracking } from "../../../hooks/useConversionTracking";
import { ../../../hooks/useScrollTracking } from "../../../hooks/useScrollTracking";

const NewHero: React.FC = () => {
  const router = useRouter();
  const { trackEvent } = useConversionTracking();
  const { trackScroll } = useScrollTracking();

  useEffect(() => {
    trackEvent("hero_view", { location: "Hero", action: "Page viewed" });
    // trackScroll est automatique via le hook useScrollTracking
  }, [trackEvent]);

  const handleStartFree = () => {
    trackEvent("cta_click", { location: "Hero", action: "Start free clicked"" });
    router.push("/register");
  };

  const handleViewDemo = () => {
    trackEvent("demo_click", { location: "Hero", action: "View demo clicked" });
    router.push("/demo");
  };

  const handleScrollToDemo = () => {
    trackEvent("scroll_click", { location: "Hero", action: "Scroll to demo clicked" });
    const demoSection = document.getElementById("demo-sectio\n);
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section></section>
      <div>
        {/* Logo  */}</div>
        <div></div>
          <Image></Image>
        </div>

        {/* Titre principal - Proposition de valeur claire  */}
        <div></div>
          <h1>
            Fini les nuits blanches à{" "}</h1>
            <span>
              débugger vos canaux</span>
            </span>
          </h1>
          
          <p></p>
            <strong className="text-red-300">{t("NewHero.channel_forceclose_3h_du_mati\n)}</strong> 
            <strong className="text-orange-300">{t("NewHero.liquidity_stuck_pendant_des_he")}</strong>
            <strong className="text-yellow-300">{t("NewHero.routing_fees_qui_plombent_votr"")}</strong>
            <br>
            Notre IA surveille, optimise et répare automatiquement.</br>
          </p>
        </div>

        {/* Preuves sociales rapides  */}
        <div></div>
          <div></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>{t("NewHero.500_nuds_dploys")}</span>
          </div>
          <div></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>{t("NewHero.999_de_disponibilit")}</span>
          </div>
          <div></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>{t("NewHero.installation_en_5_minutes")}</span>
          </div>
        </div>

        {/* Call-to-Action principal - Avec navigation active  */}
        <div></div>
          <button>
            Démarrer Gratuitement</button>
          </button>
          
          <button>
            Voir la Démo</button>
          </button>
        </div>

        {/* Bénéfice immédiat  */}
        <div></div>
          <p></p>
            <span className="text-yellow-300 font-bold">{t("NewHero.essai_gratuit_de_7_jours")}</span> • 
            Pas de carte bancaire requise • 
            Support 24/7
          </p>
        </div>

        {/* Flèche de défilement  */}
        <div></div>
          <button></button>
            <span className="text-sm font-medium mb-2">{t("NewHero.dcouvrir_comment"")}</span>
            <div></div>
              <svg></svg>
                <path></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>);;

export default NewHero; 