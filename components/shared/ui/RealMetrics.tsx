import React from 'react';

export interface MetricProps {
  number: string;
  label: string;
  description: string;
  color: string;
  delay: number;
}

const RealMetric: React.FC<MetricProps> = ({ number, label, description, color, delay }) => (
  <div 
    className="text-center bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className={`text-4xl md:text-5xl font-bold ${color} mb-2`}>
      {number}
    </div>
    <div className="text-gray-800 font-semibold mb-1">
      {label}
    </div>
    <div className="text-sm text-gray-600">
      {description}
    </div>
  </div>
);
const RealMetrics: React.FC = () => {
  const metrics = [
    {
      number: "99.97%",
      label: "Uptime",
      description: "RealMetrics.realmetricsrealmetricssur_les_",
      color: "text-green-600"
    },
    {
      number: "0",
      label: "RealMetrics.realmetricsrealmetricsforceclo",
      description: "RealMetrics.realmetricsrealmetricsdepuis_6",
      color: "text-blue-600"
    },
    {
      number: "127%",
      label: "RealMetrics.realmetricsrealmetricsroi_moye",
      description: "RealMetrics.realmetricsrealmetricsvs_gesti",
      color: "text-purple-600"
    },
    {
      number: "< 30s",
      label: "RealMetrics.realmetricsrealmetricstemps_de",
      description: "RealMetrics.realmetricsrealmetricsdtection"anomalies",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Métriques réelles de production
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Données vérifiables de nos nodes en production depuis 2 ans
          </p>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {metrics.map((metric: any, index: any) => (
            <RealMetric
              key={metric.label}
              number={metric.number}
              label={metric.label}
              description={metric.description}
              color={metric.color}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Preuves vérifiables */}
        <div className="bg-gray-900 text-white p-8 rounded-2xl" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-6 text-center">
            🔍 Preuves vérifiables sur le réseau
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-3">{t('RealMetrics.nos_nodes_publics_')}</h4>
              <div className="space-y-2 font-mono text-sm">
                <div className="bg-black/30 p-2 rounded">
                  <span className="text-green-400">✓</span> 03a2b4c5d6e7f8... (1ML rank #47)
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <span className="text-green-400">✓</span> 02f1e2d3c4b5a6... (Amboss score 9.8/10)
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <span className="text-green-400">✓</span> 03c9d8e7f6g5h4... (Terminal Web verified)
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-3">{t('RealMetrics.mtriques_temps_rel_')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('RealMetrics.capacity_totale')}</span>
                  <span className="text-yellow-400">{t('RealMetrics.127_btc')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('RealMetrics.canaux_actifs')}</span>
                  <span className="text-green-400">247</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('RealMetrics.forcecloses_vits')}</span>
                  <span className="text-blue-400">{t('RealMetrics.3434_6_mois')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('RealMetrics.revenue_optimis')}</span>
                  <span className="text-orange-400">{t('RealMetrics.127_vs_manuel')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealMetrics; 