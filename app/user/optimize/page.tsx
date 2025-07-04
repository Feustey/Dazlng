import React, { FC } from 'react';

const OptimizePage: FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('user.centre_doptimisation')}</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <p>{t('user.outils_doptimisation_automatiq')}</p>
      </div>
    </div>
  );
};

export default OptimizePage;export const dynamic = "force-dynamic";
