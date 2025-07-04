import React from "react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({title, subtitle}) => {
  return (</HeroSectionProps>
    <section></section>
      <h1 className="text-4xl font-extrabold text-[#C026D3] mb-3 text-center tracking-wide">{title}</h1>
      <p className="text-lg text-gray-700 leading-7 text-center font-medium">{subtitle}</p>
    </section>);

export default HeroSection;
