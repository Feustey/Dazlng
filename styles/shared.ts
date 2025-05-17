import { Platform } from 'react-native';
import Colors from '../constants/Colors';

// Couleurs de l'application (importées depuis Colors.ts)
export const colors = Colors;

// Espacement
export const spacing = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
};

// Typographie
export const typography = {
  fontFamily: Platform.select({
    web: 'Inter, sans-serif',
    default: 'System',
  }),
  sizes: {
    xs: 13,
    sm: 15,
    base: 17,
    lg: 22,
    xl: 28,
    '2xl': 36,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    base: 1.5,
    tight: 1.2,
    loose: 1.7,
  },
};

// Styles partagés
export const shared = {
  // Container principal
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
  },

  // Boutons
  button: {
    primary: {
      backgroundColor: colors.secondary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: 25,
      shadowColor: colors.black,
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      ...Platform.select({
        web: {
          cursor: 'pointer',
          transition: 'background 0.2s',
          ':hover': {
            backgroundColor: colors.text,
            color: colors.secondary,
          },
        },
      }),
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.secondary,
      color: colors.secondary,
      borderRadius: 25,
    },
  },

  // Inputs
  input: {
    base: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: spacing.sm,
      fontSize: typography.sizes.base,
      color: colors.text,
    },
    focus: {
      borderColor: colors.secondary,
    },
    error: {
      borderColor: colors.error,
    },
  },

  // Text
  text: {
    base: {
      color: colors.text,
      fontSize: typography.sizes.base,
      fontFamily: typography.fontFamily,
    },
    muted: {
      color: colors.muted,
    },
    error: {
      color: colors.error,
      fontSize: typography.sizes.sm,
    },
    title: {
      color: colors.white,
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      fontFamily: typography.fontFamily,
    },
    subtitle: {
      color: colors.muted,
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.medium,
      fontFamily: typography.fontFamily,
    },
  },
}; 