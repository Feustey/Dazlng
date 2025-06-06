"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page utilisateur dashboard
    router.replace('/user/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection vers votre compte...</p>
      </div>
    </div>
  );
} 