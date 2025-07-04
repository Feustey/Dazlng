
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { Zap, CheckCircle } from '@/components/shared/ui/IconRegistry';

export interface PricingCardProps {
  title: string;
  price: string;
  unit?: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  microcopy?: string;
  color: string; // ex: 'from-orange-400 via-pink-500 to-purple-600'
  icon: ReactNode;
  buttonText?: string;
  onPress?: () => void;
}

const PricingCard: FC<PricingCardProps> = ({
  title,
  price,
  unit,
  features,
  cta,
  ctaHref,
  highlight,
  microcopy,
  color,
  icon,
  buttonText,
  onPress
}) => {
  return (
    <div className={`flex flex-col rounded-3xl shadow-2xl p-8 items-center bg-gradient-to-br ${color} relative text-white`}>
      {highlight && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-1 font-bold rounded-bl-xl rounded-tr-3xl shadow">
          Populaire
        </div>
      )}
      <div className="mb-4 text-2xl font-bold flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-3xl font-extrabold mb-2">{price}{unit && <span className="text-base font-normal"> {unit}</span>}</div>
      <ul className="mb-6 space-y-1 text-sm text-left w-full max-w-xs">
        {features.map((f: any, i: any) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle className="text-green-300" /> {f}
          </li>
        ))}
      </ul>
      {typeof window !== 'undefined' && navigator.product === 'ReactNative' && onPress ? (
        <button
          className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-base font-bold rounded-xl shadow-lg transition w-full md:w-auto"
          onClick={onPress}
        >
          <Zap className="w-4 h-4" />
          {buttonText || cta}
        </button>
      ) : (
        <Link href={ctaHref} className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-base font-bold rounded-xl shadow-lg transition w-full md:w-auto">
          <Zap className="w-4 h-4" />
          {cta}
        </Link>
      )}
      {microcopy && <p className="text-xs text-gray-100 mt-2 text-center">{microcopy}</p>}
    </div>
  );
};

export default PricingCard; 