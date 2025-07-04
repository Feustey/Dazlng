'use client';

import React from 'react';

export const dynamic = 'force-dynamic';
export default function TestHeaderPage() {
  return (
    <div className="min-h-screen">
      {/* Hero section pour tester le header sur fond moderne */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Header Amélioré ✨
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Navigation moderne, responsive et accessible
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('common._fonctionnalits')}</h3>
              <ul className="space-y-2 text-sm">
                <li>{t('common._navigation_complte')}</li>
                <li>{t('common._menu_mobile_anim')}</li>
                <li>{t('common._effets_de_scroll')}</li>
                <li>{t('common._accessibilit_aria')}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('common.corrections')}</h3>
              <ul className="space-y-2 text-sm">
                <li>{t('common._erreurs_dhydration_corriges')}</li>
                <li>{t('common._warnings_image_rsolus')}</li>
                <li>{t('common._performance_optimise')}</li>
                <li>{t('common._code_robuste_et_maintenable')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sections pour tester le scroll */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('common.test_du_scroll')}</h2>
          <p className="text-gray-600 text-lg">
            Scrollez pour voir le header changer d'apparence de manière fluide.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Navigation</h2>
          <p className="text-gray-600 text-lg">
            Testez la navigation desktop et mobile en redimensionnant votre navigateur.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('common.accessibilit')}</h2>
          <p className="text-gray-600 text-lg">
            Le header est maintenant entièrement accessible avec les attributs ARIA appropriés.
          </p>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">{t('common._header_parfaitement_fonctionn')}</h2>
          <p className="text-gray-300 mb-6">
            Toutes les améliorations ont été implémentées avec succès !
          </p>
          <a 
            href="/" 
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </footer>
    </div>
  );
}
