import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'dazno.de | Gérez vos Nœuds Lightning en un Clic - Solution Tout-en-Un',
  description: "metadata.metadatametadatadployez_optimi",
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
    description: "metadata.metadatametadatala_solution_to",
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
    description: "metadata.metadatametadatasolutions_ligh",
    images: ['https://dazno.de/assets/images/home-og.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      "metadata.metadatametadatamaximageprevie": 'large',
      'max-snippet': -1,
    },
  },
}
