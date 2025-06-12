import React from 'react';
import Image from 'next/image';

const DetailedTestimonials: React.FC = (): React.ReactElement => {
  const testimonials = [
    {
      name: "Jean D.",
      role: "Node Runner depuis 8 mois",
      avatar: "/assets/images/avatar-male.svg",
      quote: "Revenus moyens : 127€/mois. La communauté DazNode m'a aidé à optimiser mes canaux dès le premier mois. L'entraide est exceptionnelle !",
      metrics: {
        monthlyEarnings: "127€",
        roi: "19.2%",
        period: "8 mois"
      },
      gradient: "from-green-500 to-emerald-600"
    },
    {
      name: "Marie L.",
      role: "Ex-développeuse devenue node runner",
      avatar: "/assets/images/avatar-female.svg",
      quote: "J'ai quitté mon job grâce aux revenus de mes 3 nœuds DazNode. La communauté partage toutes les stratégies gagnantes.",
      metrics: {
        monthlyEarnings: "340€",
        nodes: "3 nœuds",
        period: "1 an"
      },
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      name: "Pierre M.",
      role: "De 0 à expert en 6 mois",
      avatar: "/assets/images/avatar-leaticia.png",
      quote: "Parti de zéro, la communauté m'a tout appris. Aujourd'hui je forme les nouveaux. DazNode c'est bien plus qu'un produit, c'est une famille.",
      metrics: {
        monthlyEarnings: "89€",
        role: "Mentor actif",
        period: "6 mois"
      },
      gradient: "from-purple-500 to-violet-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ce que nos membres génèrent réellement
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages détaillés de nos node runners avec leurs revenus réels 
            et leur parcours dans la communauté DazNode
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Header avec gradient */}
              <div className={`bg-gradient-to-r ${testimonial.gradient} p-6 text-white`}>
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full mr-4 border-3 border-white"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{testimonial.name}</h3>
                    <p className="text-sm opacity-90">{testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Témoignage */}
              <div className="p-6">
                <blockquote className="text-gray-700 italic mb-6 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Métriques */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {Object.entries(testimonial.metrics).map(([key, value], metricIndex) => (
                      <div key={metricIndex}>
                        <div className={`text-lg font-bold bg-gradient-to-r ${testimonial.gradient} text-transparent bg-clip-text`}>
                          {value}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {key === 'monthlyEarnings' ? 'Revenus mensuels' : 
                           key === 'roi' ? 'ROI annuel' :
                           key === 'period' ? 'Période' :
                           key === 'nodes' ? 'Nœuds' :
                           key === 'role' ? 'Rôle' : key}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistiques globales */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Résultats moyens de la communauté</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold">127€</div>
                <div className="text-sm opacity-90">Revenus mensuels moyens après 3 mois</div>
              </div>
              <div>
                <div className="text-3xl font-bold">18.5%</div>
                <div className="text-sm opacity-90">ROI annuel moyen</div>
              </div>
              <div>
                <div className="text-3xl font-bold">6 mois</div>
                <div className="text-sm opacity-90">Temps moyen pour devenir expert</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedTestimonials; 