'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserData {
  name: string;
  email: string;
}

export default function AccountPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        router.replace('/auth/login');
        return;
      }
      const res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        router.replace('/auth/login');
      }
      setLoading(false);
    }
    fetchUserData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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