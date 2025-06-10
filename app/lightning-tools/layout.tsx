import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Outils Lightning Network | DazNode - Calculateur, Explorateur & Décodeur',
  description: 'Suite d\'outils gratuits Lightning Network : calculateur sats/BTC, explorateur de réseau, décodeur BOLT11/LNURL. Analysez et explorez le Lightning Network facilement.',
  keywords: ['outils Lightning Network', 'calculateur Bitcoin', 'explorateur Lightning', 'décodeur BOLT11', 'convertisseur sats', 'outils Bitcoin gratuits', 'LNURL decoder'],
  openGraph: {
    title: 'Outils Lightning Network Gratuits | DazNode',
    description: 'Calculateur, explorateur et décodeur Lightning Network gratuits. Analysez et explorez le réseau Bitcoin Lightning facilement.',
    url: 'https://dazno.de/lightning-tools',
    images: [
      {
        url: '/assets/images/lightning-tools-og.png',
        width: 1200,
        height: 630,
        alt: 'Outils Lightning Network DazNode'
      }
    ]
  },
  alternates: {
    canonical: 'https://dazno.de/lightning-tools'
  }
};

export default function LightningToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 