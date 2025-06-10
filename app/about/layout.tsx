import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos | DazNode - Notre mission Lightning Network',
  description: 'Découvrez l\'histoire de DazNode, notre équipe d\'experts Bitcoin et notre mission : démocratiser l\'accès au Lightning Network avec des solutions innovantes et sécurisées.',
  keywords: ['à propos DazNode', 'équipe Bitcoin', 'mission Lightning Network', 'histoire crypto', 'experts blockchain', 'innovation Bitcoin', 'startup Lightning'],
  openGraph: {
    title: 'À propos de DazNode | Notre mission Lightning Network',
    description: 'Découvrez notre équipe d\'experts Bitcoin et notre mission : démocratiser l\'accès au Lightning Network avec des solutions innovantes.',
    url: 'https://dazno.de/about',
    images: [
      {
        url: '/assets/images/about-og.png',
        width: 1200,
        height: 630,
        alt: 'À propos de DazNode'
      }
    ]
  },
  alternates: {
    canonical: 'https://dazno.de/about'
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 