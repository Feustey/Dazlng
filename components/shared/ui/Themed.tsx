import { Text as DefaultText, View as DefaultView, TextStyle, ViewStyle, TextProps, ViewProps } from 'react-native';
import Colors from '../../../constants/Colors';

interface ThemedTextProps extends TextProps {
  style?: TextStyle;
}

interface ThemedViewProps extends ViewProps {
  style?: ViewStyle;
}

const styles = {
  text: {
    color: Colors.black,
  } as TextStyle,
  view: {
    backgroundColor: Colors.background,
  } as ViewStyle,
};

export function Text({ style, ...otherProps }: ThemedTextProps) {
  return <DefaultText style={[styles.text, style]} {...otherProps} />;
}

export function View({ style, ...otherProps }: ThemedViewProps) {
  return <DefaultView style={[styles.view, style]} {...otherProps} />;
} 