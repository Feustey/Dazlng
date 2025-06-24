import React from 'react';

export default function HeroSection({ title, subtitle }: { title: string; subtitle: string }): React.FC {
  return (
    <section className="bg-white rounded-2xl shadow-lg mb-24 p-8">
      <h1 className="text-4xl font-extrabold text-[#C026D3] mb-3 text-center tracking-wide">{title}</h1>
      <p className="text-lg text-gray-700 leading-7 text-center font-medium">{subtitle}</p>
    </section>
};
}
