import React from 'react';
import Image from 'next/image';

const DetailedTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Marc Dubois",
      role: "Node Runner depuis 8 mois",
      avatar: "/assets/images/avatars/avatar1.jpg",
      gradient: "from-blue-500 to-indigo-600",
      quote: "J'ai commencé avec 0.5 BTC de capital et je génère maintenant 180€/mois en revenus passifs. Le monitoring IA m'a évité 3 force-closes qui m'auraient coûté 0.15 BTC.",
      metrics: {
        "Revenus/mois": "180€",
        "ROI": "22%",
        "Canaux": "12",
        "Uptime": "99.8%"
      },
      journey: "Ancien développeur web reconverti dans Bitcoin"
    },
    {
      name: "Sophie Lambert",
      role: "Entrepreneuse • Node Runner Pro",
      avatar: "/assets/images/avatars/avatar2.jpg",
      gradient: "from-purple-500 to-pink-600",
      quote: "Grâce à DazNode, j'ai pu diversifier mes revenus crypto. L'IA anticipe les problèmes et j'ai une visibilité totale sur mes performances Lightning.",
      metrics: {
        "Revenus/mois": "340€",
        "ROI": "19%",
        "Canaux": "24",
        "Liquidité": "2.1 BTC"
      },
      journey: "A commencé avec 1 BTC, maintenant opératrice pro"
    },
    {
      name: "Alexandre Chen",
      role: "Développeur • Early Adopter",
      avatar: "/assets/images/avatars/avatar3.jpg",
      gradient: "from-green-500 to-emerald-600",
      quote: "Le plus impressionnant c'est la prédiction des force-closes. L'IA m'a fait économiser plus de 0.3 BTC en 6 mois. Je recommande à tous mes amis dans Bitcoin.",
      metrics: {
        "Revenus/mois": "290€",
        "Économies": "0.3 BTC",
        "Canaux": "18",
        "Succès": "94%"
      },
      journey: "Premier utilisateur de la beta, membre VIP"
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
          {testimonials.map((testimonial: any, index: any) => (
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
                          {String(value)}
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