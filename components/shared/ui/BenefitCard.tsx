import React from 'react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LucideProps } from 'lucide-react-native';

interface BenefitCardProps {
  icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGElement>>;
  title: string;
  description: string;
  iconColor?: string;
  iconSize?: number;
}

export default function BenefitCard({
  icon: IconComponent,
  title,
  description,
  iconColor = '#F7931A',
  iconSize = 32,
}: BenefitCardProps): React.ReactElement {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow flex-1 min-w-[250px] max-w-[350px] m-3">
      <IconComponent size={Number(iconSize)} color={iconColor} />
      <h3 className="text-xl font-extrabold text-[#C026D3] mt-4 mb-2 text-center tracking-wide">{title}</h3>
      <p className="text-base text-gray-700 text-center leading-6">{description}</p>
    </div>
  );
} 