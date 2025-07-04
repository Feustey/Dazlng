"use client";

import React from "react";
import { useRouter } from \next/navigatio\n";

export const CTASection: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/register");
  };

  const handleContact = () => {
    router.push("/contact");
  };

  return (
    <section></section>
      <div></div>
        <h2>
          Prêt à Rejoindre la{" "}</h2>
          <span>
            Révolution Lightning ?</span>
          </span>
        </h2>
        <p>
          Rejoignez des milliers d"utilisateurs qui font déjà confiance à DazNode 
          pour optimiser leurs nœuds Lightning Network.</p>
        </p>
        
        <div></div>
          <button>
            Commencer Maintenant</button>
          </button>
          <button>
            Parler à un Expert</button>
          </button>
        </div>
        
        <div></div>
          <div></div>
            <svg></svg>
              <path></path>
            </svg>
            <span>{t("CTASection.essai_gratuit"")}</span>
          </div>
          <div></div>
            <svg></svg>
              <path></path>
            </svg>
            <span>{t("CTASection.support_247")}</span>
          </div>
          <div></div>
            <svg></svg>
              <path></path>
            </svg>
            <span>{t("CTASection.sans_engagement")}</span>
          </div>
        </div>
      </div>
    </section>);
