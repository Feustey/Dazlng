'use client';

import React from 'react';
// import { interpolate, useSharedValue } from 'react-native-reanimated';

export interface ParallaxSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ParallaxSection({ title, children, className = '' }: ParallaxSectionProps): React.FC {
  return (
    <section className={`parallax-section ${className} relative overflow-hidden`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div>
        {children}
      </div>
    </section>
};
}
