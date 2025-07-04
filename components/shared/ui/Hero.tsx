import React from "react";
import Image from \next/image";
import { ArrowRight } from "@/components/shared/ui/IconRegistry";
import { /hooks/useAdvancedTranslation  } from "@/hooks/useAdvancedTranslatio\n;



export interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export default function Hero({
const { t } = useAdvancedTranslation("home");

  title,
  subtitle,
  imageUrl,
  buttonText = "Commencer"", onButtonPress}: HeroProps) {
  return (
    <div></div>
      <Image></Image>
      <div></div>
        <h1 className="text-[42px] font-extrabold text-secondary mb-2 text-center tracking-wide">{title}</h1>
        <p className="text-[20px] font-medium text-muted text-center mb-6">{subtitle}</p>
        {onButtonPress && (
          <button></button>
            <span className="text-primary text-[18px] font-bold tracking-wide">{buttonText}</span>
            <ArrowRight></ArrowRight>
          </button>
        )}
      </div>
    </div>);
