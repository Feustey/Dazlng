import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DazPay | Terminal de Paiement Lightning Network',
  description: 'Acceptez les paiements Bitcoin Lightning en quelques minutes. Terminal moderne, dashboard marchand et conversion automatique BTC/EUR pour tous les commerces.',
  keywords: [
    'dazpay',
    'paiement lightning',
    'terminal bitcoin',
    'commerce bitcoin',
    'paiement crypto',
    'lightning network',
    'btc eur',
    'conversion bitcoin',
    'pos bitcoin',
    'encaissement crypto'
  ],
  authors: [{ name: 'DazNode' }],
  creator: 'DazNode',
  publisher: 'DazNode',
  openGraph: {
    title: 'DazPay | Terminal de Paiement Lightning Network',
    description: 'Acceptez les paiements Bitcoin Lightning en quelques minutes. Terminal moderne, dashboard marchand et conversion automatique BTC/EUR.',
    url: 'https://dazno.de/dazpay',
    siteName: 'DazNode',
    type: 'website',
    images: [
      {
        url: 'https://dazno.de/assets/images/dazpay-og.png',
        width: 1200,
        height: 630,
        alt: 'DazPay - Terminal de Paiement Lightning Network'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DazPay | Terminal de Paiement Lightning Network',
    description: 'Acceptez les paiements Bitcoin Lightning en quelques minutes. Terminal moderne pour tous les commerces.',
    images: ['https://dazno.de/assets/images/dazpay-og.png']
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
}
export const dynamic = "force-dynamic";
