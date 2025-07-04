import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const CommunitySection: React.FC = () => {
  const { t } = useAdvancedTranslation("home");

  const stats = [
    { label: "Nœuds actifs", value: "847", unit: "" },
    { label: "Uptime moyen", value: "99.9", unit: "%" },
    { label: "Capacité totale", value: "157", unit: " BTC" },
    { label: "Note utilisateurs", value: "4.8", unit: "/5" }
  ];

  const testimonials = [
    {
      name: "Thomas L.",
      role: "Opérateur de nœud",
      content: "DazNode a transformé ma façon d'exploiter mon nœud Lightning. Les revenus ont augmenté de 45% en 3 mois !",
      avatar: "/assets/images/avatars/user1.jpg"
    },
    {
      name: "Marie D.",
      role: "Développeuse",
      content: "L'interface est intuitive et les alertes m'ont sauvé plusieurs fois. Je recommande vivement !",
      avatar: "/assets/images/avatars/user2.jpg"
    },
    {
      name: "Alexandre M.",
      role: "Investisseur",
      content: "Excellent support client et une communauté très active. Je me sens en confiance avec DazNode.",
      avatar: "/assets/images/avatars/user3.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Rejoignez notre communauté
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Plus de 1000 opérateurs de nœuds nous font confiance pour optimiser leurs revenus Lightning Network
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}{stat.unit}
              </div>
              <div className="text-indigo-200 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Témoignages */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-indigo-200 text-sm">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Prêt à rejoindre la révolution Lightning ?
            </h3>
            <p className="text-indigo-200 mb-6 max-w-2xl mx-auto">
              Commencez gratuitement et découvrez comment DazNode peut maximiser vos revenus Lightning Network
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/checkout"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Commencer maintenant
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;