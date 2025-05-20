import React from 'react';
import ParallaxSection from '@/components/shared/ui/ParallaxSection';
import Link from 'next/link';
import Card from "@/components/shared/ui/Card";
import GradientTitle from "@/components/shared/ui/GradientTitle";

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
  <Card className="max-w-xl w-full mx-auto">
    <GradientTitle className="tracking-tight">{title}</GradientTitle>
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
  </Card>
);

export default function HomePage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#181825] text-[#E5E5E5] overflow-x-hidden">
      {/* Hero Section */}
      <ParallaxSection title="Accueil" className="bg-white rounded-2xl shadow">
        <div className="text-center">
          <GradientTitle className="text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            Bienvenue dans l'écosystème Daz
          </GradientTitle>
          <p className="text-2xl text-[#A1A1AA] font-medium">
            Découvrez nos solutions innovantes pour la finance décentralisée
          </p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Révolution Blockchain Accessible */}
      <ParallaxSection title="La révolution blockchain accessible à tous" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-3xl font-bold text-[#FFD580]">Une technologie transformative pour entreprises et particuliers</p>
          <p className="text-xl text-[#A1A1AA]">Imaginez un monde où chaque transaction est instantanée, sécurisée et créatrice de valeur. Ce monde existe : il s'appelle <span className="font-bold text-[#F7931A]">Daznode</span>.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Accessibilité & Démocratisation */}
      <ParallaxSection title="L'innovation au service de chacun" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xl">Daznode démocratise l'accès aux technologies blockchain avancées. Que vous soyez une TPE, un indépendant ou un particulier, ouvrez les portes d'un nouveau paradigme financier, sans barrière technique.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : IA Dazia */}
      <ParallaxSection title="Dazia : votre assistant intelligent" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xl">Profitez d'une intelligence artificielle dédiée qui analyse vos transactions, optimise vos flux financiers et vous conseille en continu. Dazia apprend de vos usages pour s'adapter à vos besoins, professionnels ou personnels.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Un nœud Lightning pour tous */}
      <ParallaxSection title="Un nœud Lightning accessible à tous" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xl">Possédez et opérez votre propre nœud Lightning, que vous soyez entreprise ou particulier. Gérez vos paiements, réduisez vos frais, bénéficiez de transferts instantanés et accédez à de nouvelles opportunités financières.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Terminal de paiement nouvelle génération */}
      <ParallaxSection title="Un terminal de paiement qui change la donne" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xl">Simplicité, autonomie, rapidité : le terminal Daznode s'intègre nativement à vos systèmes. Fini les attentes et les frais excessifs, chaque transaction devient fluide et créatrice de valeur.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Tokens For Good */}
      <ParallaxSection title="Tokens For Good : valorisez chaque transaction" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xl">À chaque utilisation, gagnez des tokens : réductions, services premium, avantages concrets et contribution à des initiatives durables. La blockchain garantit transparence et sécurité, pour des transferts instantanés à moindre coût.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Sécurité & Fiabilité */}
      <ParallaxSection title="Une technologie éprouvée et sécurisée" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xl">Derrière la simplicité de Daznode, une infrastructure sophistiquée issue de 10 ans d'expertise blockchain. Chaque transaction est vérifiée par un réseau distribué, éliminant les risques de fraude et d'erreur.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Bénéfices Entreprises */}
      <ParallaxSection title="Des bénéfices tangibles pour les entreprises" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <ul className="text-xl list-disc list-inside space-y-2 text-left mx-auto max-w-xl">
            <li>Réduction significative des frais de transaction</li>
            <li>Amélioration des flux de trésorerie</li>
            <li>Expérience client optimisée</li>
            <li>Analyses prédictives pour des décisions éclairées</li>
          </ul>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Bénéfices Particuliers */}
      <ParallaxSection title="Des avantages concrets pour les particuliers" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <ul className="text-xl list-disc list-inside space-y-2 text-left mx-auto max-w-xl">
            <li>Contrôle accru sur vos transactions</li>
            <li>Transferts instantanés entre pairs</li>
            <li>Protection contre l'inflation</li>
            <li>Participation à un réseau financier décentralisé</li>
          </ul>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Accessibilité & Simplicité */}
      <ParallaxSection title="Accessibilité et simplicité" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xl">La blockchain ne doit pas être réservée aux initiés. Daznode démocratise l'accès au Lightning avec une interface intuitive et un accompagnement adapté à tous les niveaux.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Communauté */}
      <ParallaxSection title="Une communauté engagée" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xl">Rejoignez une communauté diverse d'entrepreneurs, de particuliers et de passionnés qui partagent expériences et bonnes pratiques. Ensemble, faisons évoluer l'écosystème Daznode.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Prêt à prendre le contrôle ? */}
      <ParallaxSection title="Prêt à prendre le contrôle ?" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-2xl font-bold text-[#FFD580]">La révolution financière n'attend pas.</p>
          <p className="text-xl">Daznode vous propose un parcours sur-mesure : évaluation de vos besoins, démonstration, configuration de votre nœud, formation et accompagnement continu.</p>
        </div>
      </ParallaxSection>

      {/* Argumentaire : Conclusion */}
      <ParallaxSection title="L'autonomie financière à portée de main" className="bg-white rounded-2xl shadow py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-2xl font-bold text-[#F7931A]">Daznode, c'est l'innovation blockchain, pour tous, par tous.</p>
          <p className="text-xl">Prenez part à la révolution Lightning et devenez acteur de l'économie de demain.</p>
        </div>
      </ParallaxSection>

      {/* DazNode Section */}
      <ParallaxSection title="DazNode" className="bg-white rounded-2xl shadow">
        <ProductCard
          title="DazNode"
          description="Pilotez vos revenus passifs grâce à l'IA et contribuez à la décentralisation du réseau."
          price="30 000 sats/mois"
          ctaText="S'abonner"
          ctaLink="/checkout/daznode"
        />
      </ParallaxSection>

      {/* DazBox Section */}
      <ParallaxSection title="DazBox" className="bg-white rounded-2xl shadow">
        <ProductCard
          title="DazBox"
          description="Votre nœud clé en main, prêt à l'emploi. Livraison incluse avec 3 mois d'abonnement DazIA."
          price="290 000 satoshis"
          ctaText="Commander"
          ctaLink="/checkout/dazbox"
        />
      </ParallaxSection>

      {/* DazPay Section */}
      <ParallaxSection title="DazPay" className="bg-white rounded-2xl shadow">
        <ProductCard
          title="DazPay"
          description="Le terminal de paiement nouvelle génération pour les commerces. Simple, rapide et sécurisé."
          price="30 000 sats/mois"
          ctaText="S'abonner"
          ctaLink="/checkout/dazpay"
        />
      </ParallaxSection>

      {/* DazPay Mobile Section */}
      <ParallaxSection title="DazPay Mobile" className="bg-white rounded-2xl shadow">
        <ProductCard
          title="DazPay Mobile"
          description="La version mobile de DazPay arrive bientôt ! Encaissez en toute mobilité, où que vous soyez."
          ctaText="Bientôt disponible"
          ctaLink="#"
          isComingSoon={true}
        />
      </ParallaxSection>

      {/* Token For Good Section */}
      <ParallaxSection title="Token For Good" className="bg-white rounded-2xl shadow">
        <ProductCard
          title="Token For Good"
          description="La plateforme solidaire pour soutenir des causes qui comptent. Rejoignez la communauté."
          ctaText="Découvrir Token For Good"
          ctaLink="https://token-for-good.com"
          isExternal={true}
        />
      </ParallaxSection>

      {/* DazDocs Section */}
      <ParallaxSection title="DazDocs" className="bg-white rounded-2xl shadow">
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