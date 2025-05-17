"use client";

import React, { useRef, useEffect } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

interface NotificationBadgeProps {
  count?: number;
  show: boolean;
}

export default function NotificationBadge({ count = 0, show }: NotificationBadgeProps) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    return () => {
      scale.setValue(0);
    };
  }, [scale]);

  if (!show || count === 0) return null;

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <Text style={styles.text}>{count}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F7931A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
}); 