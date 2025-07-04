import React from "react";
import Image from "next/image";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

const DetailedTestimonials: React.FC = () => {
  const { t } = useAdvancedTranslation("home");

  const testimonials = [
    {
      name: "Thomas Laurent",
      role: "Opérateur de nœud",
      company: "Tech Startup",
      content: "DazNode a complètement transformé ma façon d'exploiter mon nœud Lightning. Les revenus ont augmenté de 45% en seulement 3 mois grâce à l'optimisation automatique des frais.",
      avatar: "/assets/images/avatars/thomas.jpg",
      rating: 5,
      improvement: "+45%"
    },
    {
      name: "Marie Dubois",
      role: "Développeuse",
      company: "Freelance",
      content: "L'interface est intuitive et les alertes m'ont sauvé plusieurs fois. Le support client est exceptionnel et la communauté très active. Je recommande vivement !",
      avatar: "/assets/images/avatars/marie.jpg",
      rating: 5,
      improvement: "+38%"
    },
    {
      name: "Alexandre Moreau",
      role: "Investisseur",
      company: "Crypto Fund",
      content: "Excellent outil pour optimiser mes nœuds Lightning. Les analyses prédictives sont très précises et m'ont permis d'éviter plusieurs force-close.",
      avatar: "/assets/images/avatars/alexandre.jpg",
      rating: 5,
      improvement: "+52%"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages de nos utilisateurs qui ont transformé leurs revenus Lightning Network
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.company}</div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {testimonial.rating}/5
                </span>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Amélioration des revenus
                </span>
                <span className="text-lg font-bold text-green-600">
                  {testimonial.improvement}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-amber-50 rounded-lg p-8 border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Rejoignez nos utilisateurs satisfaits
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez gratuitement et découvrez comment DazNode peut optimiser vos revenus Lightning Network
            </p>
            <a
              href="/checkout"
              className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Commencer maintenant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedTestimonials;