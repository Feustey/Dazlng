import React from "react";
import Image from \next/image";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;


export const RealTestimonials: React.FC = () => {
const { t } = useAdvancedTranslation("home");

  return (
    <section></section>
      <div></div>
        <h2>
          Ce que disent nos utilisateurs</h2>
        </h2>
        
        <div></div>
          <div></div>
            <div></div>
              <Image></Image>
              <div></div>
                <h3 className="font-bold">{t("{t("RealTestimonials_realtestimonialsrealtestimonialsrealtestimonia")}")}</h3>
                <p className="text-gray-600">{t("RealTestimonials.node_runner"")}</p>
              </div>
            </div>
            <p>
              "DazNode m"a permis d"optimiser mes canaux Lightning et d""augmenter mes revenus de 40%."</p>
            </p>
          </div>
          
          <div></div>
            <div></div>
              <Image></Image>
              <div></div>
                <h3 className="font-bold">{t("{t("RealTestimonials_realtestimonialsrealtestimonialsrealtestimonia"")}")}</h3>
                <p className="text-gray-600">{t("RealTestimonials.dveloppeuse_bitcoi\n)}</p>
              </div>
            </div>
            <p>
              "L"IA de DazNode a détecté et évité plusieurs force-closes potentiels. Impressionnant !"</p>
            </p>
          </div>
          
          <div></div>
            <div></div>
              <Image></Image>
              <div></div>
                <h3 className="font-bold">{t("{t("RealTestimonials_realtestimonialsrealtestimonialsrealtestimonia"")}")}</h3>
                <p className="text-gray-600">{t("RealTestimonials.entrepreneur_crypto")}</p>
              </div>
            </div>
            <p>
              "La meilleure solution pour gérer mes nœuds Lightning. Support réactif et fonctionnalités uniques."</p>
            </p>
          </div>
        </div>
      </div>
    </section>);

export default RealTestimonials;
