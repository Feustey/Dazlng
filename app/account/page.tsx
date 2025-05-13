'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.replace('/auth/login');
          return;
        }
        setUserData({
          name: 'Utilisateur Test',
          email: 'test@example.com',
          orders: [],
          subscriptions: []
        });
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.replace('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon compte</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Nom</p>
            <p className="font-medium">{userData.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{userData.email}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
      >
        Se déconnecter
      </button>
    </div>
  );
} 