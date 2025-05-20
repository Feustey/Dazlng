import Card from "./Card";
import GradientTitle from "./GradientTitle";

interface Feature {
  text: string;
}

interface ProductCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: Feature[];
  bonusFeatures?: Feature[];
}

const ProductCard = ({ title, subtitle, price, features, bonusFeatures }: ProductCardProps): React.ReactElement => {
  return (
    <Card>
      <GradientTitle>{title}</GradientTitle>
      <p className="text-gray-600 mb-4">{subtitle}</p>
      <div className="bg-[#facc15] text-[#232336] font-semibold rounded px-5 py-2 mb-4 text-lg text-center">
        {price}
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500">{feature.text}</span>
          </li>
        ))}
      </ul>
      {bonusFeatures && (
        <div className="bg-gray-100 rounded p-4 mt-4">
          <span className="font-bold mb-2 text-[#C026D3] block text-center">Bonus inclus :</span>
          {bonusFeatures.map((feature, index) => (
            <span key={index} className="mb-1 text-gray-700 text-sm block text-center">{feature.text}</span>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProductCard; 