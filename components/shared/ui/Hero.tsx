import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export default function Hero({
  title,
  subtitle,
  imageUrl,
  buttonText = 'Commencer',
  onButtonPress,
}: HeroProps) {
  return (
    <div className="relative w-full h-[420px]">
      <Image
        src={imageUrl}
        alt="Hero background"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover rounded-[28px]"
        priority
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-[#232336cc] rounded-[28px] border-[1.5px] border-secondary shadow-[0_8px_32px_0_rgba(0,0,0,0.18)]">
        <h1 className="text-[42px] font-extrabold text-secondary mb-2 text-center tracking-wide">{title}</h1>
        <p className="text-[20px] font-medium text-muted text-center mb-6">{subtitle}</p>
        {onButtonPress && (
          <button
            className="flex flex-row items-center bg-secondary py-3 px-8 rounded-[25px] gap-2 mt-3 shadow-md hover:opacity-90"
            onClick={onButtonPress}
            type="button"
          >
            <span className="text-primary text-[18px] font-bold tracking-wide">{buttonText}</span>
            <ArrowRight size={18} color="var(--color-primary, #fff)" />
          </button>
        )}
      </div>
    </div>
  );
}
