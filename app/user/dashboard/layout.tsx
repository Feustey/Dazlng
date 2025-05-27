import { ReactNode } from 'react';

// ✅ FORCER LE RENDU DYNAMIQUE POUR LES PAGES UTILISATEUR
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface UserDashboardLayoutProps {
  children: ReactNode;
}

export default function UserDashboardLayout({ children }: UserDashboardLayoutProps): JSX.Element {
  return <>{children}</>;
} 