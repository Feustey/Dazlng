'use client';

interface ProductCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: { text: string }[];
}

export default function ProductCard({ title, subtitle, price, features }: ProductCardProps) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-2 gradient-title">{title}</h3>
      <p className="text-gray-600 mb-4">{subtitle}</p>
      <p className="text-2xl font-bold mb-6">{price}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500">{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 