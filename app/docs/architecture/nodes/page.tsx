"use client";
import React from 'react';

const NodesArchitecturePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('common.architecture_des_nuds')}</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600">{t('common.documentation_en_cours_de_rdac')}</p>
        </div>
      </div>
    </div>
  );
};

export default NodesArchitecturePage; 