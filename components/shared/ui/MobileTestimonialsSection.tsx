import React from 'react';

import MobileAccordion from './MobileAccordion';
import { Star, Quote, TrendingUp, Shield, Zap, Clock } from '@/components/shared/ui/IconRegistry';

const MobileTestimonialsSection: React.FC = () => {
  const testimonialItems = [
    {
      id: 'testimonial-1',
      title: 'Alice B. - Opératrice de nœud',
      icon: <Quote className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#F7931A] text-[#F7931A]" />
            ))}
          </div>
          <blockquote className="text-gray-300 italic text-lg">
            &quot;DazNode a sauvé mon capital deux fois en prédisant un force-close. 
            Je dors enfin tranquille et mes revenus ont augmenté de 60% en 3 mois.&quot;
          </blockquote>
          <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-[#00D4AA] font-semibold">
              <TrendingUp className="h-4 w-4" />
              <span>{t('MobileTestimonialsSection.60_de_revenus_en_3_mois')}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'testimonial-2',
      title: 'Marc L. - Node runner pro',
      icon: <Quote className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#F7931A] text-[#F7931A]" />
            ))}
          </div>
          <blockquote className="text-gray-300 italic text-lg">
            &quot;L&apos;IA fait vraiment la différence. J&apos;ai gagné 15h par semaine 
            et mes revenus sont plus stables que jamais.&quot;
          </blockquote>
          <div className="bg-[#F7931A]/10 border border-[#F7931A]/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-[#F7931A] font-semibold">
              <Clock className="h-4 w-4" />
              <span>{t('MobileTestimonialsSection.15h_conomises_par_semaine')}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'testimonial-3',
      title: 'Sophie T. - Bitcoiner',
      icon: <Quote className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#F7931A] text-[#F7931A]" />
            ))}
          </div>
          <blockquote className="text-gray-300 italic text-lg">
            &quot;La seule solution qui m&apos;a permis de comprendre et d&apos;optimiser 
            mes canaux sans prise de tête. Interface intuitive et support réactif.&quot;
          </blockquote>
          <div className="bg-[#FFE500]/10 border border-[#FFE500]/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-[#FFE500] font-semibold">
              <Shield className="h-4 w-4" />
              <span>{t('MobileTestimonialsSection.interface_intuitive')}</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#1A1A1A] to-[#232323]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ils <span className="text-[#F7931A]">{t('MobileTestimonialsSection.tmoignent')}</span>
          </h2>
          <p className="text-gray-300">
            Découvrez les expériences de nos utilisateurs
          </p>
        </div>
        
        <div className="md:hidden">
          <MobileAccordion 
            items={testimonialItems} 
            defaultOpen="testimonial-1"
          />
        </div>
        
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonialItems.map((item) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#F7931A]">{item.icon}</span>
                <h3 className="font-semibold text-white text-lg">{item.title}</h3>
              </div>
              <div className="text-gray-300">
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