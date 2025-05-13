import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../constants/Colors';

interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function CustomHeader({ title, showBack = true }: CustomHeaderProps) {
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={Colors.white} size={24} />
        </TouchableOpacity>
      )}
      <Animated.Text 
        style={[
          styles.title,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        {title}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
}); 