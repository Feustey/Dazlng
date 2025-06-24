import React, { FC } from 'react';
import Link from 'next/link';

const UserSidebar: FC = () => {
  return (
    <aside className="w-64 bg-white border-r flex flex-col p-6">
      <div className="font-bold text-xl mb-8">DazNode</div>
      <nav className="flex flex-col gap-4">
        <Link href="/user/dashboard" className="hover:text-indigo-600">Tableau de bord</Link>
        <Link href="/user/node" className="hover:text-indigo-600">Mon nœud</Link>
        <Link href="/user/node/stats" className="hover:text-indigo-600">- Statistiques</Link>
        <Link href="/user/node/channels" className="hover:text-indigo-600">- Canaux</Link>
        <Link href="/user/node/recommendations" className="hover:text-indigo-600">- Recommandations</Link>
        <Link href="/user/optimize" className="hover:text-indigo-600">Optimisation</Link>
        <Link href="/user/subscriptions" className="hover:text-indigo-600">Abonnement</Link>
        <Link href="/user/billing" className="hover:text-indigo-600">Factures</Link>
        <Link href="/user/settings" className="hover:text-indigo-600">Paramètres</Link>
      </nav>
    </aside>
  );

export default UserSidebar;