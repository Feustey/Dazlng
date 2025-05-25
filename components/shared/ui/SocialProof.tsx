import React from 'react';
import Image from 'next/image';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

interface TestimonialProps {
  name: string;
  title: string;
  content: string;
  avatar: string;
  rating: number;
  delay: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, title, content, avatar, rating, delay }) => (
  <div 
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="flex items-center mb-4">
      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
        <Image
          src={avatar}
          alt={name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div>
        <h4 className="font-bold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
    
    <div className="flex mb-3">
      {[...Array(rating)].map((_, i) => (
        <FaStar key={i} className="text-yellow-400 w-4 h-4" />
      ))}
    </div>
    
    <div className="relative">
      <FaQuoteLeft className="absolute -top-2 -left-1 text-indigo-200 w-6 h-6" />
      <p className="text-gray-700 leading-relaxed pl-6 italic">{content}</p>
    </div>
  </div>
);

interface MetricProps {
  number: string;
  label: string;
  delay: number;
}

const Metric: React.FC<MetricProps> = ({ number, label, delay }) => (
  <div 
    className="text-center"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
      {number}
    </div>
    <div className="text-gray-600 font-medium">
      {label}
    </div>
  </div>
);

export const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: "Marie Dubois",
      title: "Entrepreneur",
      content: "La DazBox a transformé ma façon de gérer mes paiements Bitcoin. Installation en 5 minutes, tout fonctionne parfaitement !",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 5
    },
    {
      name: "Thomas Martin",
      title: "Développeur",
      content: "DazNode m'aide à optimiser mon nœud Lightning. L'IA anticipe les besoins de routing, c'est impressionnant !",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 5
    },
    {
      name: "Sophie Leroy",
      title: "Commerçante",
      content: "DazPay a révolutionné mon commerce. Paiements instantanés et frais dérisoires, mes clients adorent !",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 5
    }
  ];

  const metrics = [
    { number: "500+", label: "Nœuds déployés" },
    { number: "99.9%", label: "Disponibilité" },
    { number: "24/7", label: "Support" },
    { number: "5 min", label: "Installation" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez pourquoi des centaines d'utilisateurs choisissent nos solutions Lightning
          </p>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {metrics.map((metric, index) => (
            <Metric
              key={metric.label}
              number={metric.number}
              label={metric.label}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Témoignages */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={testimonial.name}
              name={testimonial.name}
              title={testimonial.title}
              content={testimonial.content}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Partenaires/Clients logos */}
        <div className="text-center" data-aos="fade-up">
          <p className="text-gray-500 font-medium mb-8">Utilisé par :</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder pour logos partenaires */}
            <div className="bg-gray-200 rounded-lg px-6 py-3 text-gray-500 font-bold">
              Bitcoin Nantes
            </div>
            <div className="bg-gray-200 rounded-lg px-6 py-3 text-gray-500 font-bold">
              LN Markets
            </div>
            <div className="bg-gray-200 rounded-lg px-6 py-3 text-gray-500 font-bold">
              Relai
            </div>
            <div className="bg-gray-200 rounded-lg px-6 py-3 text-gray-500 font-bold">
              Coinos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 