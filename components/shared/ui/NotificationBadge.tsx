import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '../../../constants/Colors';

interface NotificationBadgeProps {
  count?: number;
  show: boolean;
}

export default function NotificationBadge({ count, show }: NotificationBadgeProps) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (show) {
      Animated.spring(scale, {
        toValue: 1,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [show]);

  if (!show) return null;

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          transform: [{ scale }],
        },
      ]}
    >
      {count !== undefined && (
        <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 