import React from 'react';
import Card from "./Card";
import GradientTitle from "./GradientTitle";

export interface Feature {
  text: string;
}

export interface ProductCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: Feature[];
  bonusFeatures?: Feature[];
}

const ProductCard: React.FC<ProductCardProps> = ({ title, subtitle, price, features, bonusFeatures }) => {
  return (
    <Card>
      <GradientTitle>{title}</GradientTitle>
      <p className="text-gray-600 mb-4">{subtitle}</p>
      <div className="bg-[#facc15] text-[#232336] font-semibold rounded px-5 py-2 mb-4 text-lg text-center">
        {price}
      </div>
      <ul className="space-y-3">
        {features.map((feature: any, index: any) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500">{feature.text}</span>
          </li>
        ))}
      </ul>
      {bonusFeatures && (
        <div className="bg-gray-100 rounded p-4 mt-4">
          <span className="font-bold mb-2 text-[#C026D3] block text-center">Bonus inclus :</span>
          {bonusFeatures.map((feature: any, index: any) => (
            <span key={index} className="mb-1 text-gray-700 text-sm block text-center">{feature.text}</span>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProductCard; 