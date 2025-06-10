import { ReactNode } from 'react';
import { Metadata } from 'next';

// ✅ FORCER LE RENDU DYNAMIQUE POUR LES PAGES UTILISATEUR
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface UserDashboardLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Tableau de Bord | DazNode - Gérez votre Nœud Lightning',
  description: 'Accédez à votre tableau de bord DazNode personnalisé. Gérez vos nœuds Lightning, consultez vos performances et optimisez vos revenus Bitcoin avec l\'IA Dazia.',
  robots: 'noindex, nofollow' // Page privée nécessitant une connexion
};

export default function UserDashboardLayout({ children }: UserDashboardLayoutProps): React.ReactElement {
  return <>{children}</>;
} 