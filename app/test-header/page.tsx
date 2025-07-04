"use client";

import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

export default function TestHeaderPage() {
  const { t } = useAdvancedTranslation("common");

  return (
    <div className="min-h-screen">
      {/* Hero section pour tester le header sur fond moderne */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Header Amélioré ✨
          </h1>
          <p className="text-xl mb-12 text-white/90">
            Navigation moderne, responsive et accessible
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t("common.fonctionnalites")}</h3>
              <ul className="space-y-2 text-left">
                <li>• {t("common.navigation_complete")}</li>
                <li>• {t("common.menu_mobile_anim")}</li>
                <li>• {t("common.effets_de_scroll")}</li>
                <li>• {t("common.accessibilite_aria")}</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t("common.corrections")}</h3>
              <ul className="space-y-2 text-left">
                <li>• {t("common.erreurs_hydration_corrigees")}</li>
                <li>• {t("common.warnings_image_resolus")}</li>
                <li>• {t("common.performance_optimisee")}</li>
                <li>• {t("common.code_robuste_et_maintenable")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sections pour tester le scroll */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t("common.test_du_scroll")}</h2>
          <p className="text-lg text-gray-600">
            Scrollez pour voir le header changer d'apparence de manière fluide.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Navigation</h2>
          <p className="text-lg text-gray-600">
            Testez la navigation desktop et mobile en redimensionnant votre navigateur.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t("common.accessibilite")}</h2>
          <p className="text-lg text-gray-600">
            Le header est maintenant entièrement accessible avec les attributs ARIA appropriés.
          </p>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{t("common.header_parfaitement_fonctionnel")}</h2>
          <p className="text-lg text-gray-300 mb-8">
            Toutes les améliorations ont été implémentées avec succès !
          </p>
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </footer>
         </div>
   );
}