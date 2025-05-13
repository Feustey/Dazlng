import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
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
          error && styles.inputError
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray[400]}
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
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.secondary,
  },
  optional: {
    fontSize: 14,
    color: Colors.gray[500],
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.secondary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
}); 