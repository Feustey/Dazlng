/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '@/src/styles/shared';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

interface WebStyle extends ViewStyle {
  cursor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  style,
  ...props
}) => {
  const webStyles: WebStyle | undefined = Platform.select({
    web: {
      cursor: 'pointer',
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        webStyles,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          styles[`${size}Text`],
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  smText: {
    fontSize: typography.sizes.sm,
  },
  mdText: {
    fontSize: typography.sizes.base,
  },
  lgText: {
    fontSize: typography.sizes.lg,
  },
}); 