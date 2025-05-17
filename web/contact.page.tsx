"use client";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';
import ContactForm from 'components/shared/ui/ContactForm';
import { useState } from 'react';
import { sendEmail } from 'utils/email';

export default function ContactScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({} as Partial<typeof form>);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = 'Le nom est requis';
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email invalide';
    if (!form.subject.trim()) newErrors.subject = 'Le sujet est requis';
    if (!form.message.trim()) newErrors.message = 'Le message est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMsg('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await sendEmail({
        to: 'contact@dazno.de',
        subject: `Nouveau message de contact de ${form.name}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${form.name}</p>
          <p><strong>Email:</strong> ${form.email}</p>
          <p><strong>Sujet:</strong> ${form.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${form.message}</p>
        `
      });
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Contact',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Contactez-nous</Text>
        <Text style={styles.subtitle}>
          Une question ? Un projet ? N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
        </Text>

        <ContactForm />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 30,
    lineHeight: 24,
  },
}); 