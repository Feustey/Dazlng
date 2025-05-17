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
  <div className="card max-w-xl w-full mx-auto">
    <h2 className="text-4xl font-extrabold mb-4 gradient-title tracking-tight">
      {title}
    </h2>
    <p className="mb-6">{description}</p>
    {price && (
      <p className="text-2xl font-semibold text-[#F7931A] mb-6">{price}</p>
    )}
    {isComingSoon ? (
      <button
        disabled
        className="w-full py-3 px-6 rounded-full bg-[#35354D] text-[#A1A1AA] cursor-not-allowed font-semibold shadow"
      >
        {ctaText}
      </button>
    ) : (
      <Link
        href={ctaLink}
        target={isExternal ? '_blank' : undefined}
        className="block w-full text-center py-3 px-6 rounded-full bg-gradient-to-r from-[#F7931A] to-[#FFD580] text-[#181825] font-bold shadow hover:opacity-90 transition-opacity"
      >
        {ctaText}
      </Link>
    )}
  </div>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#181825] text-[#E5E5E5] overflow-x-hidden">
      {/* Hero Section */}
      <ParallaxSection title="Accueil" className="glass">
        <div className="text-center">
          <h1 className="text-7xl font-extrabold mb-6 gradient-title tracking-tight drop-shadow-lg">
            Bienvenue dans l'écosystème Daz
          </h1>
          <p className="text-2xl text-[#A1A1AA] font-medium">
            Découvrez nos solutions innovantes pour la finance décentralisée
          </p>
        </div>
      </ParallaxSection>

      {/* DazNode Section */}
      <ParallaxSection title="DazNode" className="glass">
        <ProductCard
          title="DazNode"
          description="Pilotez vos revenus passifs grâce à l'IA et contribuez à la décentralisation du réseau."
          price="30 000 sats/mois"
          ctaText="S'abonner"
          ctaLink="/checkout/daznode"
        />
      </ParallaxSection>

      {/* DazBox Section */}
      <ParallaxSection title="DazBox" className="glass">
        <ProductCard
          title="DazBox"
          description="Votre nœud clé en main, prêt à l'emploi. Livraison incluse avec 3 mois d'abonnement DazIA."
          price="290 000 satoshis"
          ctaText="Commander"
          ctaLink="/checkout/dazbox"
        />
      </ParallaxSection>

      {/* DazPay Section */}
      <ParallaxSection title="DazPay" className="glass">
        <ProductCard
          title="DazPay"
          description="Le terminal de paiement nouvelle génération pour les commerces. Simple, rapide et sécurisé."
          price="30 000 sats/mois"
          ctaText="S'abonner"
          ctaLink="/checkout/dazpay"
        />
      </ParallaxSection>

      {/* DazPay Mobile Section */}
      <ParallaxSection title="DazPay Mobile" className="glass">
        <ProductCard
          title="DazPay Mobile"
          description="La version mobile de DazPay arrive bientôt ! Encaissez en toute mobilité, où que vous soyez."
          ctaText="Bientôt disponible"
          ctaLink="#"
          isComingSoon={true}
        />
      </ParallaxSection>

      {/* Token For Good Section */}
      <ParallaxSection title="Token For Good" className="glass">
        <ProductCard
          title="Token For Good"
          description="La plateforme solidaire pour soutenir des causes qui comptent. Rejoignez la communauté."
          ctaText="Découvrir Token For Good"
          ctaLink="https://token-for-good.com"
          isExternal={true}
        />
      </ParallaxSection>

      {/* DazDocs Section */}
      <ParallaxSection title="DazDocs" className="glass">
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