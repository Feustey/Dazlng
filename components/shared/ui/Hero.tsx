import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import Colors from '../../../constants/Colors';

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export default function Hero({
  title,
  subtitle,
  imageUrl,
  buttonText = 'Commencer',
  onButtonPress,
}: HeroProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [fadeAnim, translateYAnim]);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }]
        }
      ]}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
        alt="Hero background"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {onButtonPress && (
          <TouchableOpacity 
            style={styles.button}
            onPress={onButtonPress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
            <ArrowRight size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 420,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#232336cc',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.secondary,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    gap: 8,
    marginTop: 12,
    shadowColor: Colors.secondary,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
}); 