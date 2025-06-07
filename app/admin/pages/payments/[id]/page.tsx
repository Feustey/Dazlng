"use client";

import { use } from 'react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminPaymentDetailPage({ params }: PageProps): JSX.Element {
  const resolvedParams = use(params);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Détails du Paiement #{resolvedParams.id}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Page en cours de développement</p>
        <p className="text-sm text-gray-500 mt-2">ID du paiement: {resolvedParams.id}</p>
      </div>
    </div>
  );
} 