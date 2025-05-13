import { Platform } from 'react-native';

// Couleurs de l'application
export const colors = {
  primary: '#3B82F6',
  secondary: '#1D4ED8',
  background: '#FFFFFF',
  text: '#1F2937',
  error: '#DC2626',
  success: '#059669',
  border: '#E5E7EB',
};

// Espacement
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Typography
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Styles partagés
export const shared = {
  // Container principal
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },

  // Boutons
  button: {
    primary: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
      ...Platform.select({
        web: {
          cursor: 'pointer',
          ':hover': {
            backgroundColor: colors.secondary,
          },
        },
      }),
    },
  },

  // Inputs
  input: {
    base: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: spacing.sm,
      fontSize: typography.sizes.base,
    },
  },

  // Text
  text: {
    base: {
      color: colors.text,
      fontSize: typography.sizes.base,
    },
    error: {
      color: colors.error,
      fontSize: typography.sizes.sm,
    },
  },
}; 