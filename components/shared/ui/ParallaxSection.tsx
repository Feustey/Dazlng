'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

export default function ParallaxSection({ title, children, className = '', offset = 0 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Effet parallax : translation verticale de -40px à 40px selon le scroll
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={ref} className={`parallax-section ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {title && <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>{title}</h2>}
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </section>
  );
} 