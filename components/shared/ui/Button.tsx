import { Pressable, Text, StyleSheet, ActivityIndicator, View, Platform } from 'react-native';
import Colors from '../../../constants/Colors';

interface ButtonProps {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export default function Button({
  children,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return Colors.gray[500];
    switch (variant) {
      case 'secondary':
        return Colors.background;
      case 'outline':
        return 'transparent';
      default:
        return Colors.secondary;
    }
  };

  const getTextColor = () => {
    if (disabled) return Colors.gray[700];
    if (variant === 'outline') return Colors.secondary;
    if (variant === 'secondary') return Colors.secondary;
    return Colors.primary;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 10, paddingHorizontal: 22 };
      case 'large':
        return { paddingVertical: 18, paddingHorizontal: 36 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 28 };
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outlineButton,
        getPadding(),
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        variant === 'secondary' && styles.secondaryButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            color={getTextColor()} 
            size="small"
          />
        ) : (
          <Text style={[
            styles.text,
            { color: getTextColor() },
            size === 'small' && styles.smallText,
            size === 'large' && styles.largeText,
          ]}>
            {children}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    ...Platform.select({
      web: {
        transition: 'background 0.2s, color 0.2s',
        cursor: 'pointer',
      },
    }),
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    backgroundColor: 'transparent',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    backgroundColor: Colors.background,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  smallText: {
    fontSize: 15,
  },
  largeText: {
    fontSize: 22,
  },
}); 