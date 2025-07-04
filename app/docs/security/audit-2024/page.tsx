"use client";
import React from 'react';

const SecurityAuditPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('common.audit_de_scurit_2024')}</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600">{t('common.rapport_daudit_de_scurit_en_co')}</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditPage; 