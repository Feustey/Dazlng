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
  fontFamily: 'Inter, sans-serif', // Web uniquement
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

// Styles partagés pour web
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
      boxShadow: `0 4px 12px ${colors.black}20`, // Web shadow
      cursor: 'pointer',
      transition: 'background 0.2s',
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