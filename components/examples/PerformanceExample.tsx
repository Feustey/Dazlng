'use client';

import { useState } from 'react';
import { OptimizedImage, LazyList, useCache } from '../shared/ui';

// Exemple de données pour la liste
const mockData = Array.from({ length: 100 }, (_: any, i: any) => ({
  id: i,
  title: `Élément ${i + 1}`,
  description: `Description de l'élément ${i + 1}`,
  image: `https://picsum.photos/300/200?random=${i}`
}));

export default function PerformanceExample(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');

  // Exemple d'utilisation du cache
  const { data: cachedData, loading, error } = useCache(
    'example-data',
    async () => {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    },
    { ttl: 5 * 60 * 1000 } // 5 minutes
};
  const filteredData = cachedData?.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
};
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Erreur lors du chargement des données: {error.message}
      </div>
};
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Exemple d'optimisations de performance</h1>
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Image optimisée avec lazy loading */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Image optimisée</h2>
        <OptimizedImage
          src="https://picsum.photos/800/400"
          alt="Image d'exemple"
          width={800}
          height={400}
          className="rounded-lg shadow-lg"
          priority={true}
          placeholder="blur"
        />
      </div>

      {/* Liste avec lazy loading */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Liste avec lazy loading ({filteredData.length} éléments)
        </h2>
        
        <LazyList
          items={filteredData}
          pageSize={10}
          renderItem={(item: any, index: any) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex items-start space-x-4">
                <OptimizedImage
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={80}
                  className="rounded-md flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                  <span className="text-sm text-gray-400">Index: {index}</span>
                </div>
              </div>
            </div>
          )}
          emptyComponent={
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun élément trouvé pour "{searchTerm}"</p>
            </div>
          }
          loadingComponent={
            <div className="flex items-center justify-center p-4">
              <div className="animate-pulse text-blue-500">Chargement...</div>
            </div>
          }
        />
      </div>

      {/* Informations sur les optimisations */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Optimisations implémentées
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>✅ Images optimisées avec Next.js Image et lazy loading</li>
          <li>✅ Liste virtualisée avec pagination automatique</li>
          <li>✅ Cache côté client avec TTL configurable</li>
          <li>✅ Service Worker pour la mise en cache offline</li>
          <li>✅ Web Vitals monitoring</li>
          <li>✅ Préchargement des ressources critiques</li>
          <li>✅ Compression et minification automatiques</li>
        </ul>
      </div>
    </div>
};
}
