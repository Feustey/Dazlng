"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

export default function Header(): React.ReactElement {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    try {
      // Déconnexion via Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.auth.signOut();
      }

      // Rediriger vers la page d'authentification
      router.push('/admin/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Rediriger quand même
      router.push('/admin/auth');
    }
  };

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-bold">Back Office Dazno.de</div>
      <div className="flex items-center gap-4">
        {/* Ici, on pourra ajouter le profil admin, la déconnexion, etc. */}
        <span className="text-gray-600">admin@dazno.de</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </header>
  );
} 