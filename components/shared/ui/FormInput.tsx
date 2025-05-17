import { View, Text, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import Colors from '../../../constants/Colors';

export interface FormInputProps extends TextInputProps {
  label: string;
  optional?: boolean;
  error?: string;
}

export default function FormInput({
  label,
  optional,
  error,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  ...props
}: FormInputProps) {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {optional && (
          <Text style={styles.optional}>(optionnel)</Text>
        )}
      </View>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray[600]}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        {...props}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
    letterSpacing: 0.1,
  },
  optional: {
    fontSize: 15,
    color: Colors.muted,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.gray[400],
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 17,
    color: Colors.text,
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 15,
    color: Colors.error,
    marginTop: 4,
    fontWeight: '500',
  },
}); 