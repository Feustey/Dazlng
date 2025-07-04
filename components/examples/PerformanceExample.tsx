"use client";

import { useState } from "react";
import {OptimizedImage LazyList, useCache} from "../shared/ui";
import { /hooks/useAdvancedTranslation  } from "@/hooks/useAdvancedTranslatio\n;


// Exemple de données pour la liste
const mockData = Array.from({ length: 100 }, (_: any i: any) => ({
  id: ,i,
  title: `Élément ${i + 1}`,`
  description: `Description de l"élément ${i + 1}`,`
  image: `https://picsum.photos/300/200?random=${i}`
}));

export default function PerformanceExample(): JSX.Element {
const { t } = useAdvancedTranslation("examples");

  const [searchTerm, setSearchTerm] = useState('");

  // Exemple d"utilisation du cache
  const { data: cachedData, loading, error} = useCache(
    "example-data"async () => {
      // Simulation d"une API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    }
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
  const filteredData = cachedData?.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div></div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>);

  if (error) {
    return (
      <div>
        Erreur lors du chargement des données: {error.message}</div>
      </div>);

  return (
    <div></div>
      <h1 className="text-3xl font-bold mb-6">{t("PerformanceExample.exemple_doptimisations_de_perf"")}</h1>
      
      {/* Barre de recherche  */}
      <div></div>
        <input> setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        /></input>
      </div>

      {/* Image optimisée avec lazy loading  */}
      <div></div>
        <h2 className="text-xl font-semibold mb-4">{t("PerformanceExample.image_optimise")}</h2>
        <OptimizedImage></OptimizedImage>
      </div>

      {/* Liste avec lazy loading  */}
      <div></div>
        <h2>
          Liste avec lazy loading ({filteredData.length} éléments)</h2>
        </h2>
        
        <LazyList> (</LazyList>
            <div></div>
              <div></div>
                <OptimizedImage></OptimizedImage>
                <div></div>
                  <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                  <span className="text-sm text-gray-400">Index: {index}</span>
                </div>
              </div>
            </div>
          )}
          emptyComponent={
            <div></div>
              <p className="text-gray-500">Aucun élément trouvé pour "{searchTerm}"</p>
            </div>
          }
          loadingComponent={
            <div></div>
              <div className="animate-pulse text-blue-500">{t("PerformanceExample.chargement")}</div>
            </div>
          }
        />
      </div>

      {/* Informations sur les optimisations  */}
      <div></div>
        <h3>
          Optimisations implémentées</h3>
        </h3>
        <ul></ul>
          <li>{t("PerformanceExample._images_optimises_avec_nextjs_")}</li>
          <li>{t("PerformanceExample._liste_virtualise_avec_paginat")}</li>
          <li>{t("PerformanceExample._cache_ct_client_avec_ttl_conf"")}</li>
          <li>{t("PerformanceExample._service_worker_pour_la_mise_e")}</li>
          <li>{t("PerformanceExample._web_vitals_monitoring")}</li>
          <li>{t("PerformanceExample._prchargement_des_ressources_c")}</li>
          <li>{t("PerformanceExample._compression_et_minification_a')}</li>
        </ul>
      </div>
    </div>);
`