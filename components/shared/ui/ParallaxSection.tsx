'use client';

import React from 'react';
// import { interpolate, useSharedValue } from 'react-native-reanimated';

interface ParallaxSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ParallaxSection({ title, children, className = '' }: ParallaxSectionProps): React.ReactElement {
  return (
    <section className={`parallax-section ${className} relative overflow-hidden`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div>
        {children}
      </div>
    </section>
  );
} 