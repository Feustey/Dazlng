"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useConversionTracking } from "../../../hooks/useConversionTracking";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const DazNodeHero: React.FC = () => {
  const { t } = useAdvancedTranslation("common");

  const router = useRouter();
  const { trackEvent } = useConversionTracking();

  const handleStartProfessional = (): void => {
    trackEvent("hero_cta", { product: "daznode", action: "start_professional" });
    router.push("/checkout/daznode?plan=professional");
  };

  const handleLearnMore = (): void => {
    trackEvent("hero_cta", { product: "daznode", action: "learn_more" });
    const element = document.getElementById("features");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewDemo = (): void => {
    trackEvent("hero_cta", { product: "daznode", action: "view_demo" });
    router.push("/demo");
  };

  return (
    <section>
      {/* Background Effects */}
      <div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.svg')] bg-center bg-repeat opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div>
        {/* Contenu texte */}
        <div>
          {/* Badge professionnel */}
          <div>
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            Solution Professionnelle Lightning Network
          </div>

          {/* Titre principal */}
          <div>
            <h1>
              DazNode
              <span>
                IA + Analytics
              </span>
            </h1>
            
            <p>
              Optimisez vos nœuds Lightning avec notre{" "}
              <span>
                Intelligence Artificielle avancée
              </span>
              . Analytics temps réel, optimisation des canaux et revenus maximisés.
            </p>
          </div>

          {/* Métriques clés */}
          <div>
            <div>
              <div className="text-3xl font-bold text-cyan-300 mb-2">+40%</div>
              <div className="text-blue-100 text-sm">{t("Hero.revenus_optimises")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-300 mb-2">99.98%</div>
              <div className="text-blue-100 text-sm">{t("Hero.uptime_garanti")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-300 mb-2">24/7</div>
              <div className="text-blue-100 text-sm">{t("Hero.ia_monitoring")}</div>
            </div>
          </div>

          {/* Points clés techniques */}
          <div>
            <div>
              <div>
                <svg>
                  <path></path>
                </svg>
              </div>
              <span className="font-medium">{t("Hero.optimisation_ia_des_routes_de_paiement")}</span>
            </div>
            <div>
              <div>
                <svg>
                  <path></path>
                </svg>
              </div>
              <span className="font-medium">{t("Hero.analytics_predictives_et_alertes")}</span>
            </div>
            <div>
              <div>
                <svg>
                  <path></path>
                </svg>
              </div>
              <span className="font-medium">{t("Hero.gestion_multinuds_avec_api_complete")}</span>
            </div>
          </div>

          {/* Call-to-Action */}
          <div>
            <button onClick={handleStartProfessional}>
              <span>Commencer</span>
              <svg>
                <path></path>
              </svg>
            </button>
            
            <button onClick={handleViewDemo}>
              Voir la Démo Live
            </button>
          </div>

          {/* Garanties professionnelles */}
          <div>
            <div>
              <div>
                <svg>
                  <path></path>
                </svg>
                <span>{t("Hero.sla_9998_avec_compensation")}</span>
              </div>
              <div>
                <svg>
                  <path></path>
                </svg>
                <span>{t("Hero.support_prioritaire_247")}</span>
              </div>
              <div>
                <svg>
                  <path></path>
                </svg>
                <span>{t("Hero.audit_de_securite_inclus")}</span>
              </div>
              <div>
                <svg>
                  <path></path>
                </svg>
                <span>{t("Hero.conformite_reglementaire")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div>
          <div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-3xl blur-3xl opacity-30 scale-110"></div>
            
            {/* Dashboard mock */}
            <div>
              <Image 
                src="/assets/images/daznode-dashboard.png"
                alt="DazNode Dashboard Preview"
                width={500}
                height={300}
              />
              
              {/* Floating metrics */}
              <div>
                +40% ROI
              </div>
              
              <div>
                IA Active
              </div>
              
              <div>
                Analytics Live
              </div>
            </div>

            {/* Demo overlay */}
            <div>
              <button onClick={handleViewDemo}>
                <svg>
                  <path></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div>
        <button onClick={handleLearnMore}>
          <span className="text-sm font-medium mb-2">{t("Hero.decouvrir_les_fonctionnalites")}</span>
          <svg>
            <path></path>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default DazNodeHero;