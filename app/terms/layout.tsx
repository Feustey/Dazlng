import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions d\'Utilisation | DazNode - Termes et Responsabilités',
  description: 'Consultez les conditions d\'utilisation de DazNode. Découvrez vos droits et responsabilités lors de l\'utilisation de nos services Lightning Network et solutions Bitcoin.',
  keywords: ['conditions utilisation DazNode', 'termes service', 'CGU Lightning Network', 'politique utilisation', 'responsabilités Bitcoin', 'contrat service'],
  openGraph: {
    title: 'Conditions d\'Utilisation DazNode | Termes et Responsabilités',
    description: 'Consultez les conditions d\'utilisation de DazNode et découvrez vos droits lors de l\'utilisation de nos services Lightning Network.',
    url: 'https://dazno.de/terms',
    images: [
      {
        url: '/assets/images/terms-og.png',
        width: 1200,
        height: 630,
        alt: 'Conditions d\'Utilisation DazNode'
      }
    ]
  },
  alternates: {
    canonical: 'https://dazno.de/terms'
  },
  robots: 'index, follow'
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 