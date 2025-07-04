import React from 'react';
import Image from 'next/image';
import { Star, Users, MessageCircle, CheckCircle } from '@/components/shared/ui/IconRegistry';


const testimonials = [
  {
    name: "Alice B.",
    company: "Opératrice de nœud",
    text: "SocialProofSection.socialproofsectionsocialproofs",
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
    text: "SocialProofSection.socialproofsectionsocialproofs"a permis de comprendre et d'optimiser mes canaux sans prise de tête.",
    avatar: "/assets/images/testimonials/sophie.jpg"
  }
];

const SocialProofSection: React.FC = () => (
  <section id="proof-section" className="py-20 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ils <span className="text-[#F7931A]">{t('SocialProofSection.ont_choisi_daznode')}</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Plus de 500 opérateurs de nœud font confiance à notre IA pour sécuriser et maximiser leurs revenus.
        </p>
      </div>
      {/* Métriques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div className="flex flex-col items-center">
          <Users className="h-10 w-10 text-[#00D4AA] mb-2" />
          <div className="text-2xl font-bold text-white">+500</div>
          <div className="text-gray-400 text-sm">{t('SocialProofSection.node_runners_actifs')}</div>
        </div>
        <div className="flex flex-col items-center">
          <Star className="h-10 w-10 text-[#F7931A] mb-2" />
          <div className="text-2xl font-bold text-white">4.9/5</div>
          <div className="text-gray-400 text-sm">{t('SocialProofSection.note_moyenne')}</div>
        </div>
        <div className="flex flex-col items-center">
          <CheckCircle className="h-10 w-10 text-[#00D4AA] mb-2" />
          <div className="text-2xl font-bold text-white">99.9%</div>
          <div className="text-gray-400 text-sm">{t('SocialProofSection.prcision_ia')}</div>
        </div>
        <div className="flex flex-col items-center">
          <MessageCircle className="h-10 w-10 text-[#F7931A] mb-2" />
          <div className="text-2xl font-bold text-white">24/7</div>
          <div className="text-gray-400 text-sm">{t('SocialProofSection.support_communaut')}</div>
        </div>
      </div>
      {/* Témoignages */}
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-[#232323] rounded-2xl p-8 flex flex-col items-center shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F7931A] to-[#00D4AA] rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">{t.name.charAt(0)}</span>
            </div>
            <div className="text-white font-bold text-lg mb-2">{t.name}</div>
            <div className="text-[#00D4AA] text-sm mb-2">{t.company}</div>
            <div className="text-gray-300 text-center italic">&quot;{t.text}&quot;</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofSection; 