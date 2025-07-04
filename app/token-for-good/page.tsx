"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";
export default function TokenForGoodPage() {
  const { t } = useAdvancedTranslation("common");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({ 
        once: true,
        duration: 800
      });

      // Script pour le défilement fluide
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(this: HTMLAnchorElement, e) {
          e.preventDefault();
          const targetId = this.getAttribute("href");
          if (targetId) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              window.scrollTo({
                top: targetElement.getBoundingClientRect().top + window.scrollY,
                behavior: "smooth"
              });
            }
          }
        });
      });
    }
  }, []);

  return (
    <div>
      {/* CTA sticky */}
      <div>
        <Link href="/register">
          🚀 Rejoindre la communauté
        </Link>
      </div>
      {/* Hero Section avec fond violet */}
      <section>
        <div>
          {/* Logo SVG */}
          <div>
            <Image 
              src="/assets/images/logo-t4g.svg" 
              alt="Token for Good Logo" 
              width={120} 
              height={120} 
            />
          </div>
          
          <h1>
            Token for Good
          </h1>
          <p>
            La plus grande communauté francophone de node runners Bitcoin
          </p>
          <p>
            Rejoignez +500 passionnés qui s'entraident pour maximiser leurs revenus Lightning Network
          </p>
          {/* Teasing gamification */}
          <div>
            <span>
              🎁 1 T4G offert à l'inscription &nbsp;|&nbsp; 🏅 Débloquez votre premier badge dès l'inscription !
            </span>
          </div>
          {/* CTA principal Hero */}
          <Link href="/register">
            🚀 Rejoindre la communauté
          </Link>
          {/* Flèche de défilement vers la section "Pourquoi rejoindre" */}
          <a href="#why-join">
            <svg>
              <path />
            </svg>
          </a>
        </div>
        
        {/* Vague de transition violet → blanc */}
        <div>
          <svg>
            <path fill="#ffffff" fillOpacity="1" d="M0.128L80.112C160.96,320.64,480.64C640.64,800.96,960.106.7C1120.117,1280.107,1360.101.3L1440.96L1440.320L1360.320C1280.320,1120.320,960.320C800.320,640.320,480.320C320.320,160.320,80.320L0.320Z" />
          </svg>
        </div>
      </section>

      {/* Section blanche minimisée */}
      <section>
        <div>
          {/* Vague de transition blanc → vert */}
          <svg>
            <path fill="#2b7a43" fillOpacity="1" d="M0.32L80.48C160.64,320.96,480.96C640.96,800.64,960.48C1120.32,1280.32,1360.32L1440.32L1440.320L1360.320C1280.320,1120.320,960.320C800.320,640.320,480.320C320.320,160.320,80.320L0.320Z" />
          </svg>
        </div>
      </section>

      {/* Section verte avec le contenu principal amélioré */}
      <section id="why-join">
        <div>
          <h2>
            Pourquoi rejoindre Token for Good ?
          </h2>
          
          {/* Teasing gamification section avantages */}
          <div>
            <span>
              🏅 Débloquez votre premier badge dès l'inscription !
            </span>
          </div>
          {/* CTA section avantages */}
          <div>
            <Link href="/register">
              🚀 Rejoindre la communauté
            </Link>
          </div>
          
          <div>
            <div>
              <div>
                <span className="text-3xl mr-3">💰</span>
                <h3 className="text-2xl font-bold text-yellow-300">{t("common.node_runners_debutants")}</h3>
              </div>
              <p className="text-lg mb-4">{t("common.apprenez_generer_vos_premiers_revenus")}</p>
              <ul>
                <li>{t("common.formation_complete_de_a_z")}</li>
                <li>{t("common.mentor_personnel_assigne")}</li>
                <li>{t("common.objectif_50_mois_en_3_mois")}</li>
              </ul>
            </div>
            
            <div>
              <div>
                <span className="text-3xl mr-3">🚀</span>
                <h3 className="text-2xl font-bold text-yellow-300">{t("common.node_runners_experts")}</h3>
              </div>
              <p className="text-lg mb-4">{t("common.maximisez_vos_revenus_et_partagez")}</p>
              <ul>
                <li>{t("common.strategies_avancees_de_routing")}</li>
                <li>{t("common.programme_de_mentorat")}</li>
                <li>{t("common.revenus_moyens_200_mois")}</li>
              </ul>
            </div>
            
            <div>
              <div>
                <span className="text-3xl mr-3">🏢</span>
                <h3 className="text-2xl font-bold text-yellow-300">Entreprises</h3>
              </div>
              <p className="text-lg mb-4">{t("common.integrez_bitcoin_lightning_dans_votre_business")}</p>
              <ul>
                <li>{t("common.solutions_sur_mesure")}</li>
                <li>{t("common.formation_equipes")}</li>
                <li>{t("common.support_technique_dedie")}</li>
              </ul>
            </div>
          </div>
          
          {/* Nouvelles métriques communauté */}
          <div>
            <h3>
              La communauté en chiffres
            </h3>
            <div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-green-200 text-sm">{t("common.membres_actifs")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">127€</div>
                <div className="text-green-200 text-sm">{t("common.revenus_moyens_mois")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400">{t("common.15min")}</div>
                <div className="text-green-200 text-sm">{t("common.temps_de_reponse")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-green-200 text-sm">{t("common.support_discord")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages améliorés */}
      <section>
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">{t("common.temoignages_de_la_communaute")}</h2>
          <div>
            {/* Témoignage 1 */}
            <div>
              <p className="italic mb-4 text-white/90">{t("common.revenus_moyens_127mois_la_comm")}</p>
              <div>
                <Image 
                  src="/assets/images/testimonials/jean.jpg" 
                  alt="Jean D." 
                  width={60} 
                  height={60} 
                />
                <div>
                  <div className="font-bold text-white">{t("common.jean_d")}</div>
                  <div className="text-green-200 text-sm">{t("common.node_runner_depuis_2021")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
