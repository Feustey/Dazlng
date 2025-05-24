"use client";

import React, { FC } from 'react';

const UserDashboard: FC = () => {
  // Placeholders pour les stats et recommandations
  const nodeStats = null; // À remplacer par un fetch réel
  const recommendations = [
    { id: 1, title: 'Ouvrez un canal avec un node populaire', isFree: true },
    { id: 2, title: 'Optimisez vos frais de routage', isFree: false },
  ];
  const isPremium = false;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        {!isPremium && (
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition">
            Passer à Premium
          </button>
        )}
      </div>
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-2xl font-bold mb-2">0</div>
          <div className="text-gray-500">Capacité totale</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl mb-2">🔗</div>
          <div className="text-2xl font-bold mb-2">0</div>
          <div className="text-gray-500">Canaux actifs</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-2xl font-bold mb-2">0</div>
          <div className="text-gray-500">Revenus du mois</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-2xl mb-2">❤️</div>
          <div className="text-2xl font-bold mb-2">0%</div>
          <div className="text-gray-500">Score de santé</div>
        </div>
      </div>
      {/* Call to action connexion noeud */}
      {!nodeStats && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Connectez votre nœud Lightning</h2>
          <p className="mb-6">Commencez à optimiser votre nœud et maximiser vos revenus</p>
          <a href="/user/node" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Configurer mon nœud</a>
        </div>
      )}
      {/* Recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">💡 Recommandations gratuites</h3>
          <ul className="space-y-2">
            {recommendations.filter(r => r.isFree).map(rec => (
              <li key={rec.id} className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                <span>{rec.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">🚀 Optimisations Premium <span className="text-yellow-400">★</span></h3>
          <ul className="space-y-2 opacity-60">
            {recommendations.filter(r => !r.isFree).map(rec => (
              <li key={rec.id} className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                <span>{rec.title}</span>
              </li>
            ))}
          </ul>
          {!isPremium && (
            <div className="mt-4 text-center">
              <a href="/user/subscriptions" className="text-indigo-600 hover:underline">Débloquer avec Premium</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
