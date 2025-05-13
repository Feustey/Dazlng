import React from 'react';
import ParallaxSection from '@/components/shared/ui/ParallaxSection';
import Link from 'next/link';

const ProductCard = ({ 
  title, 
  description, 
  price, 
  ctaText, 
  ctaLink, 
  isExternal = false,
  isComingSoon = false 
}: {
  title: string;
  description: string;
  price?: string;
  ctaText: string;
  ctaLink: string;
  isExternal?: boolean;
  isComingSoon?: boolean;
}) => (
  <div className="bg-black/20 backdrop-blur-lg rounded-xl p-8 max-w-xl w-full mx-auto">
    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
      {title}
    </h2>
    <p className="text-gray-300 mb-6">{description}</p>
    {price && (
      <p className="text-xl font-semibold text-purple-400 mb-6">{price}</p>
    )}
    {isComingSoon ? (
      <button disabled className="w-full py-3 px-6 rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed">
        {ctaText}
      </button>
    ) : (
      <Link 
        href={ctaLink}
        target={isExternal ? '_blank' : undefined}
        className="block w-full text-center py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity"
      >
        {ctaText}
      </Link>
    )}
  </div>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Hero Section */}
      <ParallaxSection title="Accueil" className="bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Bienvenue dans l'écosystème Daz
          </h1>
          <p className="text-xl text-gray-300">
            Découvrez nos solutions innovantes pour la finance décentralisée
          </p>
        </div>
      </ParallaxSection>

      {/* DazNode Section */}
      <ParallaxSection title="DazNode" className="bg-gradient-to-r from-purple-900/10 to-pink-900/10">
        <ProductCard
          title="DazNode"
          description="Pilotez vos revenus passifs grâce à l'IA et contribuez à la décentralisation du réseau."
          price="30 000 sats/mois"
          ctaText="S'abonner"
          ctaLink="/checkout/daznode"
        />
      </ParallaxSection>

      {/* DazBox Section */}
      <ParallaxSection title="DazBox" className="bg-gradient-to-l from-purple-900/10 to-pink-900/10">
        <ProductCard
          title="DazBox"
          description="Votre nœud clé en main, prêt à l'emploi. Livraison incluse avec 3 mois d'abonnement DazIA."
          price="290 000 satoshis"
          ctaText="Commander"
          ctaLink="/checkout/dazbox"
        />
      </ParallaxSection>

      {/* DazPay Section */}
      <ParallaxSection title="DazPay" className="bg-gradient-to-r from-purple-900/10 to-pink-900/10">
        <ProductCard
          title="DazPay"
          description="Le terminal de paiement nouvelle génération pour les commerces. Simple, rapide et sécurisé."
          price="30 000 sats/mois"
          ctaText="S'abonner"
          ctaLink="/checkout/dazpay"
        />
      </ParallaxSection>

      {/* DazPay Mobile Section */}
      <ParallaxSection title="DazPay Mobile" className="bg-gradient-to-l from-purple-900/10 to-pink-900/10">
        <ProductCard
          title="DazPay Mobile"
          description="La version mobile de DazPay arrive bientôt ! Encaissez en toute mobilité, où que vous soyez."
          ctaText="Bientôt disponible"
          ctaLink="#"
          isComingSoon={true}
        />
      </ParallaxSection>

      {/* Token For Good Section */}
      <ParallaxSection title="Token For Good" className="bg-gradient-to-r from-purple-900/10 to-pink-900/10">
        <ProductCard
          title="Token For Good"
          description="La plateforme solidaire pour soutenir des causes qui comptent. Rejoignez la communauté."
          ctaText="Découvrir Token For Good"
          ctaLink="https://token-for-good.com"
          isExternal={true}
        />
      </ParallaxSection>

      {/* DazDocs Section */}
      <ParallaxSection title="DazDocs" className="bg-gradient-to-l from-purple-900/10 to-pink-900/10">
        <ProductCard
          title="DazDocs"
          description="Votre base documentaire pour tout comprendre sur l'écosystème Daz."
          ctaText="Accéder à DazDocs"
          ctaLink="https://docs.dazno.de"
          isExternal={true}
        />
      </ParallaxSection>
    </main>
  );
} 