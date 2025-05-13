import { View, StyleSheet, ViewStyle } from 'react-native';
import type { PropsWithChildren } from 'react';

interface PageLayoutProps extends PropsWithChildren {
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function PageLayout({ children, style, contentStyle }: PageLayoutProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
}); 