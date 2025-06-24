'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Charger React Admin seulement côté client pour éviter les erreurs SSR
const CRMAdminProvider = dynamic(
  () => import('./providers/AdminProvider').then(mod => ({ default: mod.CRMAdminProvider })),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du CRM...</p>
        </div>
      </div>
    )
  }
);

export default function CRMPage(): React.FC {
  return (
    <div className="min-h-screen bg-gray-50">
      <CRMAdminProvider />
    </div>
  );
}
