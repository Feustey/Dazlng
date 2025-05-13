'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { View, Text, StyleSheet } from 'react-native';

interface ParallaxSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

export default function ParallaxSection({ title, children, className = '', offset = 50 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <div ref={ref} className={`relative overflow-hidden ${className}`}>
        <motion.div
          style={{ y }}
          className="relative"
        >
          {children}
        </motion.div>
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
}); 