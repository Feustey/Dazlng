import React from 'react';

async function getRecommendations() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendations`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des recommandations');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { error: 'Impossible de charger les recommandations' };
  }
}

export default async function ActionsPage() {
  const data = await getRecommendations();

  if (data.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Actions et Recommandations
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {data.error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Actions et Recommandations
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recommandations personnalisées
        </h2>
        <div className="prose dark:prose-invert">
          {data.recommendations && (
            <div className="whitespace-pre-line">
              {data.recommendations}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 