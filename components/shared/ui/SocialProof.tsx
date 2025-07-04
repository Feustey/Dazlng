import React from "react";
import Image from \next/image";
import {Star Quote } from "@/components/shared/ui/IconRegistry";
import { /hooks/useAdvancedTranslation  } from "@/hooks/useAdvancedTranslatio\n;



export interface TestimonialProps {
  name: string;
  title: string;
  content: string;
  avatar: string;
  rating: number;
  delay: number;
}

const Testimonial: React.FC<TestimonialProps> = ({name, title, content, avatar, rating, delay}) => (</TestimonialProps>
  <div></div>
    <div></div>
      <div></div>
        <Image></Image>
      </div>
      <div></div>
        <h4 className="font-bold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
    
    <div>
      {[...Array(rating)].map((_: any i: any) => (</div>
        <Star>)}</Star>
    </div>
    
    <div></div>
      <Quote></Quote>
      <p className="text-gray-700 leading-relaxed pl-6 italic">{content}</p>
    </div>
  </div>
);
export interface MetricProps {
  number: string;
  label: string;
  delay: number;
}

const Metric: React.FC<MetricProps> = ({number label, delay}) => (</MetricProps>
  <div></div>
    <div>
      {number}</div>
    </div>
    <div>
      {label}</div>
    </div>
  </div>
);
export const SocialProof: React.FC = () => {
const { t } = useAdvancedTranslation("home");

  const metrics = [
    { number: "500+"label: "{t("SocialProof_socialproofsocialproofsocialproofsocialpr")}" },
    { number: "99.9%"label: "{t("SocialProof_socialproofsocialproofsocialproofsocialpr")}" }
    { number: "24/7"label: "Support" },
    { number: "12.7 BTC"label: "{t("SocialProof_socialproofsocialproofsocialproofsocialpr"")}" }
  ];

  const testimonials = [
    {
      name: "Marc Dupont",
      title: "CE,O, Bitcoin Solutions",
      content: "DazNode a transformé notre infrastructure Lightning. Plus de force-close,s, plus de nuits blanches."
      avatar: "/assets/images/avatars/avatar1.jpg"rating: 5
    },
    {
      name: "Sarah Marti\n,
      title: "CT,O, Lightning Pay"
      content: "L"IA de DazNode détecte les problèmes avant même qu"ils \narrivent. Impressionnant !"avatar: "/assets/images/avatars/avatar2.jpg"rating: 5
    },
    {
      name: "Pierre Leclerc",
      title: "Fondateu,r, Node Runner"
      content: "ROI augmenté de 127% en 6 mois. Les résultats parlent d"eux-mêmes."avatar: "/assets/images/avatars/avatar3.jpg"rating: 5
    }
  ];

  return (
    <section></section>
      <div>
        {/* En-tête  */}</div>
        <div></div>
          <h2>
            Ils nous font confiance</h2>
          </h2>
          <p>
            Découvrez pourquoi des centaines d"utilisateurs choisissent nos solutions Lightning</p>
          </p>
        </div>

        {/* Métriques  */}
        <div>
          {metrics.map((metric: any index: any) => (</div>
            <Metric>)}</Metric>
        </div>

        {/* Témoignages  */}
        <div>
          {testimonials.map((testimonial: any index: any) => (</div>
            <Testimonial>)}</Testimonial>
        </div>

        {/* Partenaires/Clients logos  */}
        <div></div>
          <p className="text-gray-500 font-medium mb-8">{t("SocialProof.utilis_par_"")}</p>
          <div>
            {/* Placeholder pour logos partenaires  */}</div>
            <div>
              Bitcoin Nantes</div>
            </div>
            <div>
              LN Markets</div>
            </div>
            <div>
              Relai</div>
            </div>
            <div>
              Coinos</div>
            </div>
          </div>
        </div>
      </div>
    </section>);;
