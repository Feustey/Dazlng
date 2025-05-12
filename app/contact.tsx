import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Stack } from 'expo-router';
import Colors from '../constants/Colors';
import { sendEmail } from '../utils/email';

export default function ContactScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      // Email pour l'administrateur
      const adminResult = await sendEmail({
        to: 'contact@dazno.de', // Remplacez par votre email d'administration
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
          [{ text: 'OK', onPress: () => setForm({ name: '', email: '', subject: '', message: '' }) }]
        );
      } else {
        throw new Error('Échec de l\'envoi des emails');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
      console.error('Erreur lors de l\'envoi des emails:', error);
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

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Votre nom"
              placeholderTextColor={Colors.gray[400]}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              placeholder="votre@email.com"
              placeholderTextColor={Colors.gray[400]}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sujet</Text>
            <TextInput
              style={styles.input}
              value={form.subject}
              onChangeText={(text) => setForm({ ...form, subject: text })}
              placeholder="Sujet de votre message"
              placeholderTextColor={Colors.gray[400]}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.message}
              onChangeText={(text) => setForm({ ...form, message: text })}
              placeholder="Votre message"
              placeholderTextColor={Colors.gray[400]}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          <Pressable 
            style={[styles.button, isSubmitting && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
            </Text>
          </Pressable>
        </View>
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.secondary,
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
  textArea: {
    minHeight: 120,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 