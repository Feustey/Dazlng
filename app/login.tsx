import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { Stack } from 'expo-router';
import Colors from '../constants/Colors';

export default function LoginScreen() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleLogin = () => {
    // Implémentation de la connexion à venir
    console.log('Login attempt:', form);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Connexion',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>
          Connectez-vous pour accéder à votre espace personnel
        </Text>

        <View style={styles.form}>
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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              placeholder="Votre mot de passe"
              placeholderTextColor={Colors.gray[400]}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </Pressable>

          <Text style={styles.forgotPassword}>
            Mot de passe oublié ?
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
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
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
}); 