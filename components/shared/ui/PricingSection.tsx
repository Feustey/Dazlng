import React from 'react';
import { CheckCircle, Zap } from '@/components/shared/ui/IconRegistry';


const plans = [
  {
    name: "Essai gratuit",
    price: "0€",
    features: [
      "7 jours d'accès complet",
      "Monitoring IA 24/7",
      "Alertes force-close",
      "Support communauté"
    ],
    cta: "Commencer l'essai",
    highlight: false,
    link: "/register"
  },
  {
    name: "DazNode Pro",
    price: "29€/mois",
    features: [
      "Toutes les fonctionnalités IA",
      "Optimisation automatique",
      "Rapports détaillés",
      "Support prioritaire"
    ],
    cta: "S'abonner",
    highlight: true,
    link: "/checkout/daznode"
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    features: [
      "Gestion multi-nœuds",
      "SLA personnalisé",
      "Intégration API",
      "Support dédié"
    ],
    cta: "Contactez-nous",
    highlight: false,
    link: "/contact"
  }
];

const PricingSection: React.FC = () => (
  <section id="pricing-section" className="py-20 bg-gradient-to-br from-[#232323] to-[#1A1A1A]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Tarifs <span className="text-[#F7931A]">{t('PricingSection.simples_transparents')}</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Aucun engagement. Annulable à tout moment.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`rounded-2xl p-8 shadow-xl border-2 ${plan.highlight ? "border-[#F7931A] bg-[#1A1A1A]" : "border-gray-700 bg-[#232323]"}`}
          >
            <div className="text-2xl font-bold text-white mb-2">{plan.name}</div>
            <div className="text-4xl font-extrabold text-[#F7931A] mb-6">{plan.price}</div>
            <ul className="mb-8 space-y-3">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center text-gray-200">
                  <CheckCircle className="h-5 w-5 text-[#00D4AA] mr-2" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={plan.link}
              className={`block w-full text-center py-4 rounded-xl font-bold text-lg transition-all ${
                plan.highlight
                  ? "bg-gradient-to-r from-[#F7931A] to-[#FFE500] text-black hover:scale-105"
                  : "border-2 border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-black"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection; 