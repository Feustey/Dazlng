'use client';

import React from 'react';

export interface DazFlowAnalyticsProps {
  nodeId: string;
  className?: string;
}

const DazFlowAnalytics: React.FC<DazFlowAnalyticsProps> = ({ nodeId, className = '' }) => {
  // Temporairement désactivé pour permettre le build
  return (
    <div className={`p-8 text-center ${className}`}>
      <p className="text-gray-600">{t('DazFlowAnalytics.composant_dazflow_analytics_te')}</p>
      <p className="text-sm text-gray-500 mt-2">Node ID: {nodeId}</p>
    </div>
  );
};

export default DazFlowAnalytics; 