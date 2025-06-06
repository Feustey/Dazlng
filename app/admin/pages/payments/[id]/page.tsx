"use client";

interface PageProps {
  params: {
    id: string;
  };
}

export default function AdminPaymentDetailPage({ params }: PageProps): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Détails du Paiement #{params.id}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Page en cours de développement</p>
        <p className="text-sm text-gray-500 mt-2">ID du paiement: {params.id}</p>
      </div>
    </div>
  );
} 