import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DazNode | IA et optimisation avancée pour votre nœud Lightning',
  description: 'DazNode intègre l\'Intelligence Artificielle (IA) et des systèmes RAG pour optimiser votre Réseau Lightning. Profitez d\'analyses avancées, d\'un routage optimisé et de technologies de pointe pour maximiser vos performances.',
  keywords: ['daznode', 'intelligence artificielle', 'IA', 'lightning network', 'optimisation', 'bitcoin', 'RAG', 'retrieval augmented generation', 'routing', 'analyses avancées'],
  robots: 'index, follow',
  openGraph: {
    title: 'DazNode | IA et optimisation avancée pour votre nœud Lightning',
    description: 'DazNode intègre l\'Intelligence Artificielle (IA) et des systèmes RAG pour optimiser votre Réseau Lightning. Profitez d\'analyses avancées, d\'un routage optimisé et de technologies de pointe pour maximiser vos performances.',
    images: [
      {
        url: 'https://daznode.com/assets/images/daznode-og.png',
        width: 1200,
        height: 630,
        alt: 'DazNode - IA pour Lightning Network'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DazNode | IA pour votre nœud Lightning',
    description: 'Routing optimisé, analyses avancées et toute la puissance de notre IA et son heuristic pour votre nœud Lightning.',
    images: ['https://daznode.com/assets/images/daznode-og.png']
  }
};
