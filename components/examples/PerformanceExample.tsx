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
  );
  const filteredData = cachedData?.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
  );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Erreur lors du chargement des données: {error.message}
      </div>
  );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t('PerformanceExample.exemple_doptimisations_de_perf')}</h1>
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="PerformanceExample.performanceexampleperformancee"
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Image optimisée avec lazy loading */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('PerformanceExample.image_optimise')}</h2>
        <OptimizedImage
          src="https://picsum.photos/800/400"
          alt="PerformanceExample.performanceexampleperformancee"exemple"
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
              <div className="animate-pulse text-blue-500">{t('PerformanceExample.chargement')}</div>
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
          <li>{t('PerformanceExample._images_optimises_avec_nextjs_')}</li>
          <li>{t('PerformanceExample._liste_virtualise_avec_paginat')}</li>
          <li>{t('PerformanceExample._cache_ct_client_avec_ttl_conf')}</li>
          <li>{t('PerformanceExample._service_worker_pour_la_mise_e')}</li>
          <li>{t('PerformanceExample._web_vitals_monitoring')}</li>
          <li>{t('PerformanceExample._prchargement_des_ressources_c')}</li>
          <li>{t('PerformanceExample._compression_et_minification_a')}</li>
        </ul>
      </div>
    </div>
  );
}
