import React, { FC } from 'react';

const NodeRecommendationsPage: FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('user.recommandations_personnalises')}</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <p>{t('user.recommandations_ia_pour_optimi')}</p>
      </div>
    </div>
  );
};

export default NodeRecommendationsPage;export const dynamic = "force-dynamic";
