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
          <p className="text-gray-600">{t('admin.chargement_du_crm')}</p>
        </div>
      </div>
    )
  }
);

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CRMAdminProvider />
    </div>
  );
}
