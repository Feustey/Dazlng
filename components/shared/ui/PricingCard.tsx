import Card from "./Card";
import GradientTitle from "./GradientTitle";

export interface PricingCardProps {
  title: string;
  price?: string;
  features?: string[];
  description?: string;
  buttonText: string;
  onPress: () => void;
  variant?: 'plan' | 'addon';
}

export default function PricingCard({
  title,
  price,
  features,
  description,
  buttonText,
  onPress,
  variant = 'plan',
}: PricingCardProps): React.ReactElement {
  return (
    <Card className={variant === 'addon' ? 'border-2 border-yellow-400' : ''}>
      <GradientTitle className="text-2xl mb-3">{title}</GradientTitle>
      {price && <div className="text-3xl text-yellow-500 font-bold mb-4">{price}</div>}
      {description && <div className="text-base text-gray-600 mb-4">{description}</div>}
      {features && features.map((feature, index) => (
        <div key={index} className="text-base mb-1 text-gray-800">• {feature}</div>
      ))}
      <button
        className="w-full bg-yellow-400 py-4 px-9 rounded-2xl mt-4 font-bold text-[#232336] shadow-lg transition-colors duration-200 hover:bg-yellow-300 active:opacity-85 active:scale-97"
        onClick={onPress}
        type="button"
      >
        {buttonText}
      </button>
    </Card>
  );
} 