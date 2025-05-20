"use client";

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface TabBarIconProps {
  Icon: LucideIcon;
  color: string;
  size: number;
  focused: boolean;
}

export default function TabBarIcon({ Icon, color, size, focused }: TabBarIconProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    return () => {
      scaleAnim.stopAnimation();
    };
  }, [focused, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Icon size={size} color={color} />
    </Animated.View>
  );
} 