import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages - Lightning Manager',
  description: 'Gérez vos messages Lightning Network',
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 