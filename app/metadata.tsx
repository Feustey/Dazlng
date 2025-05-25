import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'dazno.de | Gérez vos Nœuds Lightning en un Clic - Solution Tout-en-Un',
  description: 'Déployez, optimisez et monitorez vos nœuds Lightning Network sans compétences techniques. DazBox, DazNode et DazPay : solutions complètes pour particuliers et entreprises. Essai gratuit 14 jours.',
  keywords: [
    'nœud lightning network', 
    'bitcoin node management', 
    'lightning node français', 
    'dazbox', 
    'daznode', 
    'dazpay', 
    'bitcoin france', 
    'lightning wallet',
    'node management',
    'bitcoin automation',
    'routing lightning',
    'optimisation bitcoin'
  ],
  openGraph: {
    title: 'dazno.de | Gérez vos Nœuds Lightning en un Clic',
    description: 'La solution tout-en-un pour déployer, optimiser et monitorer vos nœuds Lightning Network sans compétences techniques. Installation en 5 minutes, support 24/7.',
    url: 'https://dazno.de',
    siteName: 'dazno.de',
    images: [
      {
        url: 'https://dazno.de/assets/images/home-og.png',
        width: 1200,
        height: 630,
        alt: 'dazno.de - Gestion Simplifiée de Nœuds Lightning Network'
      }
    ],
    locale: 'fr_FR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dazno.de | Gérez vos Nœuds Lightning en un Clic',
    description: 'Solutions Lightning Network clés en main. Installation 5 min, support 24/7, essai gratuit 14 jours.',
    images: ['https://dazno.de/assets/images/home-og.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}; 