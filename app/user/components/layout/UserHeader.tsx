import React, { FC } from 'react';

const UserHeader: FC = () => {
  return (
    <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
      <div className="font-semibold text-lg">Espace utilisateur</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Connecté</span>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default UserHeader;