import { View, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import FormInput from './FormInput';
import Button from './Button';
import { sendEmail } from '../../../utils/email';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
  adminEmail?: string;
  customSubject?: string;
  buttonText?: string;
}

export default function ContactForm({
  onSubmitSuccess,
  onSubmitError,
  adminEmail = 'contact@dazno.de',
  customSubject,
  buttonText = 'Envoyer',
}: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!form.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!form.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    if (!form.message.trim()) {
      newErrors.message = 'Le message est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Email pour l'administrateur
      const adminResult = await sendEmail({
        to: adminEmail,
        subject: customSubject || `Nouveau message de contact de ${form.name}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${form.name}</p>
          <p><strong>Email:</strong> ${form.email}</p>
          <p><strong>Sujet:</strong> ${form.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${form.message}</p>
        `
      });

      // Email de confirmation pour l'utilisateur
      const userResult = await sendEmail({
        to: form.email,
        subject: 'Confirmation de votre message',
        html: `
          <h2>Merci de nous avoir contacté</h2>
          <p>Cher(e) ${form.name},</p>
          <p>Nous avons bien reçu votre message concernant "${form.subject}".</p>
          <p>Notre équipe vous répondra dans les plus brefs délais.</p>
          <p>Cordialement,<br>L'équipe DAZ3</p>
        `
      });

      if (adminResult.success && userResult.success) {
        Alert.alert(
          'Succès',
          'Votre message a été envoyé avec succès. Vous recevrez une confirmation par email.',
          [{ 
            text: 'OK', 
            onPress: () => {
              setForm({ name: '', email: '', subject: '', message: '' });
              onSubmitSuccess?.();
            }
          }]
        );
      } else {
        throw new Error('Échec de l\'envoi des emails');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Une erreur inconnue est survenue');
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
      onSubmitError?.(err);
      console.error('Erreur lors de l\'envoi des emails:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <FormInput
        label="Nom"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        placeholder="Votre nom"
        error={errors.name}
        editable={!isSubmitting}
      />

      <FormInput
        label="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        placeholder="votre@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        editable={!isSubmitting}
      />

      <FormInput
        label="Sujet"
        value={form.subject}
        onChangeText={(text) => setForm({ ...form, subject: text })}
        placeholder="Sujet de votre message"
        error={errors.subject}
        editable={!isSubmitting}
      />

      <FormInput
        label="Message"
        value={form.message}
        onChangeText={(text) => setForm({ ...form, message: text })}
        placeholder="Votre message"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        style={styles.textArea}
        error={errors.message}
        editable={!isSubmitting}
      />

      <Button
        onPress={handleSubmit}
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {isSubmitting ? 'Envoi en cours...' : buttonText}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
  textArea: {
    minHeight: 120,
  },
}); 