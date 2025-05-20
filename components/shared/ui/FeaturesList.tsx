import React from 'react';

interface FeaturesListProps {
  title?: string;
  features: string[];
}

export default function FeaturesList({
  title = 'Fonctionnalités incluses :',
  features,
}: FeaturesListProps): React.ReactElement {
  return (
    <div className="p-7 rounded-2xl shadow-lg mb-8 bg-white">
      <h3 className="text-xl font-extrabold mb-4 text-[#C026D3] text-center tracking-wide">{title}</h3>
      {features.map((feature, index) => (
        <div key={index} className="text-base mb-2 text-gray-700 text-center">• {feature}</div>
      ))}
    </div>
  );
} 