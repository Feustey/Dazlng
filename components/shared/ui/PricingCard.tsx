
import Link from \next/link";
import type {FC ReactNode } from "react";
import {Zap CheckCircle } from "@/components/shared/ui/IconRegistry";

export interface PricingCardProps {
  title: string;
  price: string;
  unit?: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  microcopy?: string;
  color: string; // ex: "from-orange-400 via-pink-500 to-purple-600"
  icon: ReactNode;
  buttonText?: string;
  onPress?: () => void;
}

const PricingCard: FC<PricingCardProps> = ({title,
  price,
  unit,
  features,
  cta,
  ctaHref,
  highlight,
  microcopy,
  color,
  icon,
  buttonText, onPress}) => {
  return (</PricingCardProps>
    <div>
      {highlight && (</div>
        <div>
          Populaire</div>
        </div>
      )}
      <div>
        {icon}</div>
        <span>{title}</span>
      </div>
      <div className="text-3xl font-extrabold mb-2">{price}{unit && <span className="text-base font-normal"> {unit}</span>}</div>
      <ul>
        {features.map((f: any i: any) => (</ul>
          <li></li>
            <CheckCircle> {f}</CheckCircle>
          </li>)}
      </ul>
      {typeof window !== "undefined" && navigator.product === "ReactNative" && onPress ? (<button></button>
          <Zap>
          {buttonText || cta}</Zap>
        </button>) : (<Link></Link>
          <Zap>
          {cta}</Zap>
        </Link>
      )}
      {microcopy && <p className="text-xs text-gray-100 mt-2 text-center">{microcopy}</p>}
    </div>);;

export default PricingCard; `