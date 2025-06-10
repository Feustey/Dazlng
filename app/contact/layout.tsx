import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | DazNode - Support Lightning Network Expert',
  description: 'Contactez l\'équipe DazNode pour vos questions sur nos solutions Lightning Network. Support 24/7, conseil personnalisé et accompagnement technique pour vos projets Bitcoin.',
  keywords: ['contact DazNode', 'support Lightning Network', 'aide Bitcoin', 'conseil crypto', 'support technique', 'assistance DazBox', 'contact nœud Lightning'],
  openGraph: {
    title: 'Contact DazNode | Support Lightning Network Expert',
    description: 'Contactez nos experts Lightning Network. Support 24/7, conseil personnalisé et accompagnement technique pour tous vos projets Bitcoin.',
    url: 'https://dazno.de/contact',
    images: [
      {
        url: '/assets/images/contact-og.png',
        width: 1200,
        height: 630,
        alt: 'Contact DazNode - Support Lightning Network'
      }
    ]
  },
  alternates: {
    canonical: 'https://dazno.de/contact'
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 