import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useEmail } from '@/hooks/useEmail';
import { colors, spacing, typography, shared } from 'styles/shared';

export default function ContactForm() {
  const { sending, error, sendEmail } = useEmail();
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async () => {
    const success = await sendEmail({
      to: formData.email,
      subject: formData.subject,
      html: formData.message
    });

    if (success) {
      setFormData({ email: '', subject: '', message: '' });
      // Ici vous pourriez utiliser une alerte native ou un toast
      alert('Email envoyé avec succès !');
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
            placeholder="Votre email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sujet</Text>
          <TextInput
            style={styles.input}
            value={formData.subject}
            onChangeText={(value) => setFormData(prev => ({ ...prev, subject: value }))}
            placeholder="Sujet de votre message"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.message}
            onChangeText={(value) => setFormData(prev => ({ ...prev, message: value }))}
            placeholder="Votre message"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            sending && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={sending}
        >
          <Text style={styles.buttonText}>
            {sending ? 'Envoi en cours...' : 'Envoyer'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
  },
  form: {
    marginVertical: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    ...shared.input.base,
    width: '100%',
  },
  textArea: {
    height: spacing.xl * 3,
    textAlignVertical: 'top',
  },
  error: {
    color: colors.error,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.md,
  },
  button: {
    ...filterButtonStyle(shared.button.primary),
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: '500',
    textAlign: 'center',
  },
});

function filterButtonStyle(styleObj: any) {
  const { cursor, transition, ':hover': _hover, ...rest } = styleObj;
  return rest;
} 