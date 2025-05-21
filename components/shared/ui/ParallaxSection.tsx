'use client';

import React, { useRef } from 'react';
import Animated, { 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useSharedValue
} from 'react-native-reanimated';

interface ParallaxSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ParallaxSection({ title, children, className = '' }: ParallaxSectionProps): React.ReactElement {
  const scrollY = useSharedValue(0);
  const ref = useRef<HTMLDivElement>(null);

  const _scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const y = interpolate(
      scrollY.value,
      [0, 1],
      [-40, 40],
      'clamp'
    );
    return {
      transform: [{ translateY: y }],
    };
  });

  return (
    <section ref={ref} className={`parallax-section ${className} relative overflow-hidden`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </section>
  );
} 