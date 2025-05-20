'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ParallaxSection({ title, children, className = '' }: ParallaxSectionProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Effet parallax : translation verticale de -40px à 40px selon le scroll
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={ref} className={`parallax-section ${className} relative overflow-hidden`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </section>
  );
} 