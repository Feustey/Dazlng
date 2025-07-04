import React from "react";
import Image from "next/image";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";
import { Star, Users, MessageCircle, CheckCircle } from "@/components/shared/ui/IconRegistry";

const SocialProofSection: React.FC = () => {
  const { t } = useAdvancedTranslation("common");
  
  const testimonials = [
    {
      name: "Alice B.",
      company: "Opératrice de nœud",
      text: "L'IA de DazNode m'a permis d'optimiser mes canaux en quelques clics. Résultat : +40% de revenus !",
      avatar: "/assets/images/testimonials/alice.jpg"
    },
    {
      name: "Marc L.",
      company: "Node runner pro",
      text: "J'ai augmenté mes revenus de 60% en 3 mois. L'IA fait vraiment la différence.",
      avatar: "/assets/images/testimonials/marc.jpg"
    },
    {
      name: "Sophie T.",
      company: "Bitcoiner",
      text: "DazNode m'a permis de comprendre et d'optimiser mes canaux sans prise de tête.",
      avatar: "/assets/images/testimonials/sophie.jpg"
    }
  ];

  return (
    <section>
      <div>
        <div>
          <h2>
            Ils <span className="text-[#F7931A]">{t("SocialProofSection.ont_choisi_daznode")}</span>
          </h2>
          <p>
            Plus de 500 opérateurs de nœud font confiance à notre IA pour sécuriser et maximiser leurs revenus.
          </p>
        </div>
        {/* Métriques */}
        <div>
          <div>
            <Users />
            <div className="text-2xl font-bold text-white">+500</div>
            <div className="text-gray-400 text-sm">{t("SocialProofSection.node_runners_actifs")}</div>
          </div>
          <div>
            <Star />
            <div className="text-2xl font-bold text-white">4.9/5</div>
            <div className="text-gray-400 text-sm">{t("SocialProofSection.note_moyenne")}</div>
          </div>
          <div>
            <CheckCircle />
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-gray-400 text-sm">{t("SocialProofSection.prcision_ia")}</div>
          </div>
          <div>
            <MessageCircle />
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-gray-400 text-sm">{t("SocialProofSection.support_communaut")}</div>
          </div>
        </div>
        {/* Témoignages */}
        <div>
          {testimonials.map((testimonial, i) => (
            <div key={i}>
              <div>
                <span className="text-white font-bold text-xl">{testimonial.name.charAt(0)}</span>
              </div>
              <div className="text-white font-bold text-lg mb-2">{testimonial.name}</div>
              <div className="text-[#00D4AA] text-sm mb-2">{testimonial.company}</div>
              <div className="text-gray-300 text-center italic">&quot;{testimonial.text}&quot;</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection; 