import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const UserSidebar: React.FC = () => {
  const locale = useLocale();

  return (
    <aside className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <nav className="space-y-4">
          <Link href="/user/dashboard" locale={locale} className="hover:text-indigo-600">Tableau de bord</Link>
          <Link href="/user/node" locale={locale} className="hover:text-indigo-600">Mon nœud</Link>
          <Link href="/user/subscriptions" locale={locale} className="hover:text-indigo-600">Abonnements</Link>
          <Link href="/user/settings" locale={locale} className="hover:text-indigo-600">Paramètres</Link>
        </nav>
      </div>
    </aside>
  );
};

export default UserSidebar;