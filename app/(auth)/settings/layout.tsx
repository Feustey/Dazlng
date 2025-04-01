import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paramètres - Lightning Manager',
  description: 'Gérez les paramètres de votre application Lightning Manager',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 