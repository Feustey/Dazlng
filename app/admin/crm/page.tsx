"use client";

import React from "react";

export default function CRMPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">CRM Avancé</h1>
        <p className="text-gray-600">Gestion complète des clients et prospects</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Fonctionnalités CRM</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-2xl mr-3">👥</span>
            <span>Gestion des contacts et prospects</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-3">📧</span>
            <span>Campagnes d'email marketing</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-3">📊</span>
            <span>Analytics et rapports</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎯</span>
            <span>Segmentation des clients</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            Le CRM avancé est en cours de développement. Utilisez les sections 
            "Communications" et "Utilisateurs" pour gérer vos clients pour le moment.
          </p>
        </div>
      </div>
    </div>
  );
}
