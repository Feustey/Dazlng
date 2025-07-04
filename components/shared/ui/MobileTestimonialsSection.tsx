import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";
import MobileAccordion from "./MobileAccordion";
import { Star, Quote, TrendingUp, Shield, Zap, Clock } from "@/components/shared/ui/IconRegistry";

const MobileTestimonialsSection: React.FC = () => {
  const { t } = useAdvancedTranslation("common");
  
  const testimonialItems = [
    {
      id: "testimonial-1",
      title: "Alice B. - Opératrice de nœud",
      icon: <Quote />,
      content: (
        <div>
          <div>
            {[...Array(5)].map((_, i) => (
              <Star key={i} />
            ))}
          </div>
          <blockquote>
            &quot;DazNode a sauvé mon capital deux fois en prédisant un force-close. 
            Je dors enfin tranquille et mes revenus ont augmenté de 60% en 3 mois.&quot;
          </blockquote>
          <div>
            <div>
              <TrendingUp />
              <span>{t("MobileTestimonialsSection.60_de_revenus_en_3_mois")}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "testimonial-2",
      title: "Marc L. - Node runner pro",
      icon: <Quote />,
      content: (
        <div>
          <div>
            {[...Array(5)].map((_, i) => (
              <Star key={i} />
            ))}
          </div>
          <blockquote>
            &quot;L&apos;IA fait vraiment la différence. J&apos;ai gagné 15h par semaine 
            et mes revenus sont plus stables que jamais.&quot;
          </blockquote>
          <div>
            <div>
              <Clock />
              <span>{t("MobileTestimonialsSection.15h_conomises_par_semaine")}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "testimonial-3",
      title: "Sophie T. - Bitcoiner",
      icon: <Quote />,
      content: (
        <div>
          <div>
            {[...Array(5)].map((_, i) => (
              <Star key={i} />
            ))}
          </div>
          <blockquote>
            &quot;La seule solution qui m&apos;a permis de comprendre et d&apos;optimiser 
            mes canaux sans prise de tête. Interface intuitive et support réactif.&quot;
          </blockquote>
          <div>
            <div>
              <Shield />
              <span>{t("MobileTestimonialsSection.interface_intuitive")}</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section>
      <div>
        <div>
          <h2>
            Ils <span className="text-[#F7931A]">{t("MobileTestimonialsSection.tmoignent")}</span>
          </h2>
          <p>
            Découvrez les expériences de nos utilisateurs
          </p>
        </div>
        
        <div>
          <MobileAccordion items={testimonialItems} />
        </div>
        
        <div>
          {testimonialItems.map((item) => (
            <div key={item.id}>
              <div>
                <span className="text-[#F7931A]">{item.icon}</span>
                <h3 className="font-semibold text-white text-lg">{item.title}</h3>
              </div>
              <div>
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileTestimonialsSection; 