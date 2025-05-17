import { View, Text, StyleSheet, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Colors from '../constants/Colors';
import { storage } from '../utils/storage';

export default function LoginScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      
      // Simulation d'une API pour la version minimale
      if (form.email && form.password) {
        const mockUser = {
          id: '1',
          email: form.email,
          name: 'Utilisateur Test',
        };
        
        await storage.setUser(mockUser);
        await storage.setAuth({
          token: 'mock-token-123',
          refreshToken: 'mock-refresh-token-123'
        });
        
        router.replace('/');
      } else {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <View style={styles.card}>
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
                placeholderTextColor={Colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                placeholder="Votre mot de passe"
                placeholderTextColor={Colors.muted}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <Pressable 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </Pressable>

            <Text style={styles.forgotPassword}>
              Mot de passe oublié ?
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#232336cc',
    borderRadius: 28,
    padding: 32,
    borderWidth: 1.5,
    borderColor: '#F7931A33',
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 32px 0 rgba(247,147,26,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
        backdropFilter: 'blur(12px)',
      },
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
    color: Platform.OS === 'web' ? 'transparent' : Colors.secondary,
    ...(Platform.OS === 'web' && { WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }),
    textAlign: 'center',
    letterSpacing: 0.2,
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
  },
  subtitle: {
    fontSize: 17,
    color: Colors.muted,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
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
    marginBottom: 2,
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.secondary,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    ...Platform.select({
      web: {
        transition: 'background 0.2s, color 0.2s',
        cursor: 'pointer',
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
    letterSpacing: 0.2,
  },
  forgotPassword: {
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 18,
    fontSize: 15,
    fontWeight: '500',
  },
}); 