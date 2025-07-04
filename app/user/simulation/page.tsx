'use client';

import React from 'react';

export default function SimulationPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Simulation</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">{t('user.page_de_simulation_en_cours_de')}</p>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";