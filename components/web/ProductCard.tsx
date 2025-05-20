'use client';

import Card from "../shared/ui/Card";
import GradientTitle from "../shared/ui/GradientTitle";

interface ProductCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: { text: string }[];
}

export default function ProductCard(props: ProductCardProps): React.ReactElement {
  return (
    <Card>
      <GradientTitle>{props.title}</GradientTitle>
      <p className="text-gray-600 mb-4">{props.subtitle}</p>
      <p className="text-2xl font-bold mb-6">{props.price}</p>
      <ul className="space-y-3">
        {props.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500">{feature.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
} 