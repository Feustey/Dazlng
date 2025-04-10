import { Metadata } from "next";
import { default as dynamicImport } from "next/dynamic";
import { Suspense } from "react";

// Chargement différé des composants
const Hero = dynamicImport(() => import("../components/Hero"), {
  loading: () => <div className="min-h-screen bg-background animate-pulse" />,
  ssr: true,
});

const Features = dynamicImport(() => import("../components/Features"), {
  loading: () => (
    <div className="py-20 bg-gradient-to-b from-muted/50 via-background to-muted/50 animate-pulse" />
  ),
  ssr: true,
});

export const metadata: Metadata = {
  title: "Daznode - Votre Portail Lightning Network",
  description:
    "Découvrez Daznode, la plateforme qui simplifie la gestion de votre nœud Lightning Network. Gérez vos canaux, effectuez des transactions et explorez les statistiques du réseau en toute simplicité.",
  openGraph: {
    title: "Daznode - Votre Portail Lightning Network",
    description:
      "Découvrez Daznode, la plateforme qui simplifie la gestion de votre nœud Lightning Network.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Daznode - Portail Lightning Network",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={<div className="min-h-screen bg-background animate-pulse" />}
      >
        <Hero />
      </Suspense>
      <Suspense
        fallback={
          <div className="py-20 bg-gradient-to-b from-muted/50 via-background to-muted/50 animate-pulse" />
        }
      >
        <Features />
      </Suspense>
    </main>
  );
}
