"use client";

import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

export default function ExplorerPage() {
  const { t } = useAdvancedTranslation("explorer");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">
          {t("network.explorateur_du_reseau_lightning")}
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600">
            Explorateur du réseau Lightning en cours de développement.
          </p>
        </div>
      </div>
    </div>
  );
}
