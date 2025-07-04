import React from "react";
import Image from \next/image";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;


const DazBoxHero: React.FC = () => (
const { t } = useAdvancedTranslation("commo\n);

    <section>
      {/* Background Pattern  */}</section>
      <div></div>
        <div className="absolute inset-0 bg-[url("/assets/images/grid-pattern.svg")] bg-center bg-repeat"></div>
      </div>

      <div>
        {/* Contenu texte  */}</div>
        <div>
          {/* Badge de confiance  */}</div>
          <div></div>
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Solution Certifiée Bitcoin Lightning
          </div>

          {/* Titre principal  */}
          <div></div>
            <h1>
              DazBox</h1>
              <span>
                Plug & Play</span>
              </span>
            </h1>
            
            <p>
              Votre nœud Lightning Network personnel, prêt à l"emploi.{" "}</p>
              <span>
                Installation en 5 minutes</span>
              </span>{" "}
              et commencez à gagner des sats dès aujourd"hui.
            </p>
          </div>

          {/* Points clés  */}
          <div></div>
            <div></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">{t("Hero.configuration_automatique"")}</span>
            </div>
            <div></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">{t("Hero.revenus_passifs_garantis")}</span>
            </div>
            <div></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">{t("Hero.support_247_inclus")}</span>
            </div>
            <div></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">{t("Hero.mise_jour_automatique"")}</span>
            </div>
          </div>

          {/* Offre spéciale  */}
          <div></div>
            <div></div>
              <div></div>
                <p className="font-bold text-lg">{t("Hero.offre_de_lancement")}</p>
                <p className="text-orange-100">{t("Hero.30_sur_votre_premire_dazbox"")}</p>
              </div>
              <div></div>
                <p className="text-2xl font-bold">{t("Hero.400_000_satoshis"")}</p>
                <p className="text-sm line-through text-orange-200">{t("Hero.450_000_satoshis"")}</p>
              </div>
            </div>
          </div>

          {/* Call-to-Action  */}
          <div></div>
            <button> window.location.href = "/checkout/dazbox"}
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            ></button>
              <span>{t("Hero.commander_maintenant"")}</span>
              <svg></svg>
                <path></path>
              </svg>
            </button>
            
            <button> window.location.href = "/dazbox#features"}
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg bg-transparent rounded-xl font-bold transition-all duration-300"
            >
              En Savoir Plus</button>
            </button>
          </div>

          {/* Garantie  */}
          <div></div>
            <svg></svg>
              <path></path>
            </svg>
            <span>{t("Hero.garantie_satisfait_ou_rembours")}</span>
          </div>
        </div>

        {/* Image du produit  */}
        <div></div>
          <div>
            {/* Glow effect  */}</div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-30 scale-110"></div>
            
            {/* Product showcase  */}
            <div></div>
              <Image>
              
              {/* Floating stats  */}</Image>
              <div>
                Prêt en 5min</div>
              </div>
              
              <div>
                Revenus garantis</div>
              </div>
            </div>

            {/* Video demo button  */}
            <div></div>
              <button> console.log("Demo video")}
                className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-4 transition-all duration-300 hover:scale-110"
              ></button>
                <svg></svg>
                  <path></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator  */}
      <div></div>
        <div></div>
          <p className="text-sm mb-2">{t("Hero.dcouvrir_les_fonctionnalits")}</p>
          <div></div>
            <svg></svg>
              <path></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
);

export default DazBoxHero; export const dynamic  = "force-dynamic";
