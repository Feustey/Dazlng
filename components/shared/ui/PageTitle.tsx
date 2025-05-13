import { Text, StyleSheet, TextStyle, View } from 'react-native';

interface PageTitleProps {
  children: string;
  style?: TextStyle;
}

export default function PageTitle({ children, style }: PageTitleProps) {
  return (
    <View>
      <Text style={[styles.title, style]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
}); 